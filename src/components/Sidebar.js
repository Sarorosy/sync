import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Package, ChevronLeft, ChevronRight, LogOut, Store, BadgeCheck, Map, Bell, Users, Newspaper, Cannabis, MessageCircleQuestion, CheckCircle, CircleCheck, Users2, PlusCircle } from "lucide-react";
import logo from '../assets/logo-black.svg';
import { useAuth } from "../context/AuthContext";
import ConfirmationModal from "./ConfirmationModal";
import { AnimatePresence } from "framer-motion";
import NotificationDiv from "./NotificationDiv";
import teamSvg from '../assets/team.svg';

const Sidebar = ({isExpanded}) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationsDivOpen, setNotificationDivOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    if (!user?.token) return;
    try {
      const response = await fetch("https://ryupunch.com/leafly/api/Vendor/get_notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter((n) => !n.read).length);
      } else {
        console.error("Failed to fetch notifications:", data.message);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  return (
    <div className={` bg-white text-black shadow-2xl transition-all duration-300 ${isExpanded ? "w-48" : "w-16"} flex flex-col relative`}>

      <div className={`${isExpanded ? "justify-end" : "justify-center"} flex items-center p-3`}>
        
        
      </div>

      {/* Sidebar Links */}
      <ul className="space-y-2 flex-1 overflow-x-hidden ">
        <li>
          <Link to="/" className={`${isExpanded ? "pl-10" : "justify-center"} flex items-center gap-3 text-md p-2 rounded-lg primary-text-hover transition-all duration-200 `}>
            <Home size={18} /> {isExpanded && "Home"}
          </Link>
        </li>
        <li>
          <Link to="/tasks" className={`${isExpanded ? "pl-10" : "justify-center"} flex items-center gap-3 text-md p-2 rounded-lg primary-text-hover transition-all duration-200 `}>
            <CircleCheck size={18} /> {isExpanded && "My Tasks"}
          </Link>
        </li>
        <li>
          <Link to="/users" className={`${isExpanded ? "pl-10" : "justify-center"} flex items-center gap-3 text-md p-2 rounded-lg primary-text-hover transition-all duration-200 `}>
            <Users2 size={18} /> {isExpanded && "Users"}
          </Link>
        </li>
        <li className={`${isExpanded ? "pl-10 justify-between" : "justify-center"} flex  flex items-center gap-3 text-md p-2 rounded-lg primary-text-hover transition-all duration-200 `}>
          
            <img src={teamSvg} className="w-5 h-5" />{isExpanded && <Link to="/teams/create" > <PlusCircle size={18} /> </Link>}
          
        </li>
        
      </ul>





      <ConfirmationModal
        isOpen={isModalOpen}
        message="Are you sure you want to log out?"
        smallMessage="You will be redirected to the login page."
        onConfirm={handleLogout}
        onCancel={() => setIsModalOpen(false)}
      />

      {/* Logout Button */}
      <div className="p-3">
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-3 text-md w-full p-2 rounded-lg  text-red-700 transition-all ">
          <LogOut size={18} /> {isExpanded && "Logout"}
        </button>
      </div>

      <AnimatePresence>
        {notificationsDivOpen && (
          <NotificationDiv onClose={() => { setNotificationDivOpen(false) }} />
        )}

      </AnimatePresence>
    </div>
  );
};

export default Sidebar;
