import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  Text,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { colors } from "../../libs/color";

const Login = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-primaryBg p-4">
      <View className="mt-20 flex-row justify-center items-center gap-6">
        <FontAwesome5 name="discord" size={55} color="white" />
        <Text className="font-extrabold text-5xl color-white">Discord</Text>
      </View>
      <View className="mt-4">
        <Image
          source={require("../../../assets/images/image-banner.png")}
          style={{
            width: wp("95%"),
            height: hp("45%"),
            resizeMode: "contain",
          }}
        />
      </View>
      <View className="gap-2 items-center justify-center mt-3">
        <Text className="text-center font-bold text-3xl color-white">
          Chào mừng bạn đến với Discord
        </Text>
        <Text className="text-center text-sm color-grayColor">
          Tham gia cùng với nhiều người dùng khác và trò chuyện với bạn bè và
          các cộng đồng khác nhau.
        </Text>
      </View>
      <View className="absolute bottom-4 items-center justify-center right-2 left-2 gap-3">
        <TouchableOpacity
          onPress={() => router.push("/register")}
          style={{
            height: hp("6%"),
            width: wp("92%"),
            backgroundColor: colors.primaryButton,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 4,
          }}
        >
          <Text className="color-white text-lg font-semibold">Đăng Ký</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/sign-in")}
          style={{
            height: hp("6%"),
            width: wp("92%"),
            backgroundColor: colors.secondaryBg,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 4,
          }}
        >
          <Text className="color-white text-lg font-semibold">Đăng Nhập</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
