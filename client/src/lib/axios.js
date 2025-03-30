import axios from "axios";

export const axiosApi = axios.create({
  baseURL: "https://chatapp-server-r6x4.onrender.com/api",
  withCredentials: true,
});
