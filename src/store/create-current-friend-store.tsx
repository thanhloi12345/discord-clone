import { Profile } from "../types/type";
import { create } from "zustand";

type CurrentFriendStoreType = {
  currentFriend: Profile | null;
  setCurrentFriend: (currentFriend: Profile | null) => void;
};
const useCurrentFriendStore = create<CurrentFriendStoreType>((set) => ({
  currentFriend: null,
  setCurrentFriend: (currentFriend: Profile | null) => set({ currentFriend }),
}));

export default useCurrentFriendStore;
