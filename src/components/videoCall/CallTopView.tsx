import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useCall, useCallStateHooks } from "@stream-io/video-react-native-sdk";
import { Pressable, StyleSheet, Text, View } from "react-native";

export const CustomCallTopView = () => {
  const call = useCall();
  const { useCameraState } = useCallStateHooks();
  const { status: cameraStatus } = useCameraState();
  const toggleCameraFacingMode = async () => {
    await call?.camera.flip();
  };
  return (
    <View className="absolute top-8 flex-row w-full h-10 px-4 items-center justify-between">
      <View className="flex-row gap-3 items-center">
        <Pressable className="bg-transparent/80 h-10 w-10 rounded-full justify-center items-center">
          <AntDesign name="down" color={"white"} size={18} />
        </Pressable>
        <Pressable className="bg-transparent/80 flex-row h-10 gap-4 px-3 py-2 rounded-full items-center">
          <Text className="font-bold text-base text-white">Chung</Text>
          <AntDesign name="right" color={"white"} size={18} />
        </Pressable>
      </View>
      <View className="flex-row gap-3 items-center">
        <Pressable className="bg-[white] h-10 w-10 rounded-full justify-center items-center">
          <FontAwesome name="volume-up" size={18} color="black" />
        </Pressable>
        <Pressable className="bg-transparent/80 h-10 w-10 rounded-full justify-center items-center">
          <MaterialIcons name="person-add-alt-1" size={18} color="white" />
        </Pressable>
        {cameraStatus === "enabled" && (
          <Pressable
            onPress={toggleCameraFacingMode}
            className="bg-transparent/80 h-10 w-10 rounded-full justify-center items-center"
          >
            <MaterialIcons name="flip-camera-ios" size={18} color="white" />
          </Pressable>
        )}
      </View>
    </View>
  );
};
