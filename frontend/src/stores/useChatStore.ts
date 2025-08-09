import { axiosInstance } from "@/lib/axios";
import type { Message, User } from "@/types";
import { create } from "zustand";
import { io } from "socket.io-client";
import { useAuth } from "@clerk/clerk-react";

interface ChatStore {
  socket: any;
  users: User[];
  isLoading: boolean;
  messages: Message[];
  isConnected: boolean;
  error: string | null;
  onlineUsers: Set<string>;
  selectedUser: User | null;
  disconnectSocket: () => void;
  fetchUsers: () => Promise<void>;
  userActivities: Map<string, string>;
  initSocket: (userId: string) => void;
  fetchMessages: (userId: string) => void;
  deleteMessage: (messageId: string) => void;
  setSelectedUser: (user: User | null) => void;
  sendMessage: (receiverId: string, senderId: string, content: string) => void;
}

const baseURL = "http://localhost:5000";

const socket = io(baseURL, {
  autoConnect: false, // Disable auto-connect
  withCredentials: true,
});

export const useChatStore = create<ChatStore>((set, get) => ({
  users: [],
  error: null,
  socket: socket,
  messages: [],
  isLoading: false,
  selectedUser: null,
  isConnected: false,
  onlineUsers: new Set(),
  userActivities: new Map(),

  setSelectedUser: (user) => set({ selectedUser: user }),

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance("/users");
      set({ users: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  initSocket: (userId) => {
    if (!get().isConnected) {
      socket.auth = { userId };
      socket.connect();
      socket.emit("user_connected", userId);
      socket.on("users_online", (users: string[]) => {
        set({ onlineUsers: new Set(users) });
      });

      socket.on("activities", (activities: [string, string][]) => {
        set({ userActivities: new Map(activities) });
      });

      socket.on("user_connected", (userId: string) => {
        set((state) => ({
          onlineUsers: new Set([...state.onlineUsers, userId]),
        }));
      });

      socket.on("user_disconnected", (userId: string) => {
        set((state) => {
          const newOnlineUsers = new Set(state.onlineUsers);
          newOnlineUsers.delete(userId);
          return { onlineUsers: newOnlineUsers };
        });
      });

      socket.on("receive_message", (message: Message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      });

      socket.on("message_sent", (message: Message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      });

      socket.on("activity_updated", ({ userId, activity }) => {
        set((state) => {
          const newActivities = new Map(state.userActivities);
          newActivities.set(userId, activity);
          return { userActivities: newActivities };
        });
      });

      socket.on("message_deleted", ({ messageId }) => {
        set((state) => ({
          messages: state.messages.filter((msg) => msg._id !== messageId),
        }));
      });

      set({ isConnected: true });
    }
  },
  disconnectSocket: () => {
    if (get().isConnected) {
      socket.disconnect();
      set({ isConnected: false });
    }
  },
  sendMessage: (receiverId, senderId, content) => {
    const socket = get().socket;
    if (!socket) {
      return;
    }
    socket.emit("send_message", { receiverId, senderId, content });
  },

  fetchMessages: async (userId) => {
    debugger;
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/users/messages/${userId}`);
      set({ messages: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteMessage: (messageId) => {
    const { socket, selectedUser, messages } = get();
  
    if (!socket || !selectedUser) return;

    // Find the message to get sender and receiver info
    const messageToDelete = messages.find((msg) => msg._id === messageId);
    console.log("Message deleted", messageToDelete);
    if (!messageToDelete) return;

    // Emit delete event to server
    socket.emit("delete_message", {
      messageId,
      senderId: messageToDelete.senderId,
      receiverId: messageToDelete.receiverId,
    });
  },
}));
