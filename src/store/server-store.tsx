import { Server } from "../types/type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ServerStore {
  selectedServer: string | null;
  selectServer: (server: string | null) => void;
}
const useServerStore = create<ServerStore>(
  // @ts-ignore
  persist(
    (set) => ({
      selectedServer: null,
      selectServer: (server: string | null) => set({ selectedServer: server }),
    }),
    {
      name: "server",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useServerStore;
