import { Profile } from "../types/type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StreamVideoClient } from "@stream-io/video-react-native-sdk";

type ProfileStoreType = {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
};
const useProfileStore = create<ProfileStoreType>(
  // @ts-ignore
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile: Profile | null) => set({ profile }),
    }),
    {
      name: "profile",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useProfileStore;
