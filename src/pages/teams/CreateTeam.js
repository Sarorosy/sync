import { useState } from "react";
import Select from "react-select";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function CreateTeam({ users }) {
    const [teamName, setTeamName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const {user} = useAuth();

    const handleMemberSelect = (id) => {
        setSelectedMembers((prev) =>
            prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
        );
    };

    const handleCreateTeam = async () => {
        if (!teamName || !description || !selectedMembers.length) {
            toast.error("Please provide all required fields.");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:5000/api/teams/create/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`, // Assuming token is stored in user context
                },
                body: JSON.stringify({
                    team_name: teamName,
                    description,
                    members: selectedMembers.map((member) => member.value),
                    createdBy: user.id, // Sending logged-in user ID
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                toast.success("Team created successfully!");
                setTeamName("");
                setDescription("");
                setSelectedMembers([]);
            } else {
                toast.error(data.message || "Failed to create team.");
            }
        } catch (error) {
            console.error("Error creating team:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };
    
    


    const userOptions = users.map((user) => ({
        value: user.id,
        label: (
            <div className="flex items-center space-x-2">
                {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                ) : (
                    <div className="w-6 h-6 flex items-center justify-center bg-gray-400 text-white rounded-full text-sm">
                        {user.name.charAt(0)}
                    </div>
                )}
                <span>{user.name}</span>
            </div>
        ),
    }));

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-4">
            {/* Banner */}
            <div className="h-32 bg-[#e8e5e4] rounded-lg"></div>

            {/* Team Info */}
            <div className="flex items-center space-x-4 mt-4">
                <div className="w-16 h-16 bg-[#c7c4c4] text-white flex items-center justify-center text-3xl font-bold rounded-full aspect-square">
                    {teamName.charAt(0).toUpperCase() || "T"}
                </div>

                <div>
                    <input
                        type="text"
                        placeholder="Team Name"
                        className="text-2xl font-semibold w-full outline-none"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Team Description"
                        className="text-gray-500 w-full outline-none mt-1"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
            </div>

            <div className="mb-4 mt-4">
                <Select
                    options={userOptions}
                    isMulti
                    className="mt-1 "
                    placeholder="Select Members"
                    onChange={setSelectedMembers}
                    value={selectedMembers}
                />
            </div>

            {/* Create Button */}
            <div className="mt-6">
                <button
                    onClick={handleCreateTeam}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
                >
                    Create Team
                </button>
            </div>
        </div>
    );
}