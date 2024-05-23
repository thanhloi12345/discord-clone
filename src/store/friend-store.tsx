import { Friends, Profile } from "../types/type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExtendedProfile } from "../api/friends";

type FriendStoreType = {
  friends: (ExtendedProfile | undefined)[];
  setFriends: (friends: (ExtendedProfile | undefined)[]) => void;
};
const useFriendStore = create<FriendStoreType>(
  // @ts-ignore
  persist(
    (set) => ({
      friends: [],
      setFriends: (friends: (ExtendedProfile | undefined)[]) =>
        set({ friends }),
    }),
    {
      name: "friends",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useFriendStore;
