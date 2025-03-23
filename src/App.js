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
import Profile from "./pages/user/Profile";
import ViewTask from "./pages/task/ViewTask";
import Users from "./pages/users/Users";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/signin" />;
};


function App() {

  const [users, setUsers] = useState([]);
  
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    document.addEventListener("DOMContentLoaded", () => setShowSplash(false));
  }, []);
  useEffect(() => {
    // Hide splash screen after animation completes
    const timer = setTimeout(() => setShowSplash(false), 2500); // Adjust timing to match animation duration
    return () => clearTimeout(timer);
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
            avatar: user.profile_pic ? "http://localhost:5000" + user.profile_pic : "", // Assuming `profile_pic` contains the image URL
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
              <Route path="/users" element={<Users />} />
              <Route path="/tasks" element={<Tasks users={users} />} />
              <Route path="/tasks/:unique_id" element={<Tasks users={users} />} />
              <Route path="/tasks/:unique_id/:full_screen" element={<Tasks users={users} />} />
              <Route path="/profile" element={<Profile users={users} />} />
            </Route>
          </Routes>
        </Router>
      <Toaster />
      <Tooltip id="my-tooltip" />
    </AuthProvider>
  );
}

export default App;
