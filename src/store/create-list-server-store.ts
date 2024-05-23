import { Server } from "../types/type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ListServersStore {
  servers: Server[] | [];
  selectedServer: Server | null;
  setSelectedServer: (server: Server | null) => void;
  setServers: (servers: Server[]) => void;
}
const useListServersStore = create<ListServersStore>(
  // @ts-ignore
  persist(
    (set) => ({
      servers: [],
      selectedServer: null,
      setServers: (servers: Server[]) => set({ servers }),
      setSelectedServer: (server: Server | null) =>
        set({ selectedServer: server }),
    }),
    {
      name: "list-servers",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useListServersStore;
