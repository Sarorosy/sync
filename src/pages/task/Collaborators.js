import { UserPlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import Select from "react-select";

const Collaborators = ({ taskId, followers, followerNames, users, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFollowers, setSelectedFollowers] = useState([]);
    const [displayNames, setDisplayNames] = useState(followerNames ?? "");

    useEffect(() => {
        setDisplayNames(followerNames ?? ""); // Update displayNames when followerNames changes
    }, [followerNames]);

    const fetchTask = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/tasks/tasks/${taskId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            if (data.status) {
                const followerIds = data.task.followers.split(",");
                const mappedFollowers = followerIds
                    .map((id) => {
                        const user = users.find((u) => u.value == id); // Find matching user
                        return user ? { value: user.value, label: user.label } : null;
                    })
                    .filter(Boolean); // Remove any null values

                setSelectedFollowers(mappedFollowers);
            } else {
                console.error("Failed to fetch task");
            }
        } catch (error) {
            console.error("Error fetching task:", error);
        }
    };
    useEffect(() => {

        if (taskId) {
            fetchTask();
        }
    }, [taskId]);

    const toggleEdit = () => setIsEditing(!isEditing);
    const handleChange = (selectedOptions) => {
        setSelectedFollowers(selectedOptions);
    };

    const handleSave = async () => {
        const updatedFollowerIds = selectedFollowers.map((f) => f.value).join(",");
    
        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/followers`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ followers: updatedFollowerIds }),
            });
    
            const data = await response.json();
            if (data.status) {
                console.log("Followers updated successfully");
                setIsEditing(false);
                setDisplayNames(data.follower_names ?? "")
            } else {
                console.error("Failed to update followers");
            }
        } catch (error) {
            console.error("Error updating followers:", error);
        }
    };
    

    console.log("selected values" + selectedFollowers)
    return (
        <div className={`flex items-center gap-2 bg-white ${isEditing ? 'h-48' : 'h-12'}`}>
            <span className="text-sm mr-2 text-gray-400">Collaborators</span>
            <div className="flex -space-x-2">
                {displayNames.split(",").filter(Boolean).map((follower, index) => (
                    <div
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={follower}
                        data-tooltip-place="top"
                        key={index}
                        className="w-8 h-8 bg-[#f1bd6c] rounded-full flex items-center justify-center text-sm font-light border-2 border-white shadow"
                    >
                        {follower.charAt(0).toUpperCase()}
                    </div>
                ))}
            </div>
                
            {/* Edit button */}
            <UserPlus
                className="cursor-pointer text-gray-500 border border-gray-800 border-dashed rounded-full p-1"
                onClick={toggleEdit}
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Update collaborators"
                data-tooltip-place="right"
            />

            {/* React Select for Editing */}
            {isEditing && (
                <div className="flex items-center gap-2">
                    <Select
                        isMulti
                        options={users}
                        value={selectedFollowers}
                        onChange={handleChange}
                        className="w-64"
                    />
                    <button onClick={handleSave} className="bg-blue-500 text-white px-3 py-1 rounded">Save</button>
                </div>
            )}
        </div>
    );
};

export default Collaborators;
