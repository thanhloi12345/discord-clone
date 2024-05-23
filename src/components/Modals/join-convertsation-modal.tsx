import { forwardRef, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { colors } from "../../libs/color";

import CircleIconButton from "../circle-icon-button";
import { Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const JoinConversationMdal = forwardRef<BottomSheetModal>((props, ref) => {
  const snapPoints = useMemo(() => ["45%"], []);
  const router = useRouter();
  // @ts-ignore
  const { channel } = props;
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
        <View className="flex-row justify-between items-center">
          <CircleIconButton onPress={dismissAll}>
            <Entypo name="chevron-down" size={20} color="white" />
          </CircleIconButton>
          <CircleIconButton>
            <MaterialIcons name="person-add-alt-1" size={20} color="white" />
          </CircleIconButton>
        </View>
        <View className="w-full justify-center items-center">
          <View className="-top-5 h-28 w-28 overflow-hidden rounded-full">
            <LinearGradient
              colors={["purple", "#463b88"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                height: "100%",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesome5 name="volume-off" size={50} color="white" />
            </LinearGradient>
          </View>
          <Text className="text-center font-bold text-2xl text-white mb-2">
            Chung
          </Text>
          <Text className="text-center text-grayColor text-base">
            Hiện chưa có ai ở đây!.
          </Text>
          <Text className="text-center text-grayColor text-base mb-5">
            Khi nào bạn sẵn sàng trò chuyện hãy tham gia.
          </Text>
        </View>
        <View className="w-full bg-[#2c2c34] rounded-[36px] p-6 flex-row justify-between gap-4 absolute bottom-4">
          <Pressable className="h-14 w-14 rounded-full bg-[white] justify-center items-center">
            <FontAwesome5 name="microphone" size={28} color="black" />
          </Pressable>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              alignContent: "center",
              borderRadius: 9999,
              backgroundColor: "#23a65a",
            }}
            onPress={() =>
              router.push({
                pathname: `/(screen)/server/channel/${channel.id}`,
              })
            }
          >
            <Text className="text-white text-center font-bold">
              Tham gia thoại
            </Text>
          </TouchableOpacity>
          <Pressable className="h-14 w-14 rounded-full bg-[#4d4d55] justify-center items-center">
            <MaterialCommunityIcons name="chat" size={28} color="white" />
          </Pressable>
        </View>
      </View>
    </BottomSheetModal>
  );
});

export default JoinConversationMdal;
