import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import Select from "react-select";

import { Calendar, CircleX, Clock, UserCircle, UserRound } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { useAuth } from "../../context/AuthContext";
import Quill from "quill";

function AddTask({ onTaskAdded, onClose, users }) {
    const { user } = useAuth();
    const [task, setTask] = useState({
        title: "",
        description: "",
        assigned_to: "",
        followers: [],
        status: "pending",
        priority: "medium",
        due_date: "",
        due_time: "",
        created_by: user?.id, // Replace with logged-in user ID
    });
    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (!document.querySelector("#editor .ql-toolbar")) {
            const quill = new Quill("#editor", {
                theme: "snow",
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, false] }],
                        ['bold', 'italic', 'underline'],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['clean']
                    ]
                }
            });

            quill.on("text-change", () => {
                handleDescriptionChange(quill.root.innerHTML); // Get HTML content
            });

            const editor = document.querySelector(".ql-editor");
            const toolbar = document.querySelector(".ql-toolbar");

            toolbar.style.opacity = "0";

            editor.addEventListener("focus", () => {
                toolbar.style.opacity = "1";
            });

            editor.addEventListener("blur", () => {
                setTimeout(() => {
                    toolbar.style.opacity = "0";
                }, 200);
            });
        }
    }, []);


    const handleFollowersChange = (selectedOptions) => {
        setTask((prev) => ({
            ...prev,
            followers: selectedOptions.map(option => option.value), // Store only IDs
        }));
    };

    const filteredFollowers = users.filter(user => user.value !== task.assigned_to);

    const filteredUsers = users.filter(user =>
        user.label.toLowerCase().includes(search.toLowerCase())
    );
    const handleDescriptionChange = (value) => {
        setTask((prev) => ({ ...prev, description: value }));
    };




    const dateRef = useRef(null);
    const timeRef = useRef(null);

    useEffect(() => {
        flatpickr(dateRef.current, {
            dateFormat: "Y-m-d",
            defaultDate: task.due_date || null,
            onChange: ([date]) => handleChange({ target: { name: "due_date", value: date.toISOString().split("T")[0] } })
        });

        flatpickr(timeRef.current, {
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            time_24hr: true,
            defaultDate: task.due_time || null,
            onChange: ([time]) => {
                const formattedTime = time.toTimeString().split(" ")[0];
                handleChange({ target: { name: "due_time", value: formattedTime } });
            }
        });
    }, [task]);

    const handleChange = (e) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };
    const getRandomColor = (id) => {
        const colors = [
            "bg-red-300", "bg-blue-300", "bg-green-300",
            "bg-yellow-300", "bg-purple-300", "bg-pink-300",
            "bg-indigo-300", "bg-teal-300", "bg-orange-300"
        ];
        return colors[id % colors.length]; // Assigns a color based on user ID
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(task)
            console.log(user)
            const response = await axios.post("http://localhost:5000/api/tasks/create/", task);
            if (response.data.status) {
                toast.success("Task added successfully!");
                onTaskAdded();
                onClose();
                setTask({
                    title: "",
                    description: null,
                    assigned_to: null,
                    status: "pending",
                    priority: "medium",
                    due_date: "",
                    due_time: "",
                    created_by: 1,
                });
            }
        } catch (error) {
            //  toast.error("Failed to add task.");
            console.log(error)
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-full max-w-3xl bg-gray-50 shadow-md z-50 overflow-y-auto p-6 w-2xl"
        >
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
                <CircleX className="cursor-pointer" onClick={onClose} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        name="title"
                        value={task.title}
                        onChange={handleChange}
                        required
                        className="w-full rounded px-3 py-2 mt-1 border-none outline-none focus:ring-0 focus:border-transparent"
                        placeholder="Write a task name"
                    />
                </div>



                <div className="flex items-center w-full gap-2">

                    <div className="relative w-2/5">
                        {/* Input wrapper with icon */}
                        <div className="relative flex items-center">
                            <UserRound size={24} className="absolute left-3 text-gray-500 border border-gray-600 p-1 rounded-full border-dashed" />

                            {/* Input field */}
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onFocus={() => setShowDropdown(true)}
                                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                placeholder="Assignee"
                                className="w-full pl-10 pr-8 py-2 border rounded-md focus:outline-none focus:ring-transparent"
                            />

                            {/* Clear button */}
                            {task.assigned_to && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setTask({ ...task, assigned_to: null });
                                        setSearch("");
                                    }}
                                    className="absolute right-3 text-gray-500 hover:text-red-500"
                                >
                                    <CircleX size={20} />
                                </button>
                            )}
                        </div>

                        {/* Dropdown list */}
                        {showDropdown && filteredUsers.length > 0 && (
                            <div className="absolute left-0 w-full bg-white border rounded-md shadow-lg max-h-40 overflow-auto mt-1 z-10">
                                {filteredUsers.map((user) => (
                                    <div
                                        key={user.value}
                                        onClick={() => {
                                            console.log("Assigned to ID:", user.value); // Debugging log
                                            setTask({ ...task, assigned_to: user.value });
                                            setSearch(user.label);
                                            setShowDropdown(false);
                                        }}
                                        onMouseDown={() => { // Use onMouseDown to prevent onBlur issues
                                            console.log("Assigned to ID:", user.value); // Debugging log
                                            setTask({ ...task, assigned_to: user.value }); // Set ID
                                            setSearch(user.label);
                                            setShowDropdown(false);
                                        }}
                                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center space-x-3"
                                    >
                                        {/* Avatar or first letter */}
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.label} className="w-8 h-8 rounded-full" />
                                        ) : (
                                            <div className={`w-8 h-8 flex items-center justify-center ${getRandomColor(user.value)} text-gray-700 rounded-full`}>
                                                {user.label.charAt(0).toUpperCase()}
                                            </div>
                                        )}

                                        {/* User Name */}
                                        <span>{user.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>



                    <div className="w-1/5">
                        <select
                            name="priority"
                            value={task.priority}
                            onChange={handleChange}
                            className="w-full border-none rounded px-3 py-2 mt-1 focus:ring-transparent focus:border-none"

                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                    {/* Due Date Picker */}
                    <div className="flex items-center w-2/5">
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                ref={dateRef}
                                className="w-full pl-10 border outline-none focus:ring-0 rounded px-3 py-2 mt-1"
                                placeholder="Due Date"
                            />
                        </div>

                        {/* Time Input */}
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                ref={timeRef}
                                className="w-full pl-10 border outline-none focus:ring-0 rounded px-3 py-2 mt-1"
                                placeholder="Due Time"
                            />
                        </div></div>
                </div>

                <div style={{ display: "flex", flexDirection: "column-reverse" }} className="border rounded-md">
                    <div id="editor" style={{ border: "none", background: "white" }}>

                    </div>
                </div>
                <div className="w-2/5">
                    <Select
                        isMulti
                        options={filteredFollowers}
                        getOptionLabel={(e) => (
                            <div className="flex items-center space-x-2">
                                {e.avatar ? (
                                    <img src={e.avatar} alt={e.label} className="w-6 h-6 rounded-full" />
                                ) : (
                                    <div className={`w-6 h-6 flex items-center justify-center ${getRandomColor(e.value)} text-gray-700 rounded-full`}>
                                        {e.label.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span>{e.label}</span>
                            </div>
                        )}
                        value={users.filter(u => (task.followers || []).includes(u.value))}
                        onChange={handleFollowersChange}
                        className="basic-multi-select"
                        placeholder="Select Followers"
                    />
                </div>
                <button
                    type="submit"
                    className="w-48 bg-black text-white py-2 rounded"
                >
                    Create
                </button>
            </form>
        </motion.div>
    );
}

export default AddTask;
