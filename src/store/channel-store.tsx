import { Channel } from "../types/type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ChannelStore {
  selectedChannel: Channel | null;
  setChannel: (server: Channel | null) => void;
}
const useChannelStore = create<ChannelStore>((set) => ({
  selectedChannel: null,
  setChannel: (channel: Channel | null) => set({ selectedChannel: channel }),
}));

export default useChannelStore;
