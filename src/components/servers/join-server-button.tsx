import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { twMerge } from "tailwind-merge";
const JoinServerButton = () => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push("/server/join-server")}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className={twMerge(
        "w-[50px] h-[50px] justify-center transition items-center bg-[#27272f] rounded-full",
        isPressed ? "bg-[#309e5f]" : "bg-[#27272f]"
      )}
    >
      <Entypo
        name="flow-tree"
        size={24}
        color={isPressed ? "white" : "#309e5f"}
      />
    </Pressable>
  );
};

export default JoinServerButton;
