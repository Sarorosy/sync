import { io } from "socket.io-client";
const socket = io("http://localhost:5000");

// Listen for task updates and call the provided callback function
export const listenForTaskUpdates = (setTasks) => {
    socket.on("task_updated", (data) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === data.taskId ? { ...task, title: data.title } : task
            )
        );
    });

    return () => socket.off("task_updated");
};

// Listen for task description updates
export const listenForTaskDescriptionUpdates = (setTasks) => {
    socket.on("task_description_updated", (data) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === data.taskId ? { ...task, description: data.description } : task
            )
        );
    });

    return () => socket.off("task_description_updated");
};

// Emit task description update
export const updateTaskDescription = (taskId, description) => {
    socket.emit("update_task_description", { taskId, description });
};

export default socket;
