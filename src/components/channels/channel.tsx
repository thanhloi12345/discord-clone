import { View, Text, TouchableOpacity } from "react-native";
import React, { useRef } from "react";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../libs/color";
import { Channel, ChannelType } from "../../types/type";
import useChannelStore from "../../store/channel-store";
import { useRouter } from "expo-router";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import JoinConversationMdal from "../Modals/join-convertsation-modal";
import VideoCallModal from "../Modals/video-call-modal";

interface ChannelProps {
  data: Channel;
  initial?: boolean;
  onLongPress?: ((data?: any) => void) | undefined;
}

const ChannelComponent = ({ data, initial, onLongPress }: ChannelProps) => {
  const { setChannel } = useChannelStore();
  const joinAudioRef = useRef<BottomSheetModal>(null);
  const videoCallModalRef = useRef<BottomSheetModal>(null);
  const router = useRouter();

  return (
    <>
      <TouchableOpacity
        onPress={
          data.type === ChannelType.TEXT
            ? () =>
                router.push({
                  pathname: "/server/channel/chat",
                  params: {
                    channelId: data.id,
                  },
                })
            : () => joinAudioRef.current?.present()
        }
        onLongPress={() => {
          setChannel(data);
          !!onLongPress && onLongPress();
        }}
        style={{
          flexDirection: "row",
          gap: 6,
          width: "100%",
          alignItems: "center",
          backgroundColor: initial ? "#26262e" : "",
          padding: 12,
          borderRadius: 20,
        }}
      >
        <View>
          <Feather
            name={data.type === ChannelType.TEXT ? "hash" : "volume-2"}
            size={20}
            color={colors.grayColor}
          />
        </View>
        <Text
          numberOfLines={1}
          className="flex-1 text-base text-grayColor font-semibold"
        >
          {data.name}
        </Text>
      </TouchableOpacity>
      <JoinConversationMdal ref={joinAudioRef} channel={data} />
      <VideoCallModal ref={videoCallModalRef} />
    </>
  );
};

export default ChannelComponent;
