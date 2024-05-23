import {
  View,
  Text,
  Pressable,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colors } from "../../../libs/color";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import useProfileStore from "../../../store/profileStore";
import { uploadImage } from "../../../utils/upload";
import { DEFAULT_IMAGE } from "../../../libs/constant";
import "react-native-get-random-values";
import { v4 } from "uuid";
import { createNewServer } from "../../../api/servers";
import useServerStore from "../../../store/server-store";

const CreateServer = () => {
  const [loading, setIsLoading] = useState(false);
  const { profile } = useProfileStore();
  const router = useRouter();
  const { selectServer } = useServerStore();
  const [serverName, setServerName] = useState<string>(
    `Máy chủ của ${profile?.name}`
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const onRemoveServerName = () => {
    setServerName("");
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };
  const onCreateServer = async () => {
    setIsLoading(true);
    if (profile === null || !serverName) {
      setIsLoading(false);
      return;
    }
    let url;
    if (!!selectedImage) {
      const fetchResponse = await fetch(selectedImage);
      const theBlob = await fetchResponse.blob();

      try {
        url = await uploadImage(theBlob);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        return;
      }
    } else url = DEFAULT_IMAGE;

    try {
      const serverId = v4();
      await createNewServer({
        id: serverId,
        inviteCode: v4(),
        createdAt: new Date().toISOString(),
        imageUrl: url,
        updatedAt: new Date().toISOString(),
        name: serverName,
        profileId: profile.userId,
      });
      selectServer(serverId);
      router.back();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <View className="flex-1 bg-primaryColor pt-14 px-5">
        <Pressable
          onPress={router.back}
          className="flex-row items-center justify-start mb-5"
        >
          <Feather name="arrow-left" size={30} color="white" />
        </Pressable>
        <Text className="text-center font-bold text-white text-3xl mt-3">
          Tạo Máy Chủ Của Bạn
        </Text>
        <Text className="text-grayColor text-base text-center mt-2">
          Máy chủ của bạn là nơi bạn giao lưu với bạn bè của mình.
        </Text>

        <View className="justify-end items-center w-full py-10">
          {!!selectedImage ? (
            <Pressable
              onPress={pickImageAsync}
              className="rounded-full w-24 h-24 justify-center items-center gap-1"
            >
              <Image
                source={{ uri: selectedImage }}
                className="object-contain h-full w-full rounded-full"
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
        </View>
        <Text className="text-base font-semibold text-[#b8b9bd] mb-2">
          Tên máy chủ
        </Text>
        <View className="w-full flex-row h-16 mb-2 py-4 px-5 bg-[#111216] rounded-xl">
          <TextInput
            onChangeText={(text: string) => setServerName(text)}
            value={serverName}
            className="px-2 flex-1 font-semibold text-lg text-white"
            placeholderTextColor={colors.grayColor}
          />
          <Pressable
            onPress={onRemoveServerName}
            className="justify-center items-center"
          >
            <Octicons name="x-circle-fill" size={16} color="#b8b9bd" />
          </Pressable>
        </View>
        <Text className="text-grayColor text-sm text-start mb-3">
          Khi tạo máy chủ, nghĩa là bạn đã đồng ý với{" "}
          <Text className="text-[#24a4de]">Nguyên tắc Cộng Đồng</Text> cua
          Discord.
        </Text>
        <TouchableOpacity
          onPress={onCreateServer}
          style={{
            width: "100%",
            borderRadius: 999,
            paddingVertical: 13,
            backgroundColor:
              serverName === "" ||
              serverName === undefined ||
              serverName === null
                ? "red"
                : colors.primaryButton,
          }}
          disabled={
            serverName === "" || serverName === undefined || serverName === null
              ? true
              : false
          }
        >
          <Text className="text-white font-semibold text-center">
            Tạo máy Chủ
          </Text>
        </TouchableOpacity>
        {loading && (
          <View className="absolute z-50 top-0 left-0 right-0 bottom-0 justify-center items-center bg-black/70">
            <ActivityIndicator size="large" color={colors.grayColor} />
          </View>
        )}
      </View>
    </>
  );
};

export default CreateServer;
