import React, { useState, useEffect } from "react";
import axios from "axios";

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });

    useEffect(() => {
        // Fetch users from the API
        axios.get("http://localhost:5000/api/users")
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleAddUser = () => {
        axios.post("http://localhost:5000/api/users", newUser)
            .then((response) => {
                setUsers([...users, response.data]); // Add the new user to the list
                setNewUser({ name: "", email: "", password: "" }); // Reset form
            })
            .catch((error) => {
                console.error("Error adding user:", error);
            });
    };

    const handleDeleteUser = (userId) => {
        axios.delete(`http://localhost:5000/api/users/${userId}`)
            .then(() => {
                // Remove the deleted user from the list
                setUsers(users.filter((user) => user.id !== userId));
            })
            .catch((error) => {
                console.error("Error deleting user:", error);
            });
    };

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4 text-center">
                <h1 className="text-3xl font-bold">Users List</h1>
                <button
                    onClick={() => handleAddUser()}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                    Add User
                </button>
            </div>
            <table className="min-w-full table-auto bg-white border border-gray-300 rounded-lg shadow-md">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="px-4 py-2">{user.name}</td>
                            <td className="px-4 py-2">{user.email}</td>
                            <td className="px-4 py-2">
                                <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => handleDeleteUser(user.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add User Form */}
            <div className="mt-6">
                <h2 className="text-2xl mb-4">Add New User</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={newUser.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleAddUser}
                        className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                    >
                        Add User
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UsersPage;
