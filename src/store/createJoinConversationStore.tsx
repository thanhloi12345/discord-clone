import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { create } from "zustand";

type modalStore = {
  isOpen: boolean;
  reference: React.RefObject<BottomSheetModalMethods> | undefined;
  toggleModal: () => void;
};

export const useJoinConversaton = create<modalStore>((set, get) => ({
  isOpen: false,
  reference: undefined,

  toggleModal: () => {
    set((state: { isOpen: any }) => ({ isOpen: !state.isOpen }));
    if (!get().isOpen) {
      get().reference?.current?.close();
    } else {
      get().reference?.current?.present();
    }
  },
}));
