import React from "react";
import { List, Grid } from "lucide-react"; // Using lucide-react icons

const ToggleViewButton = ({ view, setView }) => {
  return (
    <div className="flex bg-white rounded-lg p-1 shadow-md">
      <button
        className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-all ${
          view === "list"
            ? "bg-orange-500 text-white shadow"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        onClick={() => setView("list")}
      >
        <List className="w-5 h-5 mr-2" />
        List
      </button>
      <button
        className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-all ${
          view === "grid"
            ? "bg-orange-500 text-white shadow"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        onClick={() => setView("grid")}
      >
        <Grid className="w-5 h-5 mr-2" />
        Grid
      </button>
    </div>
  );
};

export default ToggleViewButton;
