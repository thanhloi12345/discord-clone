import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Stack } from "expo-router";
import {
  AntDesign,
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { colors } from "../../../libs/color";
import { twMerge } from "tailwind-merge";
import * as Linking from "expo-linking";
import { isValidString } from "@/src/utils/util";
import { useAuth } from "@clerk/clerk-expo";
import useServerStore from "@/src/store/server-store";
import useProfileStore from "@/src/store/profileStore";
import useFriendStore from "@/src/store/friend-store";

const JoinServer = () => {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const { signOut } = useAuth();
  const { selectServer } = useServerStore();
  const { setProfile } = useProfileStore();
  const { setFriends } = useFriendStore();
  const doLogout = () => {
    setProfile(null);
    selectServer(null);
    setFriends([]);
    signOut();
  };
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View className="flex-1 bg-[#1c1d22] pt-6 px-4">
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Cài Đặt",
            headerTitleAlign: "center",
            contentStyle: {
              alignContent: "center",
            },
            headerLeft: () => {
              return (
                <View className="flex-row gap-4 items-center">
                  <AntDesign name="arrowleft" size={28} color="white" />
                </View>
              );
            },
            headerStyle: { backgroundColor: "#1c1d22" },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerShadowVisible: true,
          }}
        />
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            gap: 10,
            paddingBottom: 20,
          }}
        >
          <View className="w-full items-center flex-row rounded-2xl px-4 py-4 gap-3 bg-[#111216] mb-8">
            <Feather name="search" size={20} color="white" />
            <TextInput
              placeholder="Search"
              placeholderTextColor={colors.grayColor}
              className="flex-1 text-white text-sm font-semibold"
            />
          </View>
          <View className="gap-2 w-full mb-6">
            <Text className="text-grayColor text-base font-bold">
              Cài Đặt Tài Khoản
            </Text>
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
          </View>

          <View className="gap-2 w-full mb-6">
            <Text className="text-grayColor text-base font-bold">Hỗ trợ</Text>
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
          </View>
          <View className="gap-2 w-full mb-6">
            <Text className="text-base text-grayColor font-bold">
              Có gì mới
            </Text>
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
          </View>

          <Pressable
            onPress={() => doLogout()}
            className="flex-row group active:bg-[#1c1d22] rounded-2xl items-center gap-4 bg-[#27272f] py-6 px-3"
          >
            <MaterialCommunityIcons name="logout" size={24} color="white" />
            <Text className="text-lg group-active:text-red-200 flex-1 text-red-400 font-bold">
              Đăng xuất
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default JoinServer;
