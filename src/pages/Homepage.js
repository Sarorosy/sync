import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, LayoutPanelLeft } from "lucide-react";
const themes = [
    { name: "Default", class: "cont-default" },
    { name: "Purple", class: "cont-purple" },
    { name: "Green", class: "cont-green" },
    { name: "Blue", class: "cont-blue" },
    { name: "Red", class: "cont-red" },
    { name: "Yellow", class: "cont-yellow" },
    { name: "Pink", class: "cont-pink" },
    { name: "Gray", class: "cont-gray" },
];

function HomePage() {
    const { user, setHomeTheme } = useAuth();
    const [bgTheme, setBgTheme] = useState(user.hometheme ?? "cont-default");
    const [isOpen, setIsOpen] = useState(false);

    const setTheme = (value) => {
        setBgTheme(value);
        setHomeTheme(value);
    }
    const [greeting, setGreeting] = useState("");

    // Function to determine greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    // Update greeting dynamically
    useEffect(() => {
        setGreeting(getGreeting());
    }, []);

    return (
        <div className={` flex flex-col items-center justify-start transition-all duration-500 ${bgTheme}`}>


            <AnimatePresence>
                {/* Offcanvas Sidebar */}
                {isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsOpen(false)}>
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ duration: 0.3 }}
                            className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg p-5 flex flex-col z-50"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-red-500 text-lg self-end"
                            >
                                <ArrowRight size={18} />
                            </button>

                            <h2 className="text-xl font-light mb-4">Customize Home</h2>

                            <div className="grid grid-cols-3 gap-3">
                                {themes.map((theme) => (
                                    <div
                                        key={theme.class}
                                        className={`cursor-pointer h-12 w-12 rounded-full flex items-center justify-center shadow-md font-semibold text-white text-sm ${theme.class + '-test' === bgTheme ? "" : ""
                                            } ${theme.class + '-test'}`}
                                        onClick={() => setTheme(theme.class)}
                                    >

                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Greeting Section */}
            <div className="text-center mt-5">
                <p className="text-lg font-light tracking-wide opacity-80">
                    {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                    })}
                </p>
                <h1 className="text-4xl md:text-5xl font-semibold mt-4 text-gray-800">
                    {greeting}, <span className="font-bold">{user?.name?.charAt(0).toUpperCase() + user?.name?.slice(1) || "Guest"}</span>
                </h1>
                <div className="flex my-3 justify-end">
                    <button
                        onClick={() => setIsOpen(true)}
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Customize theme"
                        data-tooltip-place="right"
                        className="flex items-center bg-white border border-gray-400 text-gray-800 px-3 py-1 rounded-lg shadow-md hover:border-gray-500 transition"
                    >
                        Customize <LayoutPanelLeft size={18} className="ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
