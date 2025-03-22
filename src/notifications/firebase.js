import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDwenDeM3il8TIiFMUPb0GpyjMGUn1eC_U",
    authDomain: "dove0101.firebaseapp.com",
    projectId: "dove0101",
    storageBucket: "dove0101.firebasestorage.app",
    messagingSenderId: "206783732985",
    appId: "1:206783732985:web:f3e029c1664a39ee169628",
    measurementId: "G-BZYDVEXFP1"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then(function(registration) {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(function(error) {
      console.error('Service Worker registration failed:', error);
    });
}



export const generateToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BFEh52B2gdCHFyKNo71vgG3Vg5crEdg2H4b2FLLjiAizybXHlwy73MQTUI0FVA9h1PH3Oy9dtc1wSJ6FVmj7MUE"
      });
      console.log("Token received:", token);
      return token;
    } else {
      console.error("Notification permission denied");
    }
  } catch (error) {
    console.error("An error occurred while retrieving token:", error);
  }
};
