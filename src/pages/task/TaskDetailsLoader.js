import React from "react";

const TaskDetailsLoader = () => {
    return (
        <div className="p-4 bg-white shadow-md rounded-lg w-5xl w-full animate-pulse">
            {/* Title */}
            <div className="h-6 bg-gray-300 rounded w-1/3 mb-3"></div>

            {/* Meta Info */}
            <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                    <div className="h-5 bg-gray-300 rounded w-20"></div>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                    <div className="h-5 bg-gray-300 rounded w-16"></div>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 bg-gray-300 rounded"></div>
                    <div className="h-5 bg-gray-300 rounded w-24"></div>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 bg-gray-300 rounded"></div>
                    <div className="h-5 bg-gray-300 rounded w-14"></div>
                </div>
            </div>

            {/* Description */}
            <div className="h-16 bg-gray-300 rounded w-full"></div>
        </div>
    );
};

export default TaskDetailsLoader;
