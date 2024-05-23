import { Server } from "../types/type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

interface TokenStore {
  token: Notifications.ExpoPushToken | null;
  setToken: (token: Notifications.ExpoPushToken | null) => void;
}
const useNotificationTokenStore = create<TokenStore>(
  // @ts-ignore
  persist(
    (set) => ({
      token: null,
      setToken: (token: Notifications.ExpoPushToken | null) =>
        set({ token: token }),
    }),
    {
      name: "token-notification",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useNotificationTokenStore;
