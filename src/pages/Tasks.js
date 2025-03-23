import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Filter, List, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import AddTask from "./task/AddTask";
import ListView from "./task/views/ListView";
import ToggleViewButton from "./task/ToggleViewButton";
import BoardView from "./task/views/BoardView";
import ViewTask from "./task/ViewTask";
import { listenForTaskUpdates, listenForTaskDescriptionUpdates } from "./TaskSocket";
import { useNavigate, useParams } from "react-router-dom";

function Tasks({ users }) {
    const { unique_id, full_screen } = useParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [addTaskOpen, setAddTaskOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const isFullScreen = Boolean(full_screen);
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const cleanupTaskUpdates = listenForTaskUpdates(setTasks);
        const cleanupTaskDescriptionUpdates = listenForTaskDescriptionUpdates(setTasks);

        return () => {
            cleanupTaskUpdates();
            cleanupTaskDescriptionUpdates();
        };
    }, []);

    const [view, setView] = useState(() => {
        return localStorage.getItem("view") || "grid";
    });

    useEffect(() => {
        localStorage.setItem("view", view);
    }, [view]);

    const handleFullScreenClick = () => {
        navigate(isFullScreen ? `/tasks/${unique_id}` : `/tasks/${unique_id}/f`);
    };
    useEffect(() => {
        if (unique_id) {
            setSelectedTask(unique_id);
            setDetailsOpen(true);
        }
    }, [unique_id]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/tasks");
            if (response.data.status) {
                setTasks(response.data.tasks);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    
    
    useEffect(() => {
        fetchTasks();
    }, []);

    const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleViewTask = (task) => {
        navigate(`/tasks/${task.unique_id}`);
        setDetailsOpen(true);
    };


    return (
        <div className="px-3 py-0 bg-white "
            style={{ overflowY: "hidden", height: "100%" }}
        >
            {/* Header and Controls */}
            <div className="flex items-start">
                <div className=" pt-6">


                    <div className="flex justify-start items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
                        <div className="flex items-center justify-between space-x-2 ml-3">
                            <button onClick={() => { setAddTaskOpen(true) }} className="flex items-center text-sm bg-gray-900 text-white px-3 py-1 rounded-lg ">
                                <Plus size={18} /> Add Task
                            </button>
                            <ToggleViewButton view={view} setView={setView} />
                        </div>

                    </div>

                    {/* Search and Filters */}
                    <div className="flex gap-4 mb-4">
                        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full">
                            <Search size={18} className="text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="w-full outline-none px-2"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center gap-2 border px-4 py-2 rounded-lg">
                            <Filter size={18} /> Filter
                        </button>
                        <button className="flex items-center gap-2 border px-4 py-2 rounded-lg">
                            <List size={18} /> Sort
                        </button>
                    </div>

                    {/* Tasks Table */}
                    <div className="overflow-x-auto overflow-y-auto ">
                        <motion.div
                            className="overflow-x-auto"
                            key={view} // Key helps in smooth re-rendering
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            {view === "list" ? (
                                <ListView tasks={filteredTasks} handleViewTask={handleViewTask} detailsOpen={detailsOpen} />
                            ) : (
                                <BoardView tasks={filteredTasks} handleViewTask={handleViewTask} detailsOpen={detailsOpen} />
                            )}
                        </motion.div>


                    </div>
                </div>
                <AnimatePresence>
                    {detailsOpen && (
                        <motion.div
                        initial={isFullScreen ? { opacity: 0, scale: 0.8 } : { opacity: 0, x: 100 }}
                        animate={isFullScreen ? { opacity: 1, scale: 1 } : { opacity: 1, x: 0 }}
                        exit={isFullScreen ? { opacity: 0, scale: 0.8 } : { opacity: 0, x: 100 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className={isFullScreen ? "fixed inset-0 bg-white z-50 flex items-center justify-center" : ""}
                    >
                        <ViewTask isFullScreen={isFullScreen} handleFullScreenClick={handleFullScreenClick} selectedTask={selectedTask} onClose={() => setDetailsOpen(false)} users={users} />
                    </motion.div>
                    )}
                </AnimatePresence>

            </div>

            <AnimatePresence>
                {addTaskOpen && <AddTask onClose={() => { setAddTaskOpen(false) }} onTaskAdded={fetchTasks} users={users} />}

            </AnimatePresence>
        </div>
    );
}


export default Tasks;