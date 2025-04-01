import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosApi } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,

  // {Optimize this one later}
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosApi.get("/messages/users");
      set({ users: res.data.filteredUsers });
    } catch (error) {
      console.log("Error in fetching the users: ", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (userToChatId) => {
    set({ isMessageLoading: true });
    // console.log("Is messageLoading: ", get().isMessageLoading);
    try {
      const res = await axiosApi.get(`/messages/${userToChatId}`);
      set({ messages: res.data.messages });
    } catch (error) {
      console.log("Error in fetching the messages: ", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isMessageLoading: false });
      // console.log("Is messageLoading: ", get().isMessageLoading);
    }
  },

  sendMessage: async (message) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosApi.post(`/messages/send/${selectedUser._id}`, {
        text: message.text,
        image: message.image,
      });
      set({ messages: [...messages, res.data.newMessage] });
    } catch (error) {
      console.log("Error in sending message", error);
      toast.error("Unable to send message!");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;
      set({ messages: [...get().messages, newMessage] });
    });
  },

  unSubscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));
