import { View, Text, TextInput, Pressable } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { colors } from "../../libs/color";
import { useRouter } from "expo-router";
import { twMerge } from "tailwind-merge";
const Register = () => {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isPhone, setIsPhone] = useState(true);
  return (
    <View className="pt-16 flex-1 bg-primaryBg px-4 items-center">
      <View className="self-start">
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={28} color="white" />
        </TouchableOpacity>
      </View>
      <Text className="text-center text-3xl font-bold color-white mt-6">
        Nhập số điện thoại hoặc email
      </Text>
      <View
        style={{
          height: hp("4%"),
          width: "100%",
        }}
        className="mt-6 flex-row bg-gray-900 rounded-md p-1"
      >
        <Pressable
          onPress={() => setIsPhone(true)}
          className={twMerge(
            "flex-1 justify-center items-center rounded-md",
            isPhone ? "bg-secondaryBg" : ""
          )}
        >
          <Text
            className={twMerge(
              `text-sm`,
              isPhone ? "color-white" : "color-grayColor"
            )}
          >
            Điện thoại!
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setIsPhone(false)}
          className={twMerge(
            "flex-1 justify-center items-center rounded-md",
            !isPhone ? "bg-secondaryBg" : ""
          )}
        >
          <Text
            className={twMerge(
              `text-sm`,
              !isPhone ? "color-white" : "color-grayColor"
            )}
          >
            Email
          </Text>
        </Pressable>
      </View>
      {!isPhone ? (
        <View className="mt-6 items-start gap-2">
          <Text className="color-grayColor font-semibold text-sm">Email</Text>
          <View
            style={{
              width: "100%",
              height: hp("7%"),
            }}
            className="flex-row justify-center items-center rounded-md bg-secondaryBg"
          >
            <TextInput
              className="flex-1 px-3 py-2 text-lg text-grayColor"
              placeholder="Email"
              placeholderTextColor={colors.grayColor}
            />
          </View>
        </View>
      ) : (
        <View className="mt-6 items-start gap-2">
          <Text className="color-grayColor font-semibold text-sm">
            Số Điện Thoại
          </Text>
          <View
            style={{
              width: "100%",
              height: hp("7%"),
            }}
            className="flex-row justify-center items-center rounded-md bg-secondaryBg"
          >
            <Pressable className="flex-[2] justify-between items-center border-r-[1px] border-r-grayColor">
              <Text className="font-bold text-xl color-white">US +1</Text>
            </Pressable>
            <TextInput
              className="flex-[8] px-3 py-2 text-lg text-grayColor"
              placeholder="Số điện thoại"
              placeholderTextColor={colors.grayColor}
            />
          </View>
        </View>
      )}
      <Text className="self-start font-semibold text-blue-600 mt-3">
        Xem Chính Sách Quyền Riêng Tư của Discord
      </Text>

      <TouchableOpacity
        style={{
          height: hp("6%"),
          width: wp("100%") - 32,
          marginTop: 20,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 6,
          backgroundColor: colors.primaryButton,
        }}
      >
        <Text className="text-white text-base">Tiếp theo</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;
