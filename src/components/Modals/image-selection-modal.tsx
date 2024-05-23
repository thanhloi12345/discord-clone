import { View, Text, Pressable } from "react-native";
import React, { forwardRef, useCallback, useMemo } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { colors } from "../../libs/color";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
const ImageSelectionModal = forwardRef<BottomSheetModal>((props, ref) => {
  const snapPoints = useMemo(() => ["45%", "60%", "80%"], []);
  const { dismissAll } = useBottomSheetModal();
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
    <View
      style={{
        zIndex: 150,
      }}
    >
      <BottomSheetModal
        name="bottomSheetModal"
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        handleIndicatorStyle={{
          backgroundColor: "white",
        }}
        backgroundStyle={{
          backgroundColor: colors.primaryColor,
        }}
        backdropComponent={renderBackDrop}
      >
        <View className="flex-1 mx-5 gap-4">
          <Pressable className="flex-row items-center rounded-2xl gap-4 bg-[#27272f] py-6 px-3">
            <MaterialCommunityIcons
              name="shield-account"
              size={24}
              color="white"
            />
            <Text className="text-lg flex-1 text-white font-bold">
              Quyền Của Kênh
            </Text>
            <AntDesign name="right" size={15} color={"white"} />
          </Pressable>
          <View className="rounded-2xl overflow-hidden">
            <Pressable className="flex-row items-center gap-4 bg-[#27272f] py-6 px-3">
              <MaterialIcons name="notifications" size={24} color="white" />
              <Text className="text-lg flex-1 text-white font-bold">
                Cài Đặt Thông Báo
              </Text>
              <AntDesign name="right" size={15} color={"white"} />
            </Pressable>
            <Pressable className="flex-row items-center gap-4 bg-[#27272f] py-6 px-3">
              <MaterialIcons name="push-pin" size={24} color="white" />
              <Text className="text-lg flex-1 text-white font-bold">
                Tin Nhắn Đã Được Ghim
              </Text>
              <AntDesign name="right" size={15} color={"white"} />
            </Pressable>
            <Pressable className="flex-row  items-center gap-4 bg-[#27272f] py-6 px-3">
              <Feather name="paperclip" size={24} color="white" />
              <Text className="text-lg flex-1 text-white font-bold">
                Lời Mời
              </Text>
              <AntDesign name="right" size={15} color={"white"} />
            </Pressable>
          </View>
          <Pressable className="flex-row group active:bg-[#1c1d22] rounded-2xl items-center gap-4 bg-[#27272f] py-6 px-3">
            <Text className="text-lg group-active:text-red-200 flex-1 text-red-400 font-bold">
              Xóa Kênh
            </Text>
          </Pressable>
        </View>
      </BottomSheetModal>
    </View>
  );
});

export default ImageSelectionModal;
