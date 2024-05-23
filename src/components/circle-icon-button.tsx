import { View, Text, Pressable } from "react-native";
import React from "react";

interface CircleIconButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
}

const CircleIconButton = ({ children, onPress }: CircleIconButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      className="h-10 w-10 rounded-full bg-[#0d0d0f] justify-center items-center"
    >
      {children}
    </Pressable>
  );
};

export default CircleIconButton;
