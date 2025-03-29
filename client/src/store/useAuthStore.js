import { create } from "zustand";
import { axiosApi } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosApi.get("/auth/check-auth");
      const user = res.data;
      if (!user) {
        return false;
      }
      set({ authUser: user });
      return true;
    } catch (error) {
      console.log("Error in checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosApi.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Signed Up successfully");
    } catch (error) {
      console.log("Error in Signup", error);
      toast.error(error.response.data.message);
      set({ authUser: null });
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosApi.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged In");
    } catch (error) {
      console.log("Error in Login", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosApi.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged Out!");
    } catch (error) {
      console.log("Error in Logout", error);
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosApi.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile Updated!");
    } catch (error) {
      console.log("Error in Logout", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
