import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  Button,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../../libs/color";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

import useProfileStore from "@/src/store/profileStore";
import { TextInput } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { twMerge } from "tailwind-merge";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/src/core/config";
import { Profile } from "@/src/types/type";
import { FirebaseError } from "firebase/app";
import { uploadImage } from "@/src/utils/upload";
import ColorPickerModal from "@/src/components/Modals/color-picker-modal";
import { useRouter } from "expo-router";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

const EditProfile = () => {
  const { profile, setProfile } = useProfileStore();
  const [name, setName] = useState(profile?.name);
  const [pronouns, setPronouns] = useState(profile?.pronouns);
  const [introduction, setIntroduction] = useState(profile?.introduction);
  const [imageFile, setImageFile] = useState<string | null | undefined>(
    profile?.imageUrl
  );
  const [color, setColor] = useState(profile?.favoriteColor);
  const colorPickerRef = useRef<BottomSheetModal>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageFile(result.assets[0].uri);
    }
  };

  const isStateDifferentFromProfile = useCallback((): boolean => {
    if (
      name !== profile?.name ||
      (!!pronouns && pronouns !== profile?.pronouns) ||
      (!!introduction && introduction !== profile?.introduction) ||
      profile?.imageUrl !== imageFile ||
      (!!color && profile?.favoriteColor !== color)
    ) {
      return true;
    }
    return false;
  }, [name, pronouns, introduction, imageFile]);

  console.log(!!pronouns && pronouns !== profile?.pronouns);

  const updateProfile = async () => {
    setLoading(true);
    try {
      let urlImage;
      if (imageFile !== profile?.imageUrl) {
        const fetchResponse = await fetch(imageFile ?? "");
        const theBlob = await fetchResponse.blob();
        urlImage = await uploadImage(theBlob);
      }
      const profileRef = doc(db, "profiles", profile?.userId ?? "");

      const fieldsToUpdate: Partial<Profile> = {};
      if (name) fieldsToUpdate.name = name;
      if (pronouns) fieldsToUpdate.pronouns = pronouns;
      if (introduction) fieldsToUpdate.introduction = introduction;
      if (!!urlImage) fieldsToUpdate.imageUrl = urlImage;
      if (!!color) fieldsToUpdate.favoriteColor = color;

      await updateDoc(profileRef, fieldsToUpdate);
      const profileSnapshot = await getDoc(profileRef);
      const updatedProfileData: Profile = profileSnapshot.data() as Profile;
      setProfile(updatedProfileData);
      setLoading(false);
      router.back();
    } catch (error: FirebaseError | any) {
      console.error("Error updating profile:", error.message || error);
      setLoading(false); // Even if there's an error, we need to set loading to false
      throw error; // Rethrow the error for handling in the caller function
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.primaryColor,
        paddingTop: 12,
      }}
    >
      <View className="px-7 pb-5 bg-[#1c1d22]">
        <View className="justify-between items-center flex-row mb-4">
          <AntDesign name="arrowleft" size={26} color={colors.grayColor} />
          <Text className="text-center flex-1 text-white text-xl font-bold">
            Hồ Sơ
          </Text>
          {loading ? (
            <ActivityIndicator size={"small"} color={"#5a5c8b"} />
          ) : (
            <Pressable
              onPress={updateProfile}
              disabled={!isStateDifferentFromProfile()}
              className={twMerge("")}
            >
              <Text
                className={twMerge(
                  "text-lg font-semibold",
                  isStateDifferentFromProfile()
                    ? "text-[#5a5c8b]"
                    : "text-red-500"
                )}
              >
                Lưu
              </Text>
            </Pressable>
          )}
        </View>

        <View className="w-full p-1 bg-[#111216] rounded-full flex-row items-center">
          <Pressable className="flex-1 px-3 py-2 bg-[#32323c] rounded-full justify-center items-center">
            <Text className="text-white text-lg font-semibold">
              Hồ sơ người dùng
            </Text>
          </Pressable>
          <Pressable className="flex-1 px-3 py-2 rounded-full justify-center items-center">
            <Text className="text-grayColor text-lg font-semibold">
              Hồ sơ máy chủ
            </Text>
          </Pressable>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: "#27272f",
          paddingBottom: 70,
        }}
      >
        <View
          className="h-48 w-full"
          style={{
            backgroundColor: color,
          }}
        >
          <Pressable
            onPress={() => colorPickerRef.current?.present()}
            className="h-8 w-8 bg-[#16151a] rounded-full justify-center items-center absolute top-4 right-4"
          >
            <FontAwesome5
              name="pencil-alt"
              size={16}
              color={colors.grayColor}
            />
          </Pressable>
        </View>
        <View className="mx-5 bg-[#27272f] mb-20">
          <Pressable
            onPress={pickImageAsync}
            className="absolute h-28 w-28 justify-center items-center rounded-full bg-[rgba(59,165,91,255)] border-8 border-[#27272f] -translate-y-1/2 left-5"
          >
            <View className="w-full h-full justify-center items-center">
              {!!imageFile ? (
                <Image
                  source={{ uri: imageFile }}
                  className="h-full w-full object-contain rounded-full"
                />
              ) : (
                <FontAwesome5 name="discord" size={50} color="white" />
              )}
              <View className="h-7 w-7 rounded-full bg-[rgba(59,165,91,255)] absolute border-[4px] border-[#1c1d22] bottom-1 right-1" />
              <Pressable className="h-8 w-8 bg-[#16151a] rounded-full justify-center items-center absolute -top-1 -right-1">
                <FontAwesome5
                  name="pencil-alt"
                  size={16}
                  color={colors.grayColor}
                />
              </Pressable>
            </View>
          </Pressable>
        </View>

        <View className="mx-5 p-5 bg-[#16151a] rounded-2xl">
          <Text className="text-3xl text-white font-semibold">
            {profile?.name}
          </Text>

          <Text className="text-sm text-white font-semibold">
            {profile?.email}
          </Text>
          {profile?.pronouns && (
            <Text className="text-sm text-white mb-8 font-semibold">
              {profile?.pronouns}
            </Text>
          )}
          <View className="gap-2 mb-5">
            <Text className="text-grayColor font-semibold text-base">
              TÊN HIỂN THỊ
            </Text>

            <View className="w-full">
              <TextInput
                value={name}
                onChangeText={(text) => setName(text)}
                className="text-white text-base font-semibold w-full px-5 py-6 rounded-md bg-[#16151a] border-[1px] border-neutral-800"
              />
              {!!name && (
                <Pressable
                  onPress={() => setName("")}
                  className="h-6 w-6 rounded-full items-center justify-center bg-[#c5c4ca] absolute top-1/2 -translate-y-1/2 right-5"
                >
                  <AntDesign name="close" size={16} color={"black"} />
                </Pressable>
              )}
            </View>
          </View>
          <View className="gap-2 mb-5">
            <Text className="text-grayColor font-semibold text-base">
              ĐẠI TỪ NHÂN XƯNG
            </Text>

            <View className="w-full">
              <TextInput
                value={pronouns}
                onChangeText={(text) => setPronouns(text)}
                placeholder="Nhập đê thêm đại từ nhân xưng"
                placeholderTextColor={colors.grayColor}
                className="text-white text-base font-semibold w-full px-5 py-6 rounded-md bg-[#16151a] border-[1px] border-neutral-800"
              />
              {!!pronouns && (
                <Pressable
                  onPress={() => setPronouns("")}
                  className="h-6 w-6 rounded-full items-center justify-center bg-[#c5c4ca] absolute top-1/2 -translate-y-1/2 right-5"
                >
                  <AntDesign name="close" size={16} color={"black"} />
                </Pressable>
              )}
            </View>
          </View>
          <View className="gap-2">
            <Text className="text-grayColor font-semibold text-base">
              GIỚI THIỆU VỀ TÔI
            </Text>

            <View className="w-full">
              <TextInput
                value={introduction}
                placeholder="Nhấn để thêm thông tin giới thiệu về bản thân"
                placeholderTextColor={colors.grayColor}
                onChangeText={(text) => setIntroduction(text)}
                numberOfLines={7}
                style={{
                  textAlignVertical: "top",
                }}
                className="text-white text-base font-semibold w-full px-5 py-6 rounded-md bg-[#16151a] border-[1px] border-neutral-800"
              />
              {!!introduction && (
                <Pressable
                  onPress={() => setIntroduction("")}
                  className="h-6 w-6 rounded-full items-center justify-center bg-[#c5c4ca] absolute top-1/2 -translate-y-1/2 right-5"
                >
                  <AntDesign name="close" size={16} color={"black"} />
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <ColorPickerModal
        ref={colorPickerRef}
        onSetColor={setColor}
        color={color}
      />
    </SafeAreaView>
  );
};

export default EditProfile;
