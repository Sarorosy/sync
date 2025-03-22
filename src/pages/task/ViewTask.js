import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import Select from "react-select";
import { ArrowRight, Calendar, CircleCheck, CircleX, Clock, Link, MoreHorizontal, UserCircle, UserRound } from "lucide-react";
import DatePicker from "react-datepicker";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Embed from "@editorjs/embed";
import ImageTool from "@editorjs/image";
import Quote from "@editorjs/quote";
import Delimiter from "@editorjs/delimiter";
import Checklist from "@editorjs/checklist";
import "react-datepicker/dist/react-datepicker.css";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { io } from "socket.io-client";
import { debounce } from "lodash";
import CommentBox from "./CommentBox";
import CommentsandLogs from "./views/CommentsandLogs";


const socket = io("http://localhost:5000");

function ViewTask({ selectedTask, onClose, users }) {
    const [task, setTask] = useState({
        title: selectedTask.title,
        description: JSON.parse(selectedTask.description).data,
        assigned_to: selectedTask.assigned_to,
        followers: "",
        status: selectedTask.status,
        priority: "medium",
        due_date: selectedTask.due_date,
        due_time: selectedTask.due_time,
        created_by: 1, // Replace with logged-in user ID
    });

    useEffect(() => {
        if (selectedTask) {
            setTask({
                title: selectedTask.title,
                description: JSON.parse(selectedTask.description).data,
                assigned_to: selectedTask.assigned_to,
                followers: "",
                status: selectedTask.status,
                priority: "medium",
                due_date: selectedTask.due_date,
                due_time: selectedTask.due_time,
                created_by: 1, // Replace with logged-in user ID
            });
        }
    }, [selectedTask]);

    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [showTitle, setShowTitle] = useState(false);
    const scrollContainerRef = useRef(null);

    const priorityColors = {
        low: "bg-green-500",
        medium: "bg-yellow-500",
        high: "bg-orange-500",
        urgent: "bg-red-500",
    };

    useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                const scrollTop = scrollContainerRef.current.scrollTop;
                const scrollHeight = scrollContainerRef.current.scrollHeight;
                const clientHeight = scrollContainerRef.current.clientHeight;

                // Calculate scroll percentage
                const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;

                // Show title if scrolled 20% down
                setShowTitle(scrollPercent >= 3);
            }
        };

        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);
    const filteredUsers = users.filter(user =>
        user.label.toLowerCase().includes(search.toLowerCase())
    );

    const editorInstance = useRef(null);

    useEffect(() => {
        if (!editorInstance.current) {
            editorInstance.current = new EditorJS({
                holder: "editorjs",
                placeholder: "Write task description...",
                tools: {
                    paragraph: Paragraph,
                    header: { class: Header, inlineToolbar: true },
                    list: { class: List, inlineToolbar: true },
                    checklist: { class: Checklist, inlineToolbar: true },
                    quote: { class: Quote, inlineToolbar: true },
                    delimiter: Delimiter,
                    embed: Embed,
                    image: {
                        class: ImageTool,
                        config: {
                            endpoints: {
                                byFile: "http://localhost:5000/api/tasks/upload-image",
                                byUrl: "http://localhost:5000/api/tasks/fetch-image",
                            },
                            field: "image",
                            types: "image/*",
                        },
                    },
                },
                onReady: () => {
                    if (selectedTask.description) {
                        try {
                            const savedData = JSON.parse(selectedTask.description);
                            editorInstance.current.render(savedData);
                        } catch (error) {
                            console.error("Error parsing description:", error);
                        }
                    }
                },
                onChange: async () => {
                    const content = await editorInstance.current.save();
                        const jsonData = JSON.stringify(content);
                        setTask((prev) => ({ ...prev, description: jsonData }));
                        updateTaskDescription(jsonData);
                        console.log(jsonData);
                },
            });
        }

        return () => {
            if (editorInstance.current && typeof editorInstance.current.destroy === "function") {
                editorInstance.current.destroy();
                editorInstance.current = null;
            }
        };
    }, [selectedTask]); // Ensure it updates when selectedTask changes


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
        if (e.target.name == "title") {
            updateTaskTitle(e.target.value);
        }
    };

    const updateTaskTitle = debounce((updatedTitle) => {
        socket.emit("update_task_title", { taskId: selectedTask.id, title: updatedTitle });
    }, 500); 

    useEffect(() => {
        socket.on("task_updated", (data) => {
            if (data.taskId === task.id) {
                setTask((prev) => ({ ...prev, title: data.title }));
            }
        });

        return () => {
            socket.off("task_updated");
        };
    }, [task.id]);


    const updateTaskDescription = useCallback(
        debounce((updatedDescription) => {
            socket.emit("update_task_description", { taskId: selectedTask.id, description: updatedDescription });
        }, 500),
        [selectedTask.id] // Ensures debounce is stable
    );

    useEffect(() => {
        socket.on("task_description_updated", (data) => {
            if (data.taskId === task.id) {
                setTask((prev) => ({ ...prev, description: data.description }));
            }
        });

        return () => {
            socket.off("task_description_updated");
        };
    }, [task.id]);

    return (
        <div
            ref={scrollContainerRef}
            style={{ overflowY: "scroll", height: "90vh" }}
            className="max-w-5xl bg-gray-50 shadow-md  ml-1 border-l-1 w-2xl scrollbar-none"
        >
            <div className="sticky top-0 bg-white border-b-2 w-full h-12 flex justify-between px-3 items-center z-50">
                {showTitle && <h2 className="pl-2 text-gray-500">{task.title}</h2>}
                {!showTitle && <button className="px-3 py-1 text-sm border text-gray-400 rounded-md flex items-center hover:bg-green-200 hover:text-green-700"

                >
                    <CircleCheck size={20} className="mr-2" />
                    Mark as complete
                </button>}
                <div className="flex items-center">
                    <button
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="More"
                        data-tooltip-place="top"
                        className="text-gray-600 mr-2">
                        <MoreHorizontal size={24} className="cursor-pointer " />
                    </button>
                    <button
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Copy Task Link"
                        data-tooltip-place="top"
                        className="text-gray-600 mr-2">
                        <Link size={20} className="cursor-pointer " />
                    </button>
                    <ArrowRight size={30} className=" text-gray-600 cursor-pointer border border-transparent hover:border-gray-400 duration-300 rounded-full p-1" onClick={onClose} />


                </div>
            </div>

            <form className="space-y-2  px-6 pt-3">
                <div>
                    <input
                        type="text"
                        name="title"
                        value={task.title}
                        onChange={handleChange}
                        required
                        className="w-full rounded font-semibold text-2xl px-3 py-2 mt-1 border border-transparent outline-none focus:ring-0 focus:border-gray-400"
                        placeholder="Write a task name"
                    />
                </div>



                <div className="flex items-center w-full gap-2 ">

                    <div className=" w-2/5">
                        {/* Input wrapper with icon */}
                        <div className=" flex items-center">
                            <UserRound size={24} className=" text-gray-500 border border-gray-600 p-1 rounded-full border-dashed" />

                            <p
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content="Assignee"
                                data-tooltip-place="right"
                                className="ml-3 bg-slate-300 px-1 py-0.5 rounded"> {selectedTask.assigned_user_name ?? "No Assignee"}</p>
                        </div>

                    </div>



                    <div className="w-1/5 flex items-center gap-2">
                        {/* Color Circle */}
                        <div
                            className={`w-4 h-4 rounded-full ${priorityColors[task.priority]}`}
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content={`Priority: ${task.priority}`}
                            data-tooltip-place="right"
                        ></div>

                        {/* Priority Label */}
                        <span className="text-gray-700 capitalize">{task.priority}</span>

                    </div>
                    {/* Due Date Picker */}
                    <div className="flex items-center w-3/5">
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

                <div className="bg-white z-49">
                    <div id="editorjs" className="border rounded px-3 py-2 mt-1 scrollbar-none" ></div>
                </div>

            </form>
            <CommentsandLogs taskId={selectedTask.id} />
            <div className="sticky w-full bottom-0 z-50">
                <CommentBox users={users} taskId={selectedTask.id} />
            </div>
        </div>
    );
}

export default ViewTask;
