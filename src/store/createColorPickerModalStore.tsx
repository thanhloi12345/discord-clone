import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useRef } from "react";
import { create } from "zustand";

type modalStore = {
  isOpen: boolean;
  hexColor: string;
  reference: React.RefObject<BottomSheetModalMethods> | undefined;
  toggleModal: () => void;
  setHexColor: (hex: string) => void;
};

export const useColorPickerModalStore = create<modalStore>((set, get) => ({
  isOpen: false,
  reference: undefined,
  hexColor: "#000000",
  toggleModal: () => {
    set((state: { isOpen: any }) => ({ isOpen: !state.isOpen }));
    if (!get().isOpen) {
      get().reference?.current?.close();
    } else {
      get().reference?.current?.present();
    }
  },
  setHexColor: (hex: string) => {
    set({ hexColor: hex });
  },
}));
