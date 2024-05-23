import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { colors } from "../../libs/color";
import { Octicons } from "@expo/vector-icons";
import { Channel, ChannelType } from "../../types/type";
import ChannelComponent from "./channel";
import { useRouter } from "expo-router";

interface GroupChannelsProps {
  name: string;
  initial?: boolean;
  type: string;
  onLongPress?: () => void;
  channels?: Channel[];
  onPresent?: ((data?: any) => void) | undefined;
}

const GroupChannels = ({
  onPresent,
  name,
  onLongPress,
  channels,
}: GroupChannelsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const generalChannel = channels?.find(
    (channel) => channel.name === "General"
  );
  const router = useRouter();
  return (
    <View className="gap-2">
      <TouchableOpacity
        onLongPress={onLongPress}
        onPress={() => setIsOpen(!isOpen)}
        style={{
          flexDirection: "row",
          gap: 6,
          alignItems: "center",
          width: "100%",
        }}
      >
        <View>
          <Octicons
            name={isOpen ? "chevron-down" : "chevron-right"}
            size={18}
            color={colors.grayColor}
          />
        </View>
        <Text
          numberOfLines={1}
          className="flex-1 text-base text-grayColor font-semibold"
        >
          {name}
        </Text>
      </TouchableOpacity>
      <View className="items-center">
        {!!generalChannel && (
          <ChannelComponent
            data={generalChannel}
            initial
            onLongPress={onPresent}
          />
        )}
        {isOpen &&
          channels
            ?.filter((channel) => channel.name !== "General")
            .map((channel, id) => (
              <ChannelComponent
                key={channel.id}
                data={channel}
                onLongPress={onPresent}
              />
            ))}
      </View>
    </View>
  );
};

export default GroupChannels;
