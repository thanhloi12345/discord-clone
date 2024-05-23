import { useAuth } from "@clerk/clerk-expo";
import { User } from "@stream-io/video-react-native-sdk";
import { router } from "expo-router";

/**
 * This is used to run the navigation logic from root level
 */
export const staticNavigateToRingingCall = () => {
  const intervalId = setInterval(async () => {
    const { userId } = useAuth();
    // add any requirements here (like authentication)
    if (userId) {
      clearInterval(intervalId);
      router.push("/(screen)/messages/room/ringing");
    }
  }, 300);
};
