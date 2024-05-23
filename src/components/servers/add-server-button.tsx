import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";

import { useRouter } from "expo-router";
import { twMerge } from "tailwind-merge";
const AddServerButton = () => {
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
      onPress={() => router.push("/server/create-server")}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className={twMerge(
        "w-[50px] h-[50px] justify-center transition items-center bg-[#27272f] rounded-full",
        isPressed ? "bg-[#309e5f]" : "bg-[#27272f]"
      )}
    >
      <AntDesign
        name="plus"
        size={24}
        color={isPressed ? "white" : "#309e5f"}
      />
    </Pressable>
  );
};

export default AddServerButton;
