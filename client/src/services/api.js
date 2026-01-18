import axios from "axios";

const api = axios.create({
  baseURL: "https://e-commerce-1-d8jn.onrender.com"  // ✅ This is your backend
});

export default api;
