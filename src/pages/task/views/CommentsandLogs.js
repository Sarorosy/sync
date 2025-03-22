import React, { useEffect, useState } from "react";
import axios from "axios";
import parse from "html-react-parser";
import { io } from "socket.io-client";


const CommentsandLogs = ({ taskId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const socket = io("http://localhost:5000");

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
                setComments((prevComments) => [newComment, ...prevComments]);
            }
        });

        // Cleanup listener on unmount
        return () => {
            socket.off("new_comment");
        };

    }, [taskId]);



    if (loading) {
        return <p className="text-center text-gray-500">Loading comments...</p>;
    }

    return (
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-4">
            {comments.length === 0 ? (
                <p className="text-gray-500">No comments available.</p>
            ) : (
                comments.map((comment) => {
                    // Extract image URL from comment HTML
                    const imageMatch = comment.comment.match(/imageplugin-src="([^"]+)"/);
                    const imageUrl = imageMatch ? imageMatch[1] : null;

                    return (
                        <div key={comment.id} className="mb-4 p-3 bg-gray-100 rounded-lg shadow-sm">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                    {comment.profile_pic ? (
                                        <img src={comment.profile_pic} alt={comment.user_name} className="w-full h-full rounded-full" />
                                    ) : (
                                        <span className="text-gray-700 font-semibold">{comment.user_name[0]}</span>
                                    )}
                                </div>
                                <div>
                                    <strong className="text-gray-800">{comment.user_name}</strong>
                                    <p className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="text-gray-700">{parse(comment.comment)}</div>

                            {imageUrl && (
                                <div className="mt-2">
                                    <img src={imageUrl} alt="Comment Image" className="w-full max-w-xs rounded-lg shadow-md" />
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default CommentsandLogs;