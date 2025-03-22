import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
            <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
            <Link to="/chat">Chat</Link>
            <Link to="/users">Users</Link>
        </nav>
    );
}

export default Navbar;
