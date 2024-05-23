import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Share,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";

import Spinner from "react-native-loading-spinner-overlay";
import {
  Call,
  CallContent,
  currentFriend,
  RingingCallContent,
  ScreenShareToggleButton,
  StreamCall,
  StreamVideoEvent,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { CustomCallControls } from "@/src/components/videoCall/CustomCallControls";
import { CustomVideoRenderer } from "@/src/components/videoCall/CustomVideoRenderer";
import { CustomCallTopView } from "@/src/components/videoCall/CallTopView";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomParticipantVideoFallback } from "@/src/components/videoCall/CustomParticipantVideoFallback";
import { StatusBar } from "expo-status-bar";
import useCurrentFriendStore from "@/src/store/create-current-friend-store";
import useProfileStore from "@/src/store/profileStore";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const Page = () => {
  const { profile } = useProfileStore();
  const { currentFriend } = useCurrentFriendStore();
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const router = useRouter();
  const [call, setCall] = useState<Call | null>(null);
  const client = useStreamVideoClient();
  useEffect(() => {
    // Listen to call events
    const unsubscribe = client!.on("all", (event: StreamVideoEvent) => {
      // console.log(event);
      // if (event.type === "call.reaction_new") {
      //   console.log(`New reaction: ${event.reaction}`);
      // }
      // if (event.type === "call.session_participant_joined") {
      //   console.log(`New user joined the call: ${event.participant}`);
      //   const user = event.participant.user.name;
      //   Toast.show({
      //     text1: "User joined",
      //     text2: `Say hello to ${user} 👋`,
      //   });
      // }
      // if (event.type === "call.session_participant_left") {
      //   console.log(`Someone left the call: ${event.participant}`);
      //   const user = event.participant.user.name;
      //   Toast.show({
      //     text1: "User left",
      //     text2: `Say goodbye to ${user} 👋`,
      //   });
      // }
    });
    // Stop the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  // Join the call
  useEffect(() => {
    if (!client || call) return;
    const joinCall = async () => {
      const call = client!.call("default", roomId.substring(0, 64) ?? "");
      await call.getOrCreate({
        ring: true,
        data: {
          members: [
            { user_id: profile?.userId ?? "" },
            { user_id: currentFriend?.userId ?? "" },
          ],
        },
      });
      setCall(call);
    };
    joinCall();
  }, [call]);

  // Navigate back home on hangup
  const goToHomeScreen = async () => {
    await call?.leave();
    router.push({
      pathname: "/server/",
    });
  };

  // Share the meeting link
  const shareMeeting = async () => {
    Share.share({
      message: `Join my meeting: myapp://(screen)/server/channel/${roomId}`,
    });
  };

  if (!call) return null;

  return (
    <>
      <View style={{ flex: 1 }}>
        <Spinner visible={!call} />
        <StreamCall call={call}>
          <View style={styles.container}>
            <RingingCallContent />
          </View>
        </StreamCall>
      </View>
      <StatusBar
        animated
        backgroundColor="transparent"
        hideTransitionAnimation="fade"
        networkActivityIndicatorVisible
        translucent
      ></StatusBar>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: WIDTH > HEIGHT ? "row" : "column",
  },
  videoContainer: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "#fff",
  },
});

export default Page;
