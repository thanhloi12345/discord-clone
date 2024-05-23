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
import useProfileStore from "@/src/store/profileStore";
import { twMerge } from "tailwind-merge";
import useSendFriendRequest from "@/src/hooks/useSendFriendRequest";
import Toast from "react-native-toast-message";

const AddFriendByName = () => {
  const { sendFriendRequest, loading, error, success, profile, setError } =
    useSendFriendRequest();
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(true);
  const router = useRouter();
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const handleOnFocus = () => {
    setFocused(true);
  };

  const handleOnBlur = () => {
    setFocused(false);
  };

  const onSendFriendRequest = async () => {
    await sendFriendRequest(email);
    console.log(success);
    if (success) {
      setEmail("");
      Toast.show({
        type: "success",
        text1: "Gửi kết bạn thành công",
      });
    }
  };
  const handleOnChangeEmail = (text: string) => {
    setEmail(text);
    if (email.length === 0 && error) {
      setError(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View className="flex-1 bg-primaryBg pt-3">
        <Stack.Screen
          options={{
            headerShown: true,
            title: "",
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
        <View className="pt-14 mx-5">
          <Text className="text-2xl text-white font-bold mb-5 text-center">
            Thêm Bằng Tên Người Dùng
          </Text>
          <Text className="text-grayColor text-sm font-semibold mb-2">
            Bạn muốn thêm ai làm bạn bè
          </Text>
          <View
            className={twMerge(
              "bg-[#111216] rounded-2xl overflow-hidden px-4 py-5 mb-2",
              focused && !error ? "border-[1px] border-gray-600" : "border-0",
              error && "border-[#e84449] border-[1px]"
            )}
          >
            <TextInput
              editable={!loading}
              value={email}
              autoFocus
              selectionColor={colors.grayColor}
              onFocus={handleOnFocus}
              onBlur={handleOnBlur}
              numberOfLines={1}
              onChangeText={handleOnChangeEmail}
              placeholder="Nhập Tên Người Dùng"
              placeholderTextColor={colors.grayColor}
              className="text-white font-semibold text-base"
            />
          </View>
          {!!error ? (
            <Text className="text-[12px] text-[#e84449] font-semibold">
              Hừm không có hiệu quả. Hãy kiểm tra xem tên người dùng đã chính
              xác hay chưa nhé.
            </Text>
          ) : (
            <Text className="text-[12px] text-grayColor font-semibold">
              À nhân tiện email của Bạn là{" "}
              <Text className="text-sm text-white">{profile?.email}</Text>
            </Text>
          )}
        </View>

        <Pressable
          disabled={!email || loading}
          onPress={onSendFriendRequest}
          className={twMerge(
            "mx-5 absolute left-0 right-0 rounded-full bottom-5 bg-[#5865f2] items-center justify-center py-4",
            !!email ? "bg-[#5865f2]" : " bg-[#5865f2aa]"
          )}
        >
          <Text
            className={twMerge(
              "text-base text-white font-semibold",
              !!email ? "text-white" : "text-[#fffa]"
            )}
          >
            Gửi Yêu Cầu Kết Bạn
          </Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AddFriendByName;
