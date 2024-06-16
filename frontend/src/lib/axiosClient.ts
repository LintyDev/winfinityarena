import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333',
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export default axiosClient;