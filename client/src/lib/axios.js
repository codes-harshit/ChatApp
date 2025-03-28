import axios from "axios";

export const axiosApi = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});
