import { View, Text, TextInput, Pressable, Image } from "react-native";
import React, { useCallback, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { colors } from "../../libs/color";
import { useRouter } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "../../hooks/useWarmUpBrowser";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hiddenPassword, setHiddenPassword] = useState(true);

  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onSignInWithGoogle = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        // @ts-ignore
        await setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.primaryBg,
      }}
    >
      <View className="flex-1 mt-4 px-4 items-center">
        <View className="self-start">
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-center text-2xl font-bold color-white mt-6">
          Chào mừng khi bạn trở lại
        </Text>
        <Text className="text-center text-sm font-semibold color-grayColor mt-2">
          Rất vui mừng khi được gặp lại bạn!
        </Text>
        <View className="mt-6 gap-3">
          <Text className="font-semibold text-base color-grayColor">
            Thông Tin Tài Khoản
          </Text>

          <View
            style={{
              width: "100%",
              height: hp("6%"),
            }}
            className="flex-row justify-center items-center rounded-md bg-secondaryBg"
          >
            <TextInput
              className="flex-1 px-4 py-2 text-lg text-grayColor"
              placeholder="Email"
              placeholderTextColor={colors.grayColor}
            />
          </View>

          <View
            style={{
              width: "100%",
              height: hp("6%"),
            }}
            className="flex-row justify-center items-center rounded-md bg-secondaryBg"
          >
            <TextInput
              className="flex-1 px-4 py-2 text-lg text-grayColor"
              placeholder="Mật Khẩu"
              placeholderTextColor={colors.grayColor}
              secureTextEntry={hiddenPassword}
            />
            <Pressable
              onPress={() => setHiddenPassword((prev) => !prev)}
              className="p-4 justify-center items-center rounded-full active:bg-grayColor/90"
            >
              <Entypo
                name={hiddenPassword ? "eye" : "eye-with-line"}
                size={18}
                color="white"
              />
            </Pressable>
          </View>
        </View>

        <Text className="self-start font-semibold text-blue-600 mt-3">
          Quên mật khẩu?
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
          <Text className="text-white text-base font-semibold">Đăng Nhập</Text>
        </TouchableOpacity>
        <View className="mt-6 gap-3">
          <Text className="font-semibold text-center uppercase text-white text-lg">
            Hoặc
          </Text>
          <Pressable
            onPress={onSignInWithGoogle}
            className="mt-5 items-center justify-center rounded-[6px] border-[2px] border-primaryButton group active:bg-primaryButton"
            style={{
              height: hp("6%"),
              width: wp("100%") - 32,
            }}
          >
            <Image
              source={require("../../../assets/images/google.png")}
              className="h-6 w-6 rounded-full object-contain absolute left-3 top-1/2 -translate-y-1/2 bg-primaryColors"
            />
            <Text className="text-primaryButton text-base group-active:text-white  font-semibold">
              Đăng Nhập với Google
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
