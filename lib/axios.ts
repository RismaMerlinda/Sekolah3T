import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api/v1", // ✅ STOP DI /v1
    withCredentials: true,
});

export default api;
