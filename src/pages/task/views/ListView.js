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
  if (!isoString) return "";

  const date = new Date(isoString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((date - today) / (1000 * 60 * 60 * 24));

  if (diffDays === -1) return { text: "Yesterday", color: "text-red-600" };
  if (diffDays === 0) return { text: "Today", color: "text-green-700 font-semibold" };
  if (diffDays === 1) return { text: "Tomorrow", color: "text-green-700" };

  if (diffDays > 1 && diffDays <= 6) {
    return { text: date.toLocaleDateString("en-US", { weekday: "long" }), color: "text-green-700" };
  }

  return {
    text: date.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
    color: diffDays < 0 ? "text-red-600" : "text-green-700",
  };
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
              <th className="px-6 py-3">Collaborators</th>
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
                  <td className={`h-10 overflow-y-hidden px-6 py-1 ${formatDate(task.due_date).color}`}
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content={new Date(task.due_date).toLocaleDateString("en-GB")}
                    data-tooltip-place="top"
                  >
                    {formatDate(task.due_date).text} {(task.due_time && task.due_time !="00:00:00") ?? ""}
                  </td>
                  <td className="px-6 py-1 flex items-center">
                    {(task.assigned_to && task.assigned_to != null && task.assigned_to != '') ? (
                      task.assigned_user_profile ? (
                        <img
                          src={"http://localhost:5000" + task.assigned_user_profile}
                          alt={task.assigned_user_name}
                          className="w-7 h-7 rounded-full border border-gray-300"
                        />
                      ) : (
                        <div
                          className={`w-7 h-7 flex items-center justify-center rounded-full ${getRandomColor(
                            task.assigned_user_id
                          )} text-gray-800`}
                        >
                          {task.assigned_user_name.charAt(0).toUpperCase()}
                        </div>
                      )
                    ) : (
                      <div className="flex items-center ">
                        <div
                          className={`w-7 h-7 flex items-center justify-center rounded-full bg-red-300 text-gray-800`}
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

                  <td className="px-6 py-1 text-gray-700">
                    <div className="flex -space-x-2">
                      {task && task.followers.slice(0, 4).map((follower, index) => (
                        follower.profile_pic ? (
                          <img src={"http://localhost:5000" + follower.profile_pic}
                            className="w-8 h-8 rounded-full"
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content={follower.name}
                            data-tooltip-place="top"
                          />
                        ) : (
                          <div
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content={follower.name}
                            data-tooltip-place="top"
                            key={index}
                            className="w-8 h-8 bg-[#f1bd6c] rounded-full flex items-center justify-center text-sm font-light border-2 border-white shadow"
                          >
                            {follower.name.charAt(0).toUpperCase()}
                          </div>
                        )

                      ))}
                    </div>
                  </td>
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