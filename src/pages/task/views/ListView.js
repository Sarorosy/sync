import React, { useEffect, useState } from "react";

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border border-yellow-300";
    case "completed":
      return "bg-green-100 text-green-800 border border-green-300";
    case "in-progress":
      return "bg-blue-100 text-blue-800 border border-blue-300";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-300";
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 border border-red-300";
    case "medium":
      return "bg-orange-100 text-orange-800 border border-orange-300";
    case "low":
      return "bg-green-100 text-green-800 border border-green-300";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-300";
  }
};
const getRandomColor = (id) => {
  const colors = [
    "bg-red-300", "bg-blue-300", "bg-green-300",
    "bg-yellow-300", "bg-purple-300", "bg-pink-300",
    "bg-indigo-300", "bg-teal-300", "bg-orange-300"
  ];
  return colors[id % colors.length]; // Assigns a color based on user ID
};

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ListView = ({ tasks, handleViewTask, detailsOpen }) => {

  const [showDetails, setShowDetails] = useState(!detailsOpen);

  useEffect(() => {
    if (!detailsOpen) {
      const timer = setTimeout(() => setShowDetails(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowDetails(false);
    }
  }, [detailsOpen]);

  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-2xl px-3 py-1 border border-gray-200 text-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-700 text-sm font-semibold border-b border-gray-300">
            <th className="px-6 py-3">Title</th>
            {showDetails && (<>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Priority</th>
              <th className="px-6 py-3">Due Date</th>
              <th className="px-6 py-3">Assigned User</th>
              <th className="px-6 py-3">Followers</th>
            </>)}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <>
              {index !== 0 && <tr><td colSpan="6" className="py-2"><hr className="border-gray-300" /></td></tr>}
              <tr
                key={task.id}
                style={{ height: "20px", overflowY: "hidden" }}
                className="cursor-pointer hover:bg-gray-100 transition-all duration-300 "
                onClick={() => handleViewTask(task)}
              >
                <td className="px-6 py-1 text-gray-900 font-medium">{task.title}</td>
                {showDetails && (<>
                  <td className="px-6 py-1">
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-1">
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="h-10 overflow-y-hidden px-6 py-1 text-gray-600">{formatDate(task.due_date)} {task.due_time}</td>
                  <td className="px-6 py-1 flex items-center">
                    {(task.assigned_to && task.assigned_to != null && task.assigned_to != '')? (
                      task.assigned_user_profile ? (
                        <img
                          src={"http://localhost:5000" + task.assigned_user_profile}
                          alt={task.assigned_user_name}
                          className="w-8 h-8 rounded-full border border-gray-300"
                        />
                      ) : (
                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded-full ${getRandomColor(
                            task.assigned_user_id
                          )} text-gray-800`}
                        >
                          {task.assigned_user_name.charAt(0).toUpperCase()}
                        </div>
                      )
                    ) : (
                      <div className="flex items-center ">
                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded-full bg-red-300 text-gray-800`}
                        >
                          N
                        </div>
                       <span className="ml-2 text-gray-700">No Assignee</span>
                      </div>
                    )}
                    {task.assigned_to && (
                      <span className="ml-2 text-gray-700">{task.assigned_user_name}</span>
                    )}
                  </td>

                  <td className="px-6 py-1 text-gray-700">{task.followers.length}</td>
                </>)}
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListView;