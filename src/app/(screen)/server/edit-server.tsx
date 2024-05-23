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
import ConfirmDeleteModal from "@/src/components/Modals/delete-server-modal";
import { updateServerName } from "@/src/api/channels";

const EditServer = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const { selectedServer } = useServerStore();
  const { selectedServer: server, setSelectedServer } = useListServersStore();
  const { profile } = useProfileStore();
  const [serverName, setServerName] = useState(server?.name);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDeleteServer = () => {
    setIsModalVisible(true);
  };

  const onUpdateServer = async () => {
    Keyboard.dismiss();
    if (!selectedServer || !serverName) return;
    setIsLoading(true);
    const updateServer = await updateServerName(selectedServer, serverName);
    setSelectedServer(updateServer);
    setIsLoading(false);
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
  const [notification, setNotification] = useState("all");
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View className="flex-1 bg-primaryBg pt-6">
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Cài Đặt Máy Chủ",
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
            headerRight: () => {
              return isLoading ? (
                <ActivityIndicator color={"#656c9f"} size={24} />
              ) : (
                <Pressable
                  onPress={onUpdateServer}
                  disabled={
                    serverName === "" || serverName === server?.name
                      ? true
                      : false
                  }
                  className="w-10 h-10 items-center justify-center rounded-full bg-inherit"
                >
                  <Text
                    className={twMerge(
                      "text-lg font-semibold",
                      serverName === "" || serverName === server?.name
                        ? "text-red-500"
                        : "text-[#656c9f]"
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
          <View className="gap-3 mb-5">
            <Text className="text-grayColor text-base font-semibold">
              Tên máy chủ
            </Text>
            <TextInput
              value={serverName}
              onChangeText={(text) => setServerName(text)}
              className="text-base text-white font-semibold rounded-2xl px-4 py-4 bg-[#111216]"
              selectionColor={colors.grayColor}
            />
          </View>
          <View className="gap-2">
            <Text className="text-base text-grayColor font-semibold">
              Cài Đặt Thông Báo Mặc Định
            </Text>
            <View className="rounded-2xl overflow-hidden bg-[#27272f]">
              <View className="flex-row gap-3 items-center pl-3 pr-6 py-6 justify-between">
                <Text className="text-lg text-white font-semibold">
                  Tất cả các tin Nhắn
                </Text>
                <Pressable
                  onPress={() => setNotification("all")}
                  className={twMerge(
                    "p-1 rounded-full h-7 w-7 border-[2px]",
                    notification === "all" ? "border-white" : "border-grayColor"
                  )}
                >
                  <View
                    className={twMerge(
                      "flex-1  rounded-full",
                      notification === "all" && "bg-[#959cf7]"
                    )}
                  />
                </Pressable>
              </View>
              <View className="flex-row gap-3 items-center pl-3 py-6 pr-6 justify-between">
                <Text className="text-white text-lg font-semibold">
                  Chỉ @mentions
                </Text>
                <Pressable
                  onPress={() => setNotification("member")}
                  className={twMerge(
                    "p-1 rounded-full h-7 w-7 border-[2px]",
                    notification === "member"
                      ? "border-white"
                      : "border-grayColor"
                  )}
                >
                  <View
                    className={twMerge(
                      "flex-1  rounded-full",
                      notification === "member" && "bg-[#959cf7]"
                    )}
                  />
                </Pressable>
              </View>
            </View>
          </View>

          <View className="gap-2">
            <Text className="text-base text-grayColor font-semibold">
              Hành Động Nguy Hiểm
            </Text>
            <View className="rounded-2xl overflow-hidden">
              <Pressable
                onPress={handleDeleteServer}
                className="flex-row  items-center gap-4 bg-[#27272f] py-6 px-3"
              >
                <Text className="text-lg flex-1 text-red-500 font-bold">
                  Xóa máy chủ
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        {isLoading && (
          <View className="absolute z-50 top-0 left-0 right-0 bottom-0 justify-center items-center bg-inherit" />
        )}
        <ConfirmDeleteModal
          isVisible={isModalVisible}
          onClose={handleCloseModal}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EditServer;
