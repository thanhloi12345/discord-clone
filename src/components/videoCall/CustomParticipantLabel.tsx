import { Text, StyleSheet, View } from "react-native";
import {
  StreamVideoParticipant,
  ParticipantLabelProps,
  ParticipantLabel,
} from "@stream-io/video-react-native-sdk";

// A custom ParticipantLabel component that shows participant's name and if its a dominant speaker
const CustomParticipantLabel = (props: ParticipantLabelProps) => {
  return (
    <View className="">
      <ParticipantLabel {...props} />
    </View>
  );
};
