import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { Stack } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../../../libs/color";
import { twMerge } from "tailwind-merge";
import * as Linking from "expo-linking";
import { isValidString } from "@/src/utils/util";

const JoinServer = () => {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const [isFocused, setIsFocused] = useState(false);
  const [textInput, setTextInput] = useState("");

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View className="flex-1 bg-[#1c1d22] pt-6 px-4">
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
                  <AntDesign name="arrowleft" size={28} color="white" />
                </View>
              );
            },
            headerStyle: { backgroundColor: "#1c1d22" },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerShadowVisible: false,
          }}
        />

        <Text className="text-white text-center text-2xl font-bold mb-3">
          Tham gia một máy chủ có sẵn
        </Text>
        <Text className="text-grayColor text-sm text-center mb-6">
          Nhập lời mời bên dưới để tham gia một máy chủ có sẵn.
        </Text>
        <View className="gap-2">
          <Text className="text-sm text-[#9797a2] font-semibold">
            Liên kết mời
          </Text>
          <View className="w-full mb-5">
            <TextInput
              placeholder="https://discord.gg/htsfewf"
              placeholderTextColor={colors.grayColor}
              className={twMerge(
                "w-full px-4 py-5 rounded-2xl bg-[#111216] text-lg text-white font-semibol",
                isFocused && "border-[1.5px] border-neutral-800"
              )}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              selectionColor={colors.grayColor}
              value={textInput}
              onChangeText={(text) => setTextInput(text)}
            />
            <Pressable
              onPress={() => setTextInput("")}
              className={twMerge(
                "h-6 w-6 bg-gray-600 rounded-full items-center justify-center absolute right-6 top-1/2 -translate-y-1/2",
                !!textInput ? "flex" : "hidden"
              )}
            >
              <AntDesign name="close" size={12} color="black" />
            </Pressable>
          </View>
        </View>
        <Text className="text-sm text-grayColor font-semibold">
          Lời mời trông giống{" "}
          <Text className="text-white">https:/discord.gg/efewfewf, fwfwef</Text>{" "}
          hoặc <Text className="text-white">https:/discord.gg/thanhloi</Text>
        </Text>

        <View className="flex-1 gap-6 justify-end my-5">
          <Pressable
            onPress={async () => {
              const validUrl = isValidString(textInput)
                ? textInput
                : "myapp://server/invite?serverId=test&secretKey=test";
              await Linking.openURL(validUrl);
            }}
            className="w-full py-[14px] items-center justify-center rounded-full bg-[#5865f2]"
          >
            <Text className="text-white text-lg font-semibold">
              Tham gia bằng Liên Kết Mới
            </Text>
          </Pressable>
          <View className="w-full h-[0.2px] bg-gray-700">
            <Text className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-lg text-grayColor font-semibold bg-primaryBg px-3">
              HOẶC
            </Text>
          </View>
          <Pressable className="w-full py-[14px] items-center justify-center rounded-full bg-[#373a43]">
            <Text className="text-grayColor text-lg font-semibold">
              Tham gia một student Hub
            </Text>
          </Pressable>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default JoinServer;
