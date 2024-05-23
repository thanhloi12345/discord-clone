import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";

import React, { useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome6,
  Fontisto,
  Ionicons,
} from "@expo/vector-icons";

import { AntDesign } from "@expo/vector-icons";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { colors } from "../../../libs/color";
import { Channel, ChannelType } from "../../../types/type";
import { twMerge } from "tailwind-merge";
import useServerStore from "../../../store/server-store";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import "react-native-get-random-values";
import { v4 } from "uuid";
import useProfileStore from "@/src/store/profileStore";
import useListServersStore from "@/src/store/create-list-server-store";
import { useLoadServerById } from "@/src/hooks/useLoadServers";
import useChannelStore from "@/src/store/channel-store";

const ListChannel = () => {
  const router = useRouter();
  const { server, loading, setLoading } = useLoadServerById();
  const { setChannel } = useChannelStore();
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View className="flex-1 bg-primaryBg pt-6">
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Kênh",
            headerTitleAlign: "center",
            contentStyle: {
              alignContent: "center",
            },
            headerLeft: () => {
              return (
                <View className="flex-row gap-4 items-center">
                  <AntDesign name="arrowleft" size={24} color="white" />
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingVertical: 20,
            gap: 20,
          }}
        >
          {loading ? (
            <ActivityIndicator size={"large"} color={"#5865f3"} />
          ) : (
            <>
              <View className="gap-5 mb-4">
                <Text className="text-lg text-grayColor font-semibold">
                  KÊNH ĐÀM THOẠI
                </Text>
                <View>
                  {server?.channels
                    ?.filter((channel) => channel.type === ChannelType.AUDIO)
                    .map((channel) => (
                      <Pressable
                        onPress={() => {
                          setChannel(channel);
                          router.push({
                            pathname: "/server/channel/edit-channel",
                          });
                        }}
                        key={channel.id}
                        className="px-3 py-4 flex-row gap-4 items-center"
                      >
                        <FontAwesome6 name="hashtag" size={24} color="white" />
                        <Text className="text-lg text-white font-semibold">
                          {channel.name}
                        </Text>
                      </Pressable>
                    ))}
                </View>
              </View>
              <View className="gap-4">
                <Text className="text-lg text-grayColor font-semibold">
                  KÊNH CHAT
                </Text>
                <View>
                  {server?.channels
                    ?.filter((channel) => channel.type === ChannelType.TEXT)
                    .map((channel) => (
                      <Pressable
                        onPress={() => {
                          setChannel(channel);
                          router.push({
                            pathname: "/server/channel/edit-channel",
                          });
                        }}
                        key={channel.id}
                        className="px-3 py-4 flex-row gap-4 items-center"
                      >
                        <FontAwesome6 name="hashtag" size={24} color="white" />
                        <Text className="text-lg text-white font-semibold">
                          {channel.name}
                        </Text>
                      </Pressable>
                    ))}
                </View>
              </View>
              <Pressable
                onPress={() => router.push("/server/channel/create-channel")}
                className="absolute bottom-7 left-1/2 -translate-x-8 rounded-full flex-row gap-3 px-4 py-3 items-center bg-[#5865f3]"
              >
                <AntDesign name="plus" size={24} color="white" />
                <Text className="text-lg text-white font-bold">Tạo</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ListChannel;
