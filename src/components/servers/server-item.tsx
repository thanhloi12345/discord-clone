import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import { twMerge } from "tailwind-merge";
import { Server } from "../../types/type";
import useListServersStore from "@/src/store/create-list-server-store";

const ServerItem = ({
  item,
  onPress,
  isSelected,
}: {
  item: Server;
  onPress: (id: string) => void;
  isSelected: boolean;
}) => {
  const { setSelectedServer } = useListServersStore();
  return (
    <View className="relative w-full h-14 items-center">
      <View
        className={twMerge(
          "absolute h-[80%] w-[5px] bg-white transition duration-100 rounded-full left-0 top-1/2 -translate-y-1/2 hidden",
          isSelected && "flex"
        )}
      />

      <Pressable
        onPress={() => {
          onPress(item.id);
          setSelectedServer(item);
        }}
        className={twMerge(
          "h-[50px] w-[50px] overflow-hidden transition rounded-full",
          isSelected && "rounded-[12px]"
        )}
      >
        <Image
          source={{ uri: item.imageUrl }}
          className={twMerge("w-[50px] h-[50px] object-contain")}
        />
      </Pressable>
    </View>
  );
};

export default ServerItem;
