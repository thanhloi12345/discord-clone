import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

interface OptionButtonProps {
  icon?: any;
  title: string;
  color?: string;
}
const OptionButton = ({ icon: Icon, title, color }: OptionButtonProps) => {
  return (
    <TouchableOpacity
      style={{
        width: "100%",
        padding: 20,
        backgroundColor: "#27272f",
        borderRadius: 20,
        flexDirection: "row",
        gap: 15,
        alignItems: "center",
      }}
    >
      {!!Icon ? (
        Icon
      ) : (
        // <MaterialIcons name="disabled-by-default" size={20} color="#c7c8cd" />
        <></>
      )}
      <Text
        className={`font-semibold text-[#c7c8cd] text-lg`}
        style={{
          color: !!color ? color : "white",
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default OptionButton;
