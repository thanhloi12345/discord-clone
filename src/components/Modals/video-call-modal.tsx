import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { CustomCallControls } from "../videoCall/CustomCallControls";
import { CustomCallTopView } from "../videoCall/CallTopView";
import { CustomVideoRenderer } from "../videoCall/CustomVideoRenderer";

const VideoCallModal = forwardRef<BottomSheetModal>((props, ref) => {
  const snapPoints = useMemo(() => ["95%"], []);

  const renderBackDrop = useCallback((props: BottomSheetBackdropProps) => {
    return (
      <BottomSheetBackdrop
        {...props}
        opacity={0.5}
        animatedIndex={{ value: 1 }}
        pressBehavior={"close"}
      />
    );
  }, []);

  return (
    <>
      <BottomSheetModal
        name="bottomSheetModal"
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        handleIndicatorStyle={{
          backgroundColor: "transparent",
          display: "none",
        }}
        backgroundStyle={{
          backgroundColor: "#55388c",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
        backdropComponent={renderBackDrop}
      >
        <View className="items-center flex-1 justify-center">
          <CustomCallTopView />
          <CustomVideoRenderer />
          <CustomCallControls />
        </View>
      </BottomSheetModal>
    </>
  );
});

export default VideoCallModal;
