import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/Homepage";
import ChatPage from "./pages/ChatPage";
import Navbar from "./components/Navbar";
import UsersPage from "./pages/UsersPage";
import './output.css';
import './style.css';
import './styles/hometheme.css';
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./layout/Layout";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import Tasks from "./pages/Tasks";
import { Tooltip } from 'react-tooltip'
import { getToken } from 'firebase/messaging';
import { messaging } from './firebase-config';
import { onMessage } from 'firebase/messaging';
import toast from "react-hot-toast";
import SplashScreen from "./components/SplashScreen";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/signin" />;
};


function App() {

  const [users, setUsers] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    document.addEventListener("DOMContentLoaded", () => setShowSplash(false));
  }, []);
  useEffect(() => {
    // Hide splash screen after animation completes
    const timer = setTimeout(() => setShowSplash(false), 2500); // Adjust timing to match animation duration
    return () => clearTimeout(timer);
  }, []);


  const requestPermission = async () => {
    try {
      // Check if notification permission is already granted
      const permission = Notification.permission;

      if (permission === 'granted') {
        console.log('Notification permission already granted.');

        // Register the service worker with the correct scope
        if ('serviceWorker' in navigator) {
          // Register the service worker manually with the correct path
          const registration = await navigator.serviceWorker.register('./firebase-messaging-sw.js');
          console.log('Service Worker registered with scope:', registration.scope);

          // Now, get the token with the custom service worker registration
          const currentToken = await getToken(messaging, {
            vapidKey: 'BFEh52B2gdCHFyKNo71vgG3Vg5crEdg2H4b2FLLjiAizybXHlwy73MQTUI0FVA9h1PH3Oy9dtc1wSJ6FVmj7MUE',  // Your VAPID key here
            serviceWorkerRegistration: registration, // Pass the custom service worker registration
          });

          if (currentToken) {
            console.log('FCM Token:', currentToken);
            const requestData = {
              //   userId: userObject.id,
              token: currentToken,
            };

            // const response = await fetch("https://apacvault.com/webapi/saveFcmToken", {
            //   method: "POST",
            //   headers: {
            //     "Content-Type": "application/json",
            //   },
            //   body: JSON.stringify(requestData),
            // });

            // if (response.ok) {
            //   const result = await response.json();
            //   console.log("FCM token successfully saved:", result);
            // } else {
            //   console.error("Failed to save FCM token:", response.status, response.statusText);
            // }

          } else {
            console.log('No registration token available.');
          }
        } else {
          console.error('Service Workers are not supported in this browser.');
        }
      } else if (permission === 'default') {
        // Request permission if not already granted
        const permissionRequest = await Notification.requestPermission();
        if (permissionRequest === 'granted') {
          console.log('Notification permission granted.');
          setPermissionGranted(true);
          requestPermission();  // Re-run the permission request logic after granting
        } else {
          console.log('Notification permission denied.');
        }
      } else {
        console.log('Notification permission denied.');
      }

    } catch (error) {
      console.error('Error getting notification permission or token:', error);
    }
  };

  useEffect(() => {

    requestPermission();

    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload.notification.body);  // Check this log to see the incoming message
      if (payload && payload.notification) {
        // Handle the notification payload data as needed
        toast(payload.notification.body);
        //alert(payload.data.google.c.a.c_l)
      }
    });
  }, []);

  useEffect(() => {
    // Fetch users for the select dropdown
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/fetchallusers");
        const data = await response.json();

        if (data.status) {
          const userOptions = data.data.map(user => ({
            value: user.id,
            label: user.name,
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.profile_pic || "", // Assuming `profile_pic` contains the image URL
          }));
          setUsers(userOptions);
        } else {
          console.error("Failed to fetch users:", data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };



    fetchUsers();
  }, []);
  return (
    <AuthProvider>
     
        <Router>
          {/* <Navbar /> */}
          <Routes>
            <Route path="/signin" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<HomePage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/tasks" element={<Tasks users={users} />} />
            </Route>
          </Routes>
        </Router>
      <Toaster />
      <Tooltip id="my-tooltip" />
    </AuthProvider>
  );
}

export default App;
