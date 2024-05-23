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
import { uploadImage } from "@/src/utils/upload";
import { updateImageServer } from "@/src/api/channels";

const SettingServer = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const { selectedServer } = useServerStore();
  const { selectedServer: server, setSelectedServer } = useListServersStore();
  const [selectedImage, setSelectedImage] = useState<string>(
    server?.imageUrl ?? ""
  );
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setIsLoading(true);
      let url;
      const fetchResponse = await fetch(selectedImage);
      const theBlob = await fetchResponse.blob();
      try {
        url = await uploadImage(theBlob);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        return;
      }
      try {
        const newServer = await updateImageServer(server?.id ?? "", url);
        setSelectedServer(newServer);
        setIsLoading(false);
        setSelectedImage(result.assets[0].uri);
      } catch (error) {
        setIsLoading(false);
      }
    }
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
                  <Ionicons name="close-sharp" size={24} color="white" />
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
          <View className="justify-end items-center w-full py-8 gap-3">
            {!!selectedImage ? (
              <Pressable
                onPress={pickImageAsync}
                className="rounded-[30px] w-24 h-24 justify-center items-center gap-1"
              >
                <Image
                  source={{ uri: selectedImage }}
                  className="object-contain h-full w-full rounded-[30px]"
                />
                <Pressable className="absolute w-10 h-10 justify-center items-center bg-white rounded-full -top-2 -right-2">
                  <MaterialCommunityIcons
                    name="image-edit"
                    size={20}
                    color="black"
                  />
                </Pressable>
              </Pressable>
            ) : (
              <Pressable
                onPress={pickImageAsync}
                className="border-[2px] border-[#b8b9bd] border-dashed rounded-full w-24 h-24 justify-center items-center gap-1"
              >
                <Ionicons name="camera" size={24} color="#b8b9bd" />
                <Text className="text-[#b8b9bd] text-base">TẢI LÊN</Text>
                <Pressable className="absolute w-10 h-10 justify-center items-center bg-primaryButton rounded-full -top-2 -right-2">
                  <AntDesign name="plus" size={20} color="#b8b9bd" />
                </Pressable>
              </Pressable>
            )}
            <Text className="text-grayColor font-medium text-2xl">
              {server?.name}
            </Text>
          </View>
          <View className="gap-2">
            <Text className="text-base text-grayColor font-semibold">
              Cài Đặt
            </Text>
            <View className="rounded-2xl overflow-hidden">
              <Pressable
                onPress={() => router.push("/server/edit-server")}
                className="flex-row items-center gap-4 bg-[#27272f] py-6 px-3"
              >
                <AntDesign name="menufold" size={24} color="white" />
                <Text className="text-lg flex-1 text-white font-bold">
                  Tổng Quan
                </Text>
              </Pressable>
              <Pressable className="flex-row items-center gap-4 bg-[#27272f] py-6 px-3">
                <MaterialCommunityIcons
                  name="sword-cross"
                  size={24}
                  color="white"
                />
                <Text className="text-lg flex-1 text-white font-bold">
                  Điều Chỉnh
                </Text>
              </Pressable>
              <Pressable className="flex-row  items-center gap-4 bg-[#27272f] py-6 px-3">
                <FontAwesome name="wpforms" size={24} color="white" />
                <Text className="text-lg flex-1 text-white font-bold">
                  Nhật Ký Chỉnh Sửa
                </Text>
              </Pressable>
              <Pressable
                onPress={() => router.push("/server/list-channel/")}
                className="flex-row  items-center gap-4 bg-[#27272f] py-6 px-3"
              >
                <MaterialIcons
                  name="format-align-left"
                  size={24}
                  color="white"
                />
                <Text className="text-lg flex-1 text-white font-bold">
                  Kênh
                </Text>
              </Pressable>
              <Pressable className="flex-row  items-center gap-4 bg-[#27272f] py-6 px-3">
                <Ionicons name="game-controller" size={24} color="white" />
                <Text className="text-lg flex-1 text-white font-bold">
                  Tích Hợp
                </Text>
              </Pressable>
              <Pressable className="flex-row  items-center gap-4 bg-[#27272f] py-6 px-3">
                <AntDesign name="smile-circle" size={24} color="white" />
                <Text className="text-lg flex-1 text-white font-bold">
                  Emoji
                </Text>
              </Pressable>
              <Pressable className="flex-row  items-center gap-4 bg-[#27272f] py-6 px-3">
                <MaterialCommunityIcons
                  name="shield-account"
                  size={24}
                  color="white"
                />
                <Text className="text-lg flex-1 text-white font-bold">
                  Bảo Mật
                </Text>
              </Pressable>
            </View>
          </View>

          <View className="gap-2">
            <Text className="text-base text-grayColor font-semibold">
              Quản Lý Người Dùng
            </Text>
            <View className="rounded-2xl overflow-hidden">
              <Pressable
                onPress={() => router.push("/server/list-member")}
                className="flex-row  items-center gap-4 bg-[#27272f] py-6 px-3"
              >
                <Fontisto name="persons" size={24} color="white" />
                <Text className="text-lg flex-1 text-white font-bold">
                  Thành Viên
                </Text>
              </Pressable>
              <Pressable className="flex-row  items-center gap-4 bg-[#27272f] py-6 px-3">
                <MaterialCommunityIcons
                  name="shield-account"
                  size={24}
                  color="white"
                />
                <Text className="text-lg flex-1 text-white font-bold">
                  Vai Trò
                </Text>
              </Pressable>
              <Pressable className="flex-row  items-center gap-4 bg-[#27272f] py-6 px-3">
                <AntDesign name="link" size={24} color="white" />
                <Text className="text-lg flex-1 text-white font-bold">
                  Lời Mời
                </Text>
              </Pressable>
              <Pressable className="flex-row  items-center gap-4 bg-[#27272f] py-6 px-3">
                <Entypo name="block" size={24} color="white" />
                <Text className="text-lg flex-1 text-white font-bold">
                  Chặn
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
        {isLoading && (
          <View className="absolute z-50 top-0 left-0 right-0 bottom-0  justify-center items-center bg-inherit" />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SettingServer;
