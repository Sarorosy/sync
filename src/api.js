import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const fetchMessages = async (sender, receiver) => {
    const response = await axios.get(`${API_URL}/messages`, {
        params: { sender, receiver },
    });
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

export const loginUser = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
};
