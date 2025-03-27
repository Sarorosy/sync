import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import Select from "react-select";
import { ArrowRight, Calendar, CircleCheck, CircleX, Clock, Copy, Expand, Link, Maximize, Maximize2, Minimize, Minimize2, MoreHorizontal, Tag, Trash2, UserCircle, UserRound, X } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { io } from "socket.io-client";
import { debounce } from "lodash";
import CommentBox from "./CommentBox";
import CommentsandLogs from "./views/CommentsandLogs";
import { useAuth } from "../../context/AuthContext";
import Quill from "quill";
import CryptoJS from "crypto-js";
import { useParams } from "react-router-dom";
import TaskDetailsLoader from "./TaskDetailsLoader";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import Collaborators from "./Collaborators";

const socket = io("http://localhost:5000");

function ViewTask({ selectedTask, onClose, users, isFullScreen, handleFullScreenClick }) {
    const { unique_id } = useParams();
    const [task, setTask] = useState({
        id: "",
        unique_id: "",
        title: "",
        description: "",
        assigned_to: "",
        assigned_user_name: "",
        followers: "",
        follower_names : "",
        status: "",
        priority: "medium",
        due_date: "",
        due_time: "",
        tags: [],
        created_by: 1, // Replace with logged-in user ID
    });
    const user = useAuth();
    const [loading, setLoading] = useState(false);

    /////////////////////////// MENU & TAGS //////////////////
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const menuRef = useRef(null);

    const tagsList = [
        { name: "On Hold", bgColor: "bg-yellow-500" },
        { name: "Important", bgColor: "bg-red-500" },
        { name: "Urgent", bgColor: "bg-orange-500" },
        { name: "Completed", bgColor: "bg-green-500" }
    ];
    const [showTagModal, setShowTagModal] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [tagSearch, setTagSearch] = useState("");
    const [filteredTags, setFilteredTags] = useState(tagsList);
    const modalRef = useRef(null);

    useEffect(() => {
        if (selectedTags && selectedTags.length > 0) {
            socket.emit("updated_tags", {
                taskId: task.id,
                tags: selectedTags
            });
        }
    }, [selectedTags]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMoreOptions(false);
            }
            // if (modalRef.current && !modalRef.current.contains(event.target)) {
            //     setShowTagModal(false);
            // }

        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // useEffect(() => {
    //     setFilteredTags(tagsList.filter(tag => tag.toLowerCase().includes(tagSearch.toLowerCase())));
    // }, [tagSearch]);

    const addTag = (tag) => {
        if (!selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);
        }
        setTagSearch("");
    };

    const removeTag = (tag) => {
        setSelectedTags(selectedTags.filter(t => t !== tag));
    };
    ////////////////////////////////////////////////////
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }], // Text color & highlight
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['blockquote', 'code-block'],
            ['clean']
        ]
    };
    useEffect(() => {
        const fetchTask = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5000/api/tasks/${selectedTask}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const data = await response.json();
                if (data.status) {
                    setTask({
                        unique_id: data.task.unique_id,
                        id: data.task.id,
                        title: data.task.title,
                        description: data.task.description,
                        assigned_user_name: data.task.assigned_user_name,
                        assigned_to: data.task.assigned_to,
                        followers: data.task.followers ?? "",
                        follower_names : data.task.follower_names ?? null,
                        status: data.task.status,
                        priority: data.task.priority,
                        due_date: data.task.due_date,
                        due_time: data.task.due_time,
                        tags: JSON.parse(data.task.tags),
                        created_by: data.task.created_by,
                    });
                    setSelectedTags(data.task.tags ? JSON.parse(data.task.tags) : []);
                } else {
                    console.error("Failed to fetch task");
                }
            } catch (error) {
                console.error("Error fetching task:", error);
            } finally {
                setLoading(false);
            }
        };

        if (selectedTask) {
            fetchTask();
        }
    }, [selectedTask]);

    // const quillRef = useRef(null);
    // const isInitializing = useRef(false);
    // useEffect(() => {
    //     let quillInstance;

    //     const editorElement = document.querySelector("#editor");

    //     if (!document.querySelector(".ql-toolbar") && editorElement) {
    //         quillInstance = new Quill(editorElement, {
    //             theme: "snow",
    //             modules: {
    //                 toolbar: [
    //                     [{ 'header': [1, 2, false] }],
    //                     ['bold', 'italic', 'underline'],
    //                     [{ 'color': [] }, { 'background': [] }],
    //                     [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    //                     ['clean']
    //                 ]
    //             }
    //         });

    //         isInitializing.current = true;

    //         quillInstance.on("text-change", () => {
    //             if (!isInitializing.current) {
    //                 handleDescriptionChange(quillInstance.root.innerHTML);
    //             }
    //         });

    //         setTimeout(() => (isInitializing.current = false), 500);

    //         const toolbar = document.querySelector(".ql-toolbar");

    //         if (toolbar) toolbar.style.opacity = "0";

    //         const editor = document.querySelector(".ql-editor");
    //         editor.addEventListener("focus", () => {
    //             if (toolbar) toolbar.style.opacity = "1";
    //         });

    //         editor.addEventListener("blur", () => {
    //             setTimeout(() => {
    //                 if (toolbar) toolbar.style.opacity = "0";
    //             }, 200);
    //         });
    //     }

    //     // Ensure Quill editor updates with the latest description
    //     if (editorElement && task.description && isInitializing) {
    //         setTimeout(() => {
    //             document.querySelector(".ql-editor").innerHTML = task.description;
    //         }, 100); // Small delay ensures Quill is ready
    //     }
    // }, [task.description]);




    const handleCopy = () => {
        if (!task?.unique_id) return;



        const taskLink = `http://localhost:3000/tasks/${task.unique_id}`; // Generate link

        navigator.clipboard.writeText(taskLink)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 sec
            })
            .catch(err => console.error("Failed to copy:", err));
    };

    const handleChange = (e) => {
        setTask({ ...task, [e.target.name]: e.target.value });
        if (e.target.name == "title") {
            debouncedEditTaskTitle(e.target.value);
        }
        if (e.target.name == "due_date") {
            debouncedUpdateTaskDueDate(e.target.value);
        }
    };

    const debouncedUpdateTaskDueDate = debounce((dueDate) => {
        socket.emit("update_task_duedate", { taskId: task.id, dueDate: dueDate, user_id: user.user.id });
    }, 500);

    const debouncedUpdateTaskTitle = debounce((updatedTitle) => {
        socket.emit("update_task_title", { taskId: task.id, title: updatedTitle, user_id: user.user.id });
    }, 500);

    const debouncedEditTaskTitle = debounce((updatedTitle) => {
        socket.emit("edit_task_title", { taskId: task.id, title: updatedTitle });
    }, 100);

    const handleDescriptionChange = (value) => {
        setTask(prev => ({ ...prev, description: value }));
        if (value != task.description) {
            // debouncedEditTaskDescription(value)
        }
    };


    const debouncedUpdateTaskDescription = debounce((updatedDescription) => {
        socket.emit("update_task_description", { taskId: task.id, description: updatedDescription, user_id: user.user.id });
    }, 500);
    const debouncedEditTaskDescription = debounce((updatedDescription) => {
        socket.emit("edit_task_description", { taskId: task.id, description: updatedDescription });
    }, 100);

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
    const [copied, setCopied] = useState(false);



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



    const dateRef = useRef(null);
    const timeRef = useRef(null);


    useEffect(() => {
        if (!task || Object.keys(task).length == 0) return; // Ensure task is defined and not empty

        if (dateRef.current) {
            flatpickr(dateRef.current, {
                dateFormat: "Y-m-d",
                defaultDate: task.due_date ? new Date(task.due_date) : null, // Convert valid date string to Date object
                onChange: ([date]) => {
                    if (date) {
                        handleChange({
                            target: {
                                name: "due_date",
                                value: date.toISOString().split("T")[0]
                            }
                        });
                    }
                }
            });
        }

        if (timeRef.current) {
            flatpickr(timeRef.current, {
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                time_24hr: true,
                defaultDate: task.due_time && task.due_time !== "00:00:00" ? task.due_time : null, // Ensure valid time
                onChange: ([time]) => {
                    if (time) {
                        const formattedTime = time instanceof Date
                            ? time.toTimeString().split(" ")[0].slice(0, 5)
                            : time; // Handle potential edge cases

                        handleChange({
                            target: {
                                name: "due_time",
                                value: formattedTime
                            }
                        });
                    }
                }
            });
        }
    }, [task]);







    const updateTaskTitleState = useCallback(
        debounce((data) => {
            if (data.taskId === task.id) {
                setTask((prev) => ({ ...prev, title: data.title }));
            }
        }, 1000),
        [task.id]
    );

    const updateTaskDueDateState = useCallback(
        debounce((data) => {
            if (data.taskId === task.id) {
                setTask((prev) => ({ ...prev, due_date: data.due_date }));
            }
        }, 1000),
        [task.id]
    );

    // Debounced state updater for description
    const updateTaskDescriptionState = useCallback(
        debounce((data) => {
            if (data.taskId === task.id) {
                setTask((prev) => ({ ...prev, description: data.description }));
            }
        }, 3000),
        [task.id]
    );

    useEffect(() => {
        socket.on("task_updated", updateTaskTitleState);
        socket.on("task_description_updated", updateTaskDescriptionState);
        socket.on("task_tags_updated", ({ taskId, tags }) => {
            setTask(prev => ({
                ...prev,
                tags
            }));
        });
        socket.on("task_duedate_updated", updateTaskDueDateState);

        return () => {
            socket.off("task_updated", updateTaskTitleState);
            socket.off("task_description_updated", updateTaskDescriptionState);
            socket.off("task_tags_updated");
            socket.off("task_duedate_updated");
        };
    }, [updateTaskTitleState, updateTaskDescriptionState]);




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
            className=" bg-gray-50 shadow-md  ml-1 border-l-1 w-5xl scrollbar-none"
        >

            <div className="sticky top-0 bg-white border-b w-full h-12 flex justify-between px-3 items-center z-50">
                {showTitle && <h2 className="pl-2 text-gray-700">{task.title}</h2>}
                {!showTitle && <button className="px-3 py-1 text-sm border text-gray-400 rounded-md flex items-center hover:bg-green-200 hover:text-green-700"

                >
                    <CircleCheck size={20} className="mr-2" />
                    Mark as complete
                </button>}
                <div className="flex items-center space-x-3">
                    <button onClick={() => { handleFullScreenClick(task) }}
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="More"
                        data-tooltip-place="top"
                        className="text-gray-400 ">
                        {isFullScreen ? <Minimize2 size={20} className="cursor-pointer " /> : <Maximize2 size={20} className="cursor-pointer " />}

                    </button>
                    <div className="relative inline-block" ref={menuRef}>
                        <button
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content="More"
                            data-tooltip-place="top"
                            onClick={() => setShowMoreOptions((prev) => !prev)}
                            className="text-gray-500 p-2 rounded-full hover:bg-gray-100 transition"
                        >
                            <MoreHorizontal size={24} className="cursor-pointer" />
                        </button>

                        {showMoreOptions && (
                            <div className="absolute right-[-64px] top-full mt-2 w-56 bg-white shadow-lg rounded-lg border border-gray-200">
                                <ul className="text-sm text-gray-700">
                                    <li onClick={() => setShowTagModal(true)} className="flex items-center gap-2 px-3 py-4 hover:bg-gray-100 cursor-pointer transition">
                                        <Tag size={18} className="text-gray-500" />
                                        Add Tags
                                    </li>
                                    <li className="flex items-center gap-2 px-3 py-4 hover:bg-gray-100 cursor-pointer transition">
                                        <Copy size={18} className="text-gray-500" />
                                        Duplicate Task
                                    </li>
                                    <li className="flex items-center gap-2 px-3 py-4 bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer transition">
                                        <Trash2 size={18} className="text-red-600" />
                                        Delete Task
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleCopy}
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={copied ? "Copied!" : "Copy Task Link"}
                        data-tooltip-place="top"
                        className="text-gray-400 ">
                        <Link size={20} className="cursor-pointer " />
                    </button>
                    <ArrowRight size={30} className=" text-gray-400 cursor-pointer border border-transparent hover:border-gray-400 duration-300 rounded-full p-1" onClick={onClose} />


                </div>
            </div>
            {loading ? (<TaskDetailsLoader />) : (<>
                <form className="bg-white space-y-2  px-6 pt-3">
                    <div>
                        <input
                            type="text"
                            name="title"
                            value={task.title}
                            onChange={handleChange}
                            onBlur={() => debouncedUpdateTaskTitle(task.title)}
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
                                    className="ml-3 bg-slate-300 px-1 py-0.5 rounded"> {task.assigned_user_name ?? "No Assignee"}</p>
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

                    {/* <div style={{ display: "flex", flexDirection: "column-reverse" }} className="border rounded-md">
                        <div id="editor" style={{ border: "none", background: "white" }}>

                        </div>
                    </div> */}

                    {task && task.tags && task.tags.length > 0 && !showTagModal && (
                        <div className="bg-gray-100 rounded-md p-2 my-2 flex items-center space-x-2 justify-end">
                            {
                                task.tags.map(tag => (
                                    <div key={tag} className="bg-red-500 text-white text-[11px] px-2 py-0.5 rounded-md flex items-center gap-1">
                                        {tag}
                                        {/* <X size={12} className="cursor-pointer" onClick={() => removeTag(tag)} /> */}
                                    </div>
                                ))
                            }
                        </div>
                    )}

                    {showTagModal && (
                        <div ref={modalRef} className="bg-white rounded-lg p-4 w-full shadow-lg">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-sm font-medium text-gray-700">Select Tags</h2>
                                <X size={20} className="cursor-pointer text-gray-500 hover:text-gray-700" onClick={() => setShowTagModal(false)} />
                            </div>

                            {selectedTags.length > 0 && (
                                <div className="bg-gray-100 rounded-md p-2 my-2 flex items-center space-x-2 justify-end">
                                    {
                                        selectedTags.map(tag => (
                                            <div key={tag} className="bg-red-500 text-white text-[11px] px-2 py-0.5 rounded-md flex items-center gap-1">
                                                {tag}
                                                <X size={12} className="cursor-pointer" onClick={() => removeTag(tag)} />
                                            </div>
                                        ))}
                                </div>
                            )}


                            <div className="mt-3 grid grid-cols-6 gap-2">
                                {tagsList.map(tag => (
                                    <label
                                        key={tag.name}
                                        className={`px-3 py-1 text-gray-700 rounded-md text-[11px] cursor-pointer ${selectedTags.includes(tag.name) ? 'bg-black text-white' : 'border  bg-gray-100 hover:bg-gray-200'}`}
                                        onClick={() => addTag(tag.name)}
                                    >
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={selectedTags.includes(tag.name)}
                                            readOnly
                                        />
                                        {tag.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <ReactQuill
                        value={task.description}
                        onChange={handleDescriptionChange}
                        className="mt-1 border rounded-md"
                        theme="snow"
                        placeholder="Add your comments here"
                        modules={modules}
                        onBlur={() => { debouncedUpdateTaskDescription(task.description) }}
                    />

                </form>
            </>)
            }
            <hr />
            <CommentsandLogs taskId={task.id} />
            <div className="sticky w-full bottom-0 z-50">
                <CommentBox users={users} taskId={task.id} task={task}/>
                <Collaborators taskId={task.id} followerNames={task.follower_names} followers={task.followers} users={users} />
            </div>
            
        </div >
    );
}

export default ViewTask;
