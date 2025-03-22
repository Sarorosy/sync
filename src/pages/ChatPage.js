import React from "react";
import Chat from "../components/Chat";

function ChatPage() {
    const sender = "user1"; // Replace with dynamic user data
    const receiver = "user2"; // Replace with dynamic user data

    return (
        <div>
            <h2 style={{ textAlign: "center" }}>Chat Room</h2>
            <Chat sender={sender} receiver={receiver} />
        </div>
    );
}

export default ChatPage;
