import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdropProps,
  BottomSheetBackgroundProps,
} from "@gorhom/bottom-sheet";
import {
  ScreenShareToggleButton,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-native-sdk";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { View, Pressable, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolateColor,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { twMerge } from "tailwind-merge";

const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({
  style,
  animatedIndex,
}) => {
  //#region styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    // @ts-ignore
    backgroundColor: interpolateColor(
      animatedIndex.value,
      [0, 1],
      ["transparent", "#252326"]
    ),
  }));
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );
  //#endregion

  // render
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        containerStyle,
        {
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        },
      ]}
    />
  );
};

export const CustomCallControls = () => {
  const router = useRouter();
  const call = useCall();
  const { useCameraState, useMicrophoneState } = useCallStateHooks();
  const { status: cameraStatus } = useCameraState();
  const { status: microphoneStatus } = useMicrophoneState();
  const snapPoints = useMemo(() => ["15%", "90%"], []);
  const bottomRef = useRef<BottomSheet>(null);
  const onCallHangupHandler = async () => {
    await call?.leave();
    router.back();
  };
  const toggleVideoMuted = async () => {
    await call?.camera.toggle();
  };
  const toggleAudioMuted = async () => {
    await call?.microphone.toggle();
  };

  return (
    <BottomSheet
      ref={bottomRef}
      index={0}
      snapPoints={snapPoints}
      handleIndicatorStyle={{
        display: "none",
      }}
      backgroundComponent={CustomBackground}
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
      <View className="flex-row bg-[#252326] mx-6 gap-4 rounded-[28px] p-4 items-center justify-between">
        <View className="h-[5px] w-10 rounded-full absolute bg-[#494949] top-1 left-1/2 -translate-x-1" />
        <Pressable
          onPress={toggleVideoMuted}
          className={twMerge(
            "w-14 h-14 rounded-full transition items-center justify-center",
            cameraStatus === "disabled" ? "bg-[white]" : "bg-[#494949]"
          )}
        >
          <Ionicons
            name={
              cameraStatus === "disabled"
                ? "videocam-off-sharp"
                : "videocam-sharp"
            }
            size={28}
            color={cameraStatus === "disabled" ? "black" : "white"}
          />
        </Pressable>
        <Pressable
          onPress={toggleAudioMuted}
          className={twMerge(
            "w-14 h-14 rounded-full transition items-center justify-center",
            microphoneStatus === "disabled" ? "bg-[white]" : "bg-[#494949]"
          )}
        >
          <FontAwesome
            name={
              microphoneStatus === "disabled"
                ? "microphone-slash"
                : "microphone"
            }
            size={28}
            color={microphoneStatus === "disabled" ? "black" : "white"}
          />
        </Pressable>
        <Pressable className="w-14 h-14 rounded-full items-center justify-center bg-[#494949]">
          <Entypo name="message" size={28} color="white" />
        </Pressable>
        <Pressable className="w-14 h-14 rounded-full items-center justify-center bg-[#494949]">
          <Ionicons name="rocket-sharp" size={28} color="white" />
        </Pressable>
        <Pressable
          onPress={onCallHangupHandler}
          className="w-14 h-14 rounded-full items-center justify-center bg-[#f23f43]"
        >
          <FontAwesome name="phone" size={28} color="white" />
        </Pressable>
      </View>
      <View className="mt-14 px-6">
        <View className="rounded-2xl overflow-hidden">
          <Pressable className="flex-row items-center gap-4 bg-[#27272f] py-6 px-3">
            <MaterialIcons name="mobile-screen-share" size={24} color="white" />
            <Text className="text-lg flex-1 text-white font-bold">
              Chia Sẻ Màn Hình
            </Text>
          </Pressable>
          <Pressable className="flex-row items-center gap-4 bg-[#27272f] py-6 px-3">
            <Entypo name="folder-music" size={24} color="white" />
            <Text className="text-lg flex-1 text-white font-bold">
              Biểu Cảm tiếng
            </Text>
          </Pressable>
          <Pressable className="flex-row  items-center gap-4 bg-[#252326] py-6 px-3">
            <AntDesign name="smile-circle" size={24} color="white" />
            <Text className="text-lg flex-1 text-white font-bold">
              Đặt Hoạt Động Âm Thanh Voice
            </Text>
          </Pressable>
        </View>
        <Text className="font-semibold text-grayColor mb-6 mt-2">
          Cài Đặt Giọng Nói
        </Text>
        <View className="rounded-2xl overflow-hidden">
          <Pressable className="flex-row items-center gap-4 bg-[#27272f] py-6 px-3">
            <MaterialIcons name="headset-off" size={24} color="white" />
            <Text className="text-lg flex-1 text-white font-bold">
              Tắt Tiếng
            </Text>
            <AntDesign name="right" size={15} color={"white"} />
          </Pressable>
          <Pressable className="flex-row items-center gap-4 bg-[#27272f] py-6 px-3">
            <FontAwesome name="video-camera" size={24} color="white" />
            <Text className="text-lg flex-1 text-white font-bold">
              Chỉ hiển thị video
            </Text>
            <AntDesign name="right" size={15} color={"white"} />
          </Pressable>
          <Pressable className="flex-row  items-center gap-4 bg-[#27272f] py-6 px-3">
            <View className="h-10 w-10 rounded-full items-center justify-center bg-[#5865f2]">
              <FontAwesome name="user-plus" size={16} color="white" />
            </View>
            <Text className="text-lg flex-1 text-white font-bold">Lời Mời</Text>
            <AntDesign name="right" size={15} color={"white"} />
          </Pressable>
          <ScreenShareToggleButton />
        </View>
      </View>
    </BottomSheet>
  );
};
