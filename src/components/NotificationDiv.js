import { useState, useEffect,useRef } from "react";
import { motion } from "framer-motion";
import { X, Plus, Trash, Bell } from "lucide-react";
import "select2/dist/css/select2.css";
import "select2";
import $ from "jquery";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const NotificationDiv = ({ onClose}) => {
  const [formData, setFormData] = useState({
    name: "",
    images: [null], // Start with one file input
    description: "",
    thc: "",
    cbg: "",
    dominant_terpene: "",
    price: "",
    feelings: [],
    negatives: [],
    helps_with: [],
  });

  const feelingsRef = useRef(null);
  const negativesRef = useRef(null);
  const helpsWithRef = useRef(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);




  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 right-0 h-full w-full sm:w-2/3 lg:w-1/3 bg-white shadow-2xl z-50 overflow-y-auto p-6  rounded-l-3xl"
    >
      <div className="flex justify-between items-center p-2 rounded mb-6 bg-green-200 text-white">
        <h2 className="text-2xl font-bold text-green-800 flex items-center"><Bell size={20} className="mr-2"/>Notifications</h2>
        <button onClick={onClose} className="p-1 rounded-full bg-gray-200 hover:bg-red-600 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>
    </motion.div>
  );
};

export default NotificationDiv;
