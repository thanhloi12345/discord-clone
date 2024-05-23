import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  Image,
} from "react-native";

import React, { useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign, Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/src/libs/color";

const AddFriends = () => {
  const router = useRouter();
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View className="flex-1 bg-primaryBg pt-3">
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Thêm Bạn Bè",
            headerTitleAlign: "center",
            contentStyle: {
              alignContent: "center",
            },
            headerLeft: () => {
              return (
                <View className="flex-row gap-4 items-center">
                  <Feather name="arrow-left" size={24} color="#838592" />
                </View>
              );
            },
            headerStyle: { backgroundColor: "#1c1d22" },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "400",
              fontSize: 15,
            },
            headerShadowVisible: true,
          }}
        />
        <View className="flex-row mx-5 items-start justify-between">
          <View className="w-16 gap-2 items-center justify-center">
            <Pressable className="w-14 h-14 items-center justify-center bg-[#373a43] rounded-full">
              <Feather name="upload" size={24} color="white" />
            </Pressable>
            <Text
              numberOfLines={2}
              className="text-sm text-white font-semibold"
            >
              Chia sẻ Lời Mời
            </Text>
          </View>
          <View className="w-16 gap-2 items-center  justify-center">
            <Pressable className="w-14 h-14 items-center justify-center bg-[#373a43] rounded-full">
              <AntDesign name="link" size={24} color="white" />
            </Pressable>
            <Text
              numberOfLines={2}
              className="text-sm text-white font-semibold"
            >
              Sao Chép Link
            </Text>
          </View>
          <View className="w-16 gap-2   items-center  justify-center">
            <Pressable className="w-14 h-14 items-center justify-center bg-[#373a43] rounded-full">
              <Entypo name="message" size={24} color="white" />
            </Pressable>
            <Text
              numberOfLines={2}
              className="text-sm text-white font-semibold"
            >
              Tin Nhắn
            </Text>
          </View>
          <View className="w-16 gap-2  items-center justify-center">
            <Pressable className="w-14 h-14 items-center justify-center bg-[#373a43] rounded-full">
              <MaterialIcons name="email" size={24} color="white" />
            </Pressable>
            <Text
              numberOfLines={2}
              className="text-sm text-white font-semibold"
            >
              Email
            </Text>
          </View>
          <View className="w-16 gap-2  items-center justify-center">
            <Pressable className="w-14 h-14 items-center justify-center bg-[white] rounded-full">
              <Image
                source={require("../../../../assets/images/facebook-messenger.png")}
                className="h-8 w-8"
              />
            </Pressable>
            <Text
              numberOfLines={1}
              className="text-sm text-white font-semibold"
            >
              Messenger
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => router.push("/(screen)/messages/add-friend-by-name")}
          className="mt-5 mx-5 flex-row px-4 py-6 gap-4 rounded-2xl bg-[#27272f] items-center"
        >
          <Entypo name="email" size={20} color="white" />
          <Text
            className="text-lg text-white font-semibold flex-1"
            numberOfLines={1}
          >
            Thêm bằng tên người dùng
          </Text>
          <AntDesign name="right" size={14} color="white" />
        </Pressable>
        <View className="mx-5 mt-4 gap-4 rounded-2xl bg-[#27272f] py-4 px-4 items-center">
          <Image
            source={require("../../../../assets/images/icon.png")}
            className="h-48 w-48 object-contain"
          />
          <Text className="text-white text-lg font-semibold">Tìm Bạn Bè</Text>

          <View className="w-[70%] items-center">
            <Text
              className="text-grayColor text-sm text-center"
              numberOfLines={3}
            >
              Sync your phone contacts to find people you know on Discord.{" "}
              <Text className="text-[#1ca0e5] text-sm">Learn more</Text>
            </Text>
          </View>

          <Pressable className="mt-4 rounded-full w-full items-center justify-center py-3 bg-[#5865f2]">
            <Text className="text-base text-white font-semibold">
              Find Friends
            </Text>
          </Pressable>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AddFriends;
