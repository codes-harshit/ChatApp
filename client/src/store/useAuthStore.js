import { create } from "zustand";
import { axiosApi } from "../lib/axios";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

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

  signup: async ({ fullName, email, password }) => {
    try {
      set({ isSigningUp: true });
    } catch (error) {}
  },
}));
