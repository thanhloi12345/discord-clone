import { View, Text, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../../libs/color";
import { Entypo } from "@expo/vector-icons";
import ListNotifiactions from "../../../components/list-notifications";
import { FriendRequests } from "@/src/types/type";

export type ExtendedFriendRequests = FriendRequests & {
  type: string;
};

export enum NotificationType {
  FRIENDREQUEST = "FriendRequest",
}
const Notifications = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.primaryColor,
        paddingHorizontal: 15,
        paddingTop: 12,
      }}
    >
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-white text-xl font-bold">Các Thông Báo</Text>
        <Pressable className="p-3 bg-[#111216] rounded-full">
          <Entypo name="dots-three-horizontal" size={16} color="white" />
        </Pressable>
      </View>
      <ListNotifiactions />
    </SafeAreaView>
  );
};

export default Notifications;
