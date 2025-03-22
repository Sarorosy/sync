import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { ChevronDown, ChevronLeft, ChevronRight, CircleUserRound, LogOut, Plus, PlusCircle, User } from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";
import { AnimatePresence } from "framer-motion";
import AddTask from "../pages/task/AddTask";
import toast from "react-hot-toast";
import { Search, CheckCircle, Folder, Flag, MoreHorizontal } from "lucide-react";

const Header = ({ toggleExpand, isExpanded }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);


  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  const [results, setResults] = useState([]);
  const allResults = [
    "Task 1: Fix bug in login",
    "Project: Website Redesign",
    "Meeting with Dev Team",
    "Task 2: Improve UI/UX",
    "Project: Mobile App Development",
  ];

  const filters = [
    { name: "Tasks", icon: <CheckCircle className="w-4 h-4 text-gray-600" /> },
    { name: "Projects", icon: <Folder className="w-4 h-4 text-gray-600" /> },
    { name: "People", icon: <User className="w-4 h-4 text-gray-600" /> },
    { name: "Portfolios", icon: <Flag className="w-4 h-4 text-red-500" /> },
    { name: "Goals", icon: <Flag className="w-4 h-4 text-red-500" /> },
    { name: "More", icon: <MoreHorizontal className="w-4 h-4 text-gray-600" /> },
  ];

  const recentSearches = [
    { name: "Deva Test new", type: "task" },
    { name: "web.dev.6@redmarked.com", type: "email" },
    { name: "Draft project proposal", type: "project" },
    { name: "Incorporate feedback", type: "task" },
    { name: "Web Development", type: "category" },
  ];

  const savedSearches = [
    "Tasks I’ve created",
    "Tasks I’ve assigned to others",
    "Recently completed tasks",
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim()) {
      setResults(
        allResults.filter((item) =>
          item.toLowerCase().includes(query.toLowerCase())
        )
      );
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query]);

  // Hide results when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <header className="bg-white primary-border-bottom  shadow-md py-1 flex justify-between items-center px-8">
      {/* <h1 className="text-2xl font-semibold ">Welcome {user?.name.charAt(0).toUpperCase() + user?.name.slice(1)}</h1> */}


      <div className="transition-all duration-300 bg-transparent overflow-hidden flex items-center">
        <button

          onClick={toggleExpand} className="p-1 primary-bg text-white rounded-full transition-transform mr-5">
          {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
        <svg className="h-6 w-auto" viewBox="0 0 855 220" fill="none" xmlns="http://www.w3.org/2000/svg">

          <path class="down-arrow" d="M718.215 127.475L663.543 117.007C658.137 115.972 652.925 119.34 651.9 124.531L641.541 177.029C639.889 185.403 649.604 191.615 656.938 186.875L674.263 175.677C689.133 195.817 711.723 210.764 738.822 215.953C788.244 225.416 836.102 199.254 853.805 155.949C854.94 153.171 853.143 150.061 850.085 149.475L826.716 145C824.461 144.569 822.22 145.679 821.257 147.674C808.028 175.095 776.645 190.655 745.067 184.637C727.511 181.291 712.204 171.839 701.717 157.934L721.97 144.845C729.304 140.104 726.935 129.145 718.215 127.475Z" fill="#FF6200" />
          <path class="up-arrow" d="M792.939 48.4683C777.928 39.4464 760.142 36.3308 742.593 39.7066C711.009 45.7819 687.842 71.802 686.005 102.094C685.872 104.299 684.216 106.156 681.961 106.587L658.591 111.062C655.534 111.648 652.685 109.427 652.681 106.433C652.626 59.7473 687.05 17.8296 736.473 8.36616C763.572 3.17728 790.2 8.70018 811.646 21.8858L823.452 5.11061C828.449 -1.99073 839.819 0.183912 841.471 8.55726L851.831 61.0557C852.855 66.2465 849.303 71.2934 843.898 72.3285L789.226 82.797C780.506 84.4667 774.141 75.1795 779.138 68.0778L792.939 48.4683Z" fill="#FF6200" />
          <path d="M8.7 216V178.2H98.7C103.1 178.2 107.1 177.1 110.7 174.9C114.3 172.7 117.2 169.8 119.4 166.2C121.6 162.4 122.7 158.3 122.7 153.9C122.7 149.3 121.6 145.2 119.4 141.6C117.2 137.8 114.3 134.8 110.7 132.6C107.1 130.4 103.1 129.3 98.7 129.3H63.6C51.8 129.3 41.1 126.9 31.5 122.1C21.9 117.3 14.2 110.4 8.4 101.4C2.8 92.2 0 81.2 0 68.4C0 55.8 2.7 44.9 8.1 35.7C13.5 26.3 20.8 19 30 13.8C39.2 8.59999 49.4 5.99998 60.6 5.99998H151.8V43.8H64.8C60.8 43.8 57.1 44.9 53.7 47.1C50.3 49.1 47.6 51.8 45.6 55.2C43.8 58.6 42.9 62.4 42.9 66.6C42.9 70.8 43.8 74.6 45.6 78C47.6 81.4 50.3 84.1 53.7 86.1C57.1 88.1 60.8 89.1 64.8 89.1H101.1C114.1 89.1 125.4 91.6 135 96.6C144.6 101.6 152 108.6 157.2 117.6C162.6 126.6 165.3 137.1 165.3 149.1C165.3 163.3 162.5 175.4 156.9 185.4C151.5 195.4 144.1 203 134.7 208.2C125.5 213.4 115.3 216 104.1 216H8.7Z" fill="black" />
          <path d="M255.134 216V158.1C242.134 155.3 230.634 150.2 220.634 142.8C210.834 135.4 203.134 125.9 197.534 114.3C192.134 102.5 189.434 89 189.434 73.8V5.99998H232.334V76.5C232.334 84.9 234.134 92.6 237.734 99.6C241.334 106.4 246.434 111.9 253.034 116.1C259.834 120.3 267.734 122.4 276.734 122.4C285.934 122.4 293.834 120.3 300.434 116.1C307.034 111.9 312.134 106.4 315.734 99.6C319.334 92.6 321.134 84.9 321.134 76.5V5.99998H364.034V73.8C364.034 89 361.234 102.5 355.634 114.3C350.234 125.9 342.534 135.5 332.534 143.1C322.734 150.5 311.234 155.5 298.034 158.1V216H255.134Z" fill="black" />
          <path d="M546.108 219.6C533.708 219.6 522.808 216.8 513.408 211.2C504.008 205.4 496.708 197.8 491.508 188.4C486.308 178.8 483.708 168.3 483.708 156.9V60C483.708 56.4 482.808 53.1 481.008 50.1C479.208 47.1 476.808 44.7 473.808 42.9C470.808 41.1 467.508 40.2 463.908 40.2C460.308 40.2 457.008 41.1 454.008 42.9C451.208 44.7 448.908 47.1 447.108 50.1C445.308 53.1 444.408 56.4 444.408 60V216H401.508V65.1C401.508 53.5 404.108 43 409.308 33.6C414.508 24.2 421.808 16.7 431.208 11.1C440.608 5.29999 451.508 2.39999 463.908 2.39999C476.508 2.39999 487.508 5.29999 496.908 11.1C506.308 16.7 513.608 24.2 518.808 33.6C524.008 43 526.608 53.5 526.608 65.1V162C526.608 165.6 527.508 168.9 529.308 171.9C531.108 174.9 533.408 177.3 536.208 179.1C539.208 180.9 542.508 181.8 546.108 181.8C549.708 181.8 553.008 180.9 556.008 179.1C559.008 177.3 561.408 174.9 563.208 171.9C565.008 168.9 565.908 165.6 565.908 162V5.99998H608.808V156.9C608.808 168.3 606.208 178.8 601.008 188.4C595.808 197.8 588.508 205.4 579.108 211.2C569.708 216.8 558.708 219.6 546.108 219.6Z" fill="black" />
        </svg>

      </div>

      <div className="relative w-full max-w-2xl mx-auto px-4 py-0.5" ref={searchRef}>
        {/* Search Input */}
        <div className="relative flex items-center border border-gray-300 rounded-xl shadow-sm bg-white px-3 py-1">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            className="w-full px-3 text-md text-gray-500 outline-none focus:border-none focus:ring-0"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowResults(true)}
          />
        </div>

        {/* Filters */}


        {/* Dropdown Results */}
        {showResults && (
          <div className="absolute  bg-white shadow-lg border border-gray-200 rounded-xl mt-0 topmost px-3 py-2">
            <div className="flex gap-3 mb-3 mx-auto">
              {filters.map((filter, index) => (
                <button
                  key={index}
                  className="flex items-center gap-2 px-2 py-0.5 text-gray-700 border rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  {filter.icon} {filter.name}
                </button>
              ))}
            </div>

            {/* Recent Searches */}
            <h4 className="text-sm font-semibold text-gray-600">Recents</h4>
            {recentSearches.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer">
                <CheckCircle className="w-5 h-5 text-gray-500" />
                <span className="text-gray-800">{item.name}</span>
              </div>
            ))}

            {/* Saved Searches */}
            <h4 className="text-sm font-semibold text-gray-600 mt-4">Saved Searches</h4>
            <div className="flex gap-2 flex-wrap">
              {savedSearches.map((search, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-gray-700 bg-gray-100 border rounded-full cursor-pointer hover:bg-gray-200"
                >
                  {search}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* <button
        onClick={() => { setAddTaskOpen(true) }}
        data-tooltip-id="my-tooltip"
        data-tooltip-content="Add New Task"
        data-tooltip-place="top"
        className="fixed bottom-6 right-6 primary-bg text-white p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
      >
        <PlusCircle size={24} />
      </button> */}

      {/* User Profile Section */}
      <div className="relative">
        <button
          className="flex items-center gap-2px-4 px-1 py-0.5 rounded-full border transition"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <CircleUserRound className="font-light text-gray-400" />
          <span className="ml-1">{user?.name.charAt(0).toUpperCase() + user?.name.slice(1)}</span>
          <ChevronDown size={18} />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="topmost absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full text-left px-4 py-1 text-gray-500 flex items-center gap-2 hover:bg-gray-100 rounded-lg"
            >
              <User size={24} className="border p-1 rounded-full" /> Profile
            </button>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        message="Are you sure you want to log out?"
        smallMessage="You will be redirected to the login page."
        onConfirm={logout}
        onCancel={() => setIsModalOpen(false)}
      />

      <AnimatePresence>
        {addTaskOpen && <AddTask onClose={() => { setAddTaskOpen(false) }} onTaskAdded={() => { toast.success("Task Added") }} />}
      </AnimatePresence>

    </header>
  );
};

export default Header;
