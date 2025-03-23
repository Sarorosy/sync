import React from "react";

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

const renderEditorJsContent = (description) => {
    try {
      const content = JSON.parse(description);
  
      return content.blocks.map((block) => {
        switch (block.type) {
          case "header":
            return <h2 key={block.id} className="text-xl font-bold">{block.data.text}</h2>;
          case "paragraph":
            return <p key={block.id} className="text-gray-700">{block.data.text}</p>;
          case "list":
            return (
              <ul key={block.id} className="list-disc ml-5">
                {block.data.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            );
          case "image":
            return (
              <img
                key={block.id}
                src={block.data.file.url}
                alt="Task Image"
                className="w-full rounded-lg mt-2"
              />
            );
          default:
            return null;
        }
      });
    } catch (error) {
      return <p className="text-red-500">Invalid description format</p>;
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

const BoardView = ({ tasks , handleViewTask}) => {
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {tasks && tasks.length > 0 && tasks.map((task) => {
        

        return (
          <div
            key={task.id}
            className="text-sm bg-white shadow-md rounded-lg p-5 border-l-4 transition-all duration-300 hover:shadow-lg"
          >
            <h3 className="text-md font-semibold text-gray-800 mb-2">{task.title}</h3>
            
            <div className="flex justify-between items-center">
              <span
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(task.status)}`}
              >
                {task.status}
              </span>
              <span
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${getPriorityColor(task.priority)}`}
              >
                {task.priority}
              </span>
            </div>

            <div className="mt-4 flex items-center">
              {task.assigned_user_profile ? (
                <img
                  src={"http://localhost:5000" +task.assigned_user_profile}
                  alt={task.assigned_user_name}
                  className="w-8 h-8 rounded-full border border-gray-300"
                />
              ) : (
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-gray-800 font-bold">
                  {task.assigned_user_name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="ml-2 text-gray-700">{task.assigned_user_name}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BoardView;
