import { View, StyleSheet, Dimensions, Pressable } from "react-native";
import { RTCView } from "@stream-io/react-native-webrtc";
import {
  ParticipantView,
  VideoRendererProps,
  ParticipantLabel,
} from "@stream-io/video-react-native-sdk";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export const CustomVideoRenderer = (prop: VideoRendererProps) => {
  const [fullView, setFullView] = useState(false);
  const { isLocalParticipant } = prop.participant;

  if (!isLocalParticipant) return <ParticipantView {...prop} />;
  return (
    <View className="flex-1 justify-center items-center">
      <ParticipantView
        style={{
          width: fullView ? WIDTH : WIDTH - 30,
          height: fullView ? HEIGHT : WIDTH - 30,
          borderRadius: fullView ? 0 : 30,
        }}
        ParticipantNetworkQualityIndicator={(
          ParticipantNetworkQualityIndicator
        ) => {
          return (
            <Pressable
              onPress={() => setFullView((prev) => !prev)}
              className={twMerge(
                "right-2 bottom-1 h-10 w-10 rounded-full items-center justify-center bg-transparent/70",
                fullView ? "bottom-28 right-3" : ""
              )}
            >
              <MaterialCommunityIcons
                name={fullView ? "arrow-collapse" : "arrow-expand"}
                size={24}
                color="white"
              />
            </Pressable>
          );
        }}
        {...prop}
        ParticipantLabel={(props) => (
          <View
            className={twMerge(
              "left-4 bg-transparent/70 rounded-full overflow-hidden",
              fullView ? "bottom-28 left-3" : ""
            )}
          >
            <ParticipantLabel {...props} />
          </View>
        )}
      />
    </View>
  );
};
