import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function Chat({ sender, receiver }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    // Fetch chat history when the component mounts
    useEffect(() => {
        // Fetch previous messages
        const fetchMessages = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/messages?sender=${sender}&receiver=${receiver}`);
                const data = await response.json();
                setMessages(data); // Set the previous messages in state
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();

        // Listen for incoming messages
        socket.on("receive_message", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            socket.off("receive_message");
        };
    }, [sender, receiver]);

    const sendMessage = () => {
        if (message.trim()) {
            const data = { sender, receiver, message };
            socket.emit("send_message", data); // Send the message to the server

            // Optionally add the message to the state immediately
            // But make sure it isn't added twice, so only wait for confirmation
            setMessage(""); // Clear input field
        }
    };

    return (
        <div className="flex flex-col h-full w-full max-w-xl mx-auto p-4 border border-gray-300 rounded-lg shadow-lg">
            <div className="flex-1 overflow-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.sender === sender ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-xs p-3 rounded-lg text-white ${msg.sender === sender ? "bg-blue-500" : "bg-gray-500"}`}
                        >
                            <p>{msg.message}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={sendMessage}
                    className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default Chat;
