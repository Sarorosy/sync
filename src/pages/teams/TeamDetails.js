import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TeamLoader from "./TeamLoader";

const TeamDetails = () => {
    const { unique_id } = useParams();
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true);
        axios
            .get(`http://localhost:5000/api/teams/unique/${unique_id}`)
            .then((res) => setTeam(res.data.team))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false)); // Corrected syntax
    }, [unique_id]);


    if (!team) return <TeamLoader />;
    if (loading) return <TeamLoader />;

    // Parse members and member names
    const memberNames = JSON.parse(team.member_names || "[]");
    const members = JSON.parse(team.members || "[]");

    return (
        <div className="max-w-5xl mx-auto p-6 scrollbar-none">
            <div className="">
                <div className="h-32 bg-[#e8e5e4] rounded-lg"></div>
                <div style={{ marginTop: "-52px", width: "50%", marginLeft: "26px" }} className="bg-gray-100 rounded-lg p-4 mb-6 flex items-center border">
                    <div className="w-16 h-16 bg-[#e8e5e4] flex items-center justify-center text-2xl font-bold rounded-full">
                        {team.team_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                        <h1 className="text-2xl font-bold">{team.team_name}</h1>
                        <p className="text-gray-600">{team.team_description}</p>
                    </div>
                </div>
            </div>

            <div className=" flex w-full items-start justify-between space-x-2">
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6 w-2/3 border">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Curated Work</h2>
                        <button className="text-gray-500 hover:bg-gray-100 rounded px-1 py-0.5">View all work</button>
                    </div>
                    <div className="bg-white rounded-md p-3 mt-3 shadow">
                        <p className="text-gray-500">No work added yet.</p>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg shadow-sm border p-2 rounded w-1/3">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Members</h2>
                        <button className="text-gray-500 hover:bg-gray-100 rounded px-1 py-0.5">View all {members.length}</button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {members.map((member, index) => (
                            member.profile_pic ? (
                                <img src={"http://localhost:5000" + member.profile_pic} className="rounded-full w-10 h-10 border"
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content={member.name ?? ''}
                                data-tooltip-place="top"
                                />
                            ) : (<div
                                key={index}
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content={member.name ?? ''}
                                data-tooltip-place="top"
                                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold
                                    ${index % 2 === 0 ? "bg-yellow-300 text-gray-800" : "bg-purple-300 text-white"}`}
                            >
                                {member.name.slice(0, 2).toUpperCase()}
                            </div>)
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TeamDetails;
