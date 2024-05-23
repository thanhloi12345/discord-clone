import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { colors } from "../libs/color";

interface MutipleOptionsProps {
  options: { icon?: any; title: string; onPress?: () => void }[];
}

const MutipleOptions = ({ options }: MutipleOptionsProps) => {
  return (
    <View className="bg-[#27272f] rounded-3xl">
      {options.map(({ icon: Icon, title, onPress }, index) => (
        <View key={index} className="w-full flex-row items-center">
          <View
            className="justify-center items-center"
            style={{
              paddingLeft: 20,
              paddingRight: !!Icon ? 20 : 0,
            }}
          >
            {!!Icon ? (
              Icon
            ) : (
              // <MaterialIcons
              //   name="disabled-by-default"
              //   size={20}
              //   color="#c7c8cd"
              // />
              <></>
            )}
          </View>
          <TouchableOpacity
            onPress={onPress}
            style={{
              flex: 1,
              paddingVertical: 20,
              justifyContent: "center",
              borderBottomWidth: index === options.length - 1 ? 0 : 0.2,
              borderBottomColor: colors.grayColor,
            }}
          >
            <Text className="text-[#c7c8cd] font-semibold text-lg">
              {title}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default MutipleOptions;
