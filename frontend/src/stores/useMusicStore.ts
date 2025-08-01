import { axiosInstance } from "@/lib/axios";
import type { Album, Song, Stats } from "@/types";
import toast from "react-hot-toast";

import { create } from "zustand";

interface MusicStore {
  stats: Stats;
  albums: Album[];
  songs: Song[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Album | null;
  madeForYouSongs: Song[];
  trendingSongs: Song[];
  featuredSongs: Song[];
  fetchStats: () => Promise<void>;
  fetchSongs: () => Promise<void>;
  fetchAlbums: () => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  deleteAlbum: (id: string) => Promise<void>;
  fetchAlbumById: (albumId: string) => Promise<void>;
  refreshStatsAfterDelete: () => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
  albums: [],
  songs: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  madeForYouSongs: [],
  trendingSongs: [],
  featuredSongs: [],
  stats: {
    totalSongs: 0,
    totalAlbums: 0,
    totalUsers: 0,
    totalArtists: 0,
  },

  deleteAlbum: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`admin/albums/${id}`);
      
      // Update local state immediately for fast UI response
      set((state) => {
        const albumToDelete = state.albums.find((album) => album._id === id);
        const updatedAlbums = state.albums.filter((album) => album._id !== id);
        const updatedSongs = state.songs.map((song) => 
          song.albumId === albumToDelete?.title ? {...song, album: null} : song
        );

        return {
          albums: updatedAlbums,
          songs: updatedSongs,
        };
      });

      // Refresh stats from server for accuracy
      const { refreshStatsAfterDelete } = useMusicStore.getState();
      await refreshStatsAfterDelete();
      
      toast.success("Album Deleted Successfully !");
    } catch (error) {
      toast.error("Error in Deleting Album");
    } finally {
      set({ isLoading: false });
    }
  },
  deleteSong: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`admin/songs/${id}`);
      
      // Update local state immediately for fast UI response
      set((state) => ({
        songs: state.songs.filter((song) => song._id !== id),
      }));

      // Refresh stats from server for accuracy  
      const { refreshStatsAfterDelete } = useMusicStore.getState();
      await refreshStatsAfterDelete();
      
      toast.success("Song Deleted Successfully !");
    } catch (error) {
      toast.error("Error In Deleting Song");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs");
      set({ songs: response.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/stats");
      set({ stats: response.data });
    } catch (error: any) {
      console.log("Error In Fetching Stats: ", error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbums: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/albums");
      set({ albums: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbumById: async (albumId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/albums/${albumId}`);
      set({ currentAlbum: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchMadeForYouSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/made-for-you");
      set({ madeForYouSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTrendingSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/trending");
      set({ trendingSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFeaturedSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/featured");
      set({ featuredSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Function to refresh stats after delete operations for accuracy
  refreshStatsAfterDelete: async () => {
    try {
      const response = await axiosInstance.get("/stats");
      set((state) => ({ ...state, stats: response.data }));
    } catch (error: any) {
      console.log("Error refreshing stats: ", error);
    }
  },
}));
