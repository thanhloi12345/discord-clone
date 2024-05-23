import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import React, { useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { AntDesign } from "@expo/vector-icons";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { colors } from "../../../../libs/color";
import { Channel, ChannelType } from "../../../../types/type";
import { twMerge } from "tailwind-merge";
import useServerStore from "../../../../store/server-store";
import { MaterialIcons } from "@expo/vector-icons";

import "react-native-get-random-values";
import { v4 } from "uuid";
import {
  createChannel,
  deleteChannel,
  updateChannel,
} from "../../../../api/channels";
import useProfileStore from "../../../../store/profileStore";
import useChannelStore from "../../../../store/channel-store";

const EditChannel = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const { selectedServer } = useServerStore();
  const { profile } = useProfileStore();
  const { selectedChannel, setChannel } = useChannelStore();
  const [channelName, setChanneName] = useState(selectedChannel?.name);
  const [desciption, setDescription] = useState(
    !!selectedChannel?.description ? selectedChannel.description : ""
  );
  const onDeleteChannel = async () => {
    setIsLoading(true);
    if (!profile || !selectedServer || !selectedChannel) {
      setIsLoading(false);
      return;
    }

    try {
      await deleteChannel(
        !!selectedServer ? selectedServer : "",
        !!selectedChannel ? selectedChannel.id : ""
      );

      setIsLoading(false);
      setChannel(null);
      router.push("/(screen)/server/");
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  const onUpdateChannel = async () => {
    setIsLoading(true);
    if (!profile || !selectedServer || !selectedChannel) {
      setIsLoading(false);
      return;
    }
    if (!channelName) {
      setIsLoading(false);
      return;
    }

    try {
      await updateChannel(
        !!selectedServer ? selectedServer : "",
        !!selectedChannel ? selectedChannel.id : "",
        {
          name: channelName,
          description: desciption,
        }
      );

      setIsLoading(false);
      setChannel(null);
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
      <View className="flex-1 bg-primaryBg pt-6">
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Cài Đặt Kênh",
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
            headerRight: () => {
              return isLoading ? (
                <ActivityIndicator color={"#656c9f"} size={24} />
              ) : (
                <Pressable
                  onPress={onUpdateChannel}
                  disabled={channelName === "" ? true : false}
                  className="w-10 h-10 items-center justify-center rounded-full bg-inherit"
                >
                  <Text
                    className={twMerge(
                      "text-lg font-semibold",
                      channelName === "" ? "text-red-500" : "text-[#656c9f]"
                    )}
                  >
                    Lưu
                  </Text>
                </Pressable>
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingVertical: 20,
            gap: 20,
          }}
        >
          <View className="gap-2">
            <Text className="text-lg text-grayColor font-semibold">
              Tên Kênh
            </Text>
            <View className="w-full py-1 h-20 bg-[#27272f] rounded-2xl">
              <TextInput
                numberOfLines={1}
                className="rounded-2xl flex-1 p-3 text-grayColor text-lg font-semibold bg-[#131418]"
                value={channelName}
                onChangeText={(text) => setChanneName(text)}
              />
            </View>
          </View>

          <View className="gap-2">
            <Text className="text-lg text-grayColor font-semibold">
              Chủ Đề Kênh
            </Text>
            <View className="w-full py-1 bg-[#27272f] rounded-2xl">
              <TextInput
                multiline={true}
                numberOfLines={8}
                className="rounded-2xl flex-1 p-3 text-grayColor font-semibold text-lg bg-[#131418]"
                style={{
                  textAlignVertical: "top",
                }}
                onChangeText={(text) => setDescription(text)}
                value={desciption}
              />
            </View>
          </View>
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
          <Pressable
            onPress={onDeleteChannel}
            className="flex-row group active:bg-[#1c1d22] rounded-2xl items-center gap-4 bg-[#27272f] py-6 px-3"
          >
            <Text className="text-lg group-active:text-red-200 flex-1 text-red-400 font-bold">
              Xóa Kênh
            </Text>
          </Pressable>
        </ScrollView>
        {isLoading && (
          <View className="absolute z-50 top-0 left-0 right-0 bottom-0  justify-center items-center bg-inherit" />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EditChannel;
