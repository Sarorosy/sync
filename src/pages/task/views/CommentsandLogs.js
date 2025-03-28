import React, { useEffect, useState } from "react";
import axios from "axios";
import parse from "html-react-parser";
import { io } from "socket.io-client";
import { domToReact } from "html-react-parser";
import { format } from "timeago.js";

const CommentsandLogs = ({ taskId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const socket = io("http://localhost:5000");
    const [activeTab, setActiveTab] = useState("comments");

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/comments/${taskId}`);
                if (response.data.status) {
                    setComments(response.data.comments);
                }
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchComments();


        socket.on("new_comment", (newComment) => {
            if (newComment.task_id === taskId) {
                setComments((prevComments) => [...prevComments, newComment]);
            }
        });

        // Cleanup listener on unmount
        return () => {
            socket.off("new_comment");
        };

    }, [taskId]);

    const getRandomColor = (id) => {
        const colors = [
          "bg-red-300", "bg-blue-300", "bg-green-300",
          "bg-yellow-300", "bg-purple-300", "bg-pink-300",
          "bg-indigo-300", "bg-teal-300", "bg-orange-300"
        ];
        return colors[id % colors.length]; // Assigns a color based on user ID
      };

    if (loading) {
        return <p className="text-center text-gray-500">Loading comments...</p>;
    }
    const customParse = (html) => {
        return parse(html, {
            replace: (domNode) => {
                if (domNode.name === "span" && domNode.attribs?.class === "prosemirror-mention-node") {
                    const mentionName = domNode.attribs["data-mention-name"];
                    const mentionEmail = domNode.attribs["data-mention-email"];

                    if (mentionName) {
                        return (
                            <MentionTooltip mentionName={mentionName} mentionEmail={mentionEmail} />
                        );
                    }
                }
            },
        });
    };

    const MentionTooltip = ({ mentionName, mentionEmail }) => {
        const [showTooltip, setShowTooltip] = useState(false);
    
        return (
            <span
                className="inline-flex items-center text-xs bg-gray-300 font-semibold rounded-md relative cursor-pointer"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <span className="mentionname text-black">{mentionName.charAt(0)}</span>
                <span className="pl-1 mentionemail text-black">{mentionName}</span>
    
                {showTooltip && (
                    <div className="absolute mt-2 w-64 overflow-x-hidden bg-white shadow-md rounded-sm z-10" style={{top:"-85px", left:"0"}}>
                        <div className="flex">
                        {/* Left section (Profile Initial & Role) */}
                        <div className="w-24 bg-[#f1bd6c] flex flex-col items-center justify-center p-4">
                            <div className="text-4xl font-bold text-gray-800">
                                {mentionName.charAt(0)}
                            </div>
                            <span className="text-xs text-gray-700 mt-2"></span>
                        </div>

                        {/* Right section (User Details) */}
                        <div className="flex-1 p-4">
                            <p className="text-sm font-bold text-gray-900">{mentionName}</p>
                            <p className="text-xs text-gray-500">{mentionEmail}</p>

                        </div>
                    </div>
                    </div>
                )}
            </span>
        );
    };

    const logsOnly = comments.filter((comment) => comment.islog === 1);

    return (
        <div className="max-w-3xl my-3 mx-auto bg-[#f9f8f8] shadow-lg rounded-lg p-4">
            {/* Tabs */}
            <div className="flex border-b border-black mb-2">
                <button
                    className={`flex-1 py-1 text-base font-medium ${activeTab === "comments" ? "border-b-2 border-black" : "text-black"}`}
                    onClick={() => setActiveTab("comments")}
                >
                    Comments
                </button>
                <button
                    className={`flex-1 py-1 text-base font-medium ${activeTab === "logs" ? "border-b-2 border-black" : "text-black"}`}
                    onClick={() => setActiveTab("attachments")}
                >
                    Attachments
                </button>
                <button
                    className={`flex-1 py-1 text-base font-medium ${activeTab === "logs" ? "border-b-2 border-black" : "text-black"}`}
                    onClick={() => setActiveTab("logs")}
                >
                    Logs
                </button>
            </div>

            <div>
                {/* Comments Tab (Shows ALL Logs + Comments) */}
                {activeTab === "comments" && (
                    <div className="space-y-3">
                        {comments.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center italic">No comments yet. Be the first to share your thoughts!</p>
                        ) : (
                            comments.map((comment) => {
                                if (comment.islog == 1) {
                                    return (

                                        <div key={comment.id} className="p-3 text-gray-500 bg-gray-50 rounded-lg shadow-sm mx-auto tex-xs">
                                            <strong className="text-gray-800 text-sm">{comment.user_name.charAt(0).toUpperCase() + comment.user_name.slice(1)}</strong>{" "}
                                            <span className="text-gray-600 text-sm">{parse(comment.comment)}</span>{" "}
                                            <span className="text-xs text-gray-400" 
                                            data-tooltip-id="my-tooltip"
                                            data-tooltip-content={new Date(comment.created_at)}
                                            data-tooltip-place="top"
                                            >({format(new Date(comment.created_at))})</span>
                                        </div>
                                    );
                                } else {
                                    const imageMatch = comment.comment.match(/imageplugin-src="([^"]+)"/);
                                    const imageUrl = imageMatch ? imageMatch[1] : null;

                                    return (
                                        <div key={comment.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-md">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <div className={`w-8 h-8 ${getRandomColor(comment.user_id)} rounded-full flex items-center justify-center overflow-hidden`}>
                                                    {comment.profile_pic ? (
                                                        <img src={"http://localhost:5000" +comment.profile_pic} alt={comment.user_name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className={`  font-semibold text-sm`}>{comment.user_name[0]}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <strong className="text-gray-900 text-sm">{comment.user_name}</strong>
                                                    <p className="text-xs text-gray-500"
                                                    data-tooltip-id="my-tooltip"
                                                    data-tooltip-content={new Date(comment.created_at)}
                                                    data-tooltip-place="top"
                                                    >{format(new Date(comment.created_at))}</p>
                                                </div>
                                            </div>

                                            <div className="text-gray-700 text-sm">{customParse(comment.comment)}</div>

                                            {imageUrl && (
                                                <div className="mt-3">
                                                    <img src={imageUrl} alt="Comment Image" className="w-full max-w-xs rounded-lg shadow-md border" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                            })
                        )}
                    </div>
                )}


                {/* Logs Tab (ONLY Logs) */}
                {activeTab === "logs" && (
                    <div>
                        {logsOnly.length === 0 ? (
                            <p className="text-gray-500">No logs available.</p>
                        ) : (
                            logsOnly.map((comment) => (
                                <div key={comment.id} className="p-3 text-gray-500 bg-gray-50 rounded-lg shadow-sm mx-auto text-xs">
                                    <strong className="text-gray-800 ">{comment.user_name.charAt(0).toUpperCase() + comment.user_name.slice(1)}</strong>{" "}
                                    <span className="text-gray-600 ">{parse(comment.comment)}</span>{" "}
                                    <span className="text-xs text-gray-400 "
                                    data-tooltip-id="my-tooltip"
                                    data-tooltip-content={new Date(comment.created_at)}
                                    data-tooltip-place="top"
                                    >({format(new Date(comment.created_at))})</span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentsandLogs;