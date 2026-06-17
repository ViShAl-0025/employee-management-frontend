import axios from "axios";

const api = axios.create({
  baseURL: "https://employee-management-backend-fg8j.onrender.com/api",
});

export default api;