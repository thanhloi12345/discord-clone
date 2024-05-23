import { Text, StyleSheet, ImageBackground, Image } from "react-native";
import {
  StreamVideoParticipant,
  ParticipantVideoFallbackProps,
} from "@stream-io/video-react-native-sdk";

export const CustomParticipantVideoFallback = ({
  participant,
}: ParticipantVideoFallbackProps) => {
  return (
    <ImageBackground
      blurRadius={5}
      source={{ uri: participant.image }}
      style={styles.background}
    >
      <Image source={{ uri: participant.image }} style={styles.avatar} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    borderRadius: 50,
    height: 100,
    width: 100,
  },
});
