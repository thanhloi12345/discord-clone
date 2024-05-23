import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { AntDesign } from "@expo/vector-icons";

import { TextInput } from "react-native-gesture-handler";
import { colors } from "../../../../libs/color";
import { ChannelType } from "../../../../types/type";
import { twMerge } from "tailwind-merge";
import useServerStore from "../../../../store/server-store";

import "react-native-get-random-values";
import { v4 } from "uuid";
import { createChannel } from "../../../../api/channels";
import useProfileStore from "../../../../store/profileStore";

const CreateChannel = () => {
  const router = useRouter();
  const [typeChannel, setTypeChannel] = useState(ChannelType.TEXT);
  const [channelName, setChanneName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { selectedServer } = useServerStore();
  const { profile } = useProfileStore();
  const onCreateChannel = async () => {
    setIsLoading(true);
    if (!profile || !selectedServer) {
      setIsLoading(false);
      return;
    }
    if (!typeChannel || !channelName) {
      setIsLoading(false);
      return;
    }
    try {
      await createChannel(selectedServer, {
        id: v4(),
        name: channelName,
        type: typeChannel,
        profileId: profile.userId,
        serverId: selectedServer,
      });

      setIsLoading(false);
      router.push("/server/");
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View className="flex-1 bg-primaryBg border-t-[0.2px] border-t-grayColor pt-6">
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Tạo Kênh",
            headerTitleAlign: "center",
            contentStyle: {
              alignContent: "center",
            },
            headerLeft: () => {
              return (
                <View className="flex-row gap-4 items-center">
                  <AntDesign name="close" size={24} color="white" />
                </View>
              );
            },
            headerRight: () => {
              return isLoading ? (
                <ActivityIndicator color={"#656c9f"} size={24} />
              ) : (
                <Pressable
                  onPress={onCreateChannel}
                  disabled={!!channelName ? false : true}
                  className="w-10 h-10 items-center justify-center rounded-full bg-inherit"
                >
                  <Text
                    className={twMerge(
                      "text-lg font-semibold",
                      !!channelName ? "text-[#656c9f]" : "text-red-500"
                    )}
                  >
                    Tạo
                  </Text>
                </Pressable>
              );
            },
            headerStyle: { backgroundColor: "#1c1d22" },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerShadowVisible: false,
          }}
        />
        <View className="border-t-[0.2px] border-t-grayColor p-4 gap-5 mb-6">
          <Text className="text-grayColor text-lg">TÊN KÊNH</Text>

          <TextInput
            className="py-2 text-grayColor text-lg bg-inherit"
            placeholder="kênh-mới"
            value={channelName}
            onChangeText={(channelName) => setChanneName(channelName)}
            placeholderTextColor={colors.grayColor}
          />
        </View>

        <View className="border-t-[0.2px] border-t-grayColor p-4 gap-7">
          <Text className="font-semibold text-xl text-grayColor">Tạo Kênh</Text>
          <View className="flex-row gap-3 items-center">
            <Feather name={"hash"} size={30} color={colors.grayColor} />
            <View className="flex-1 gap-1">
              <Text className="text-xl text-white font-bold">Văn Bản</Text>
              <Text className="text-sm text-grayColor font-semibold">
                Đăng hình ảnh, ảnh động sticker, ý kiến và chơi chữ
              </Text>
            </View>
            <Pressable
              onPress={() => setTypeChannel(ChannelType.TEXT)}
              className={twMerge(
                "p-1 rounded-full h-7 w-7 border-[2px]",
                typeChannel === ChannelType.TEXT
                  ? "border-white"
                  : "border-grayColor"
              )}
            >
              <View
                className={twMerge(
                  "flex-1  rounded-full",
                  typeChannel === ChannelType.TEXT && "bg-[#959cf7]"
                )}
              />
            </Pressable>
          </View>
          <View className="flex-row gap-3 items-center">
            <Feather name={"volume-2"} size={30} color={colors.grayColor} />
            <View className="flex-1 gap-1">
              <Text className="text-xl text-white font-bold">Giọng nói</Text>
              <Text className="text-sm text-grayColor font-semibold">
                Cùng gặp mặt gọi thoại video và chia sẽ màn hình
              </Text>
            </View>
            <Pressable
              onPress={() => setTypeChannel(ChannelType.AUDIO)}
              className={twMerge(
                "p-1 rounded-full h-7 w-7 border-[2px]",
                typeChannel === ChannelType.AUDIO
                  ? "border-white"
                  : "border-grayColor"
              )}
            >
              <View
                className={twMerge(
                  "flex-1  rounded-full",
                  typeChannel === ChannelType.AUDIO && "bg-[#959cf7]"
                )}
              />
            </Pressable>
          </View>
        </View>
        {isLoading && (
          <View className="absolute z-50 top-0 left-0 right-0 bottom-0  justify-center items-center bg-inherit" />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreateChannel;
