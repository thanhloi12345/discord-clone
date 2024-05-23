// Import your global CSS file
import "expo-dev-client";
import "../global.css";
import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-expo";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CreateChannelModal from "../components/Modals/create-channel-modal";
import JoinConversationMdal from "../components/Modals/join-convertsation-modal";
import EditServerModal from "../components/Modals/edit-server-modal";
import EditChannelModal from "../components/Modals/edit-channel-modal";
import ColorPickerModal from "../components/Modals/color-picker-modal";
import useProfileStore from "../store/profileStore";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { OverlayProvider } from "stream-chat-expo";
import {
  CallingState,
  StreamVideo,
  StreamVideoClient,
  useCall,
  useCalls,
  User,
} from "@stream-io/video-react-native-sdk";
import Toast from "react-native-toast-message";
import { initialProfile } from "../api/authentication/profile";
import useFriendStore from "../store/friend-store";
import { getUserFriends } from "../api/friends";
import { fetchServers } from "../api/servers";
import useListServersStore from "../store/create-list-server-store";
import { dbRealTime } from "../core/config";
import { ref, set } from "firebase/database";
const STREAM_KEY = process.env.EXPO_PUBLIC_STREAM_ACCESS_KEY;
const CLERK_PUBLISHABLE_KEY =
  "pk_test_Y2hvaWNlLXBvbnktNDEuY2xlcmsuYWNjb3VudHMuZGV2JA";
const API_URL = process.env.EXPO_PUBLIC_STREAM_API_URL as string;
import NetInfo from "@react-native-community/netinfo";
import useNotificationObserver from "../hooks/useNotificationObserver";
import { usePushNotifications } from "../hooks/usePushNotifications";
const InitialLayout = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  // const { user } = useUser();
  const segments = useSegments();
  const router = useRouter();
  const { profile, setProfile } = useProfileStore();
  const { setFriends } = useFriendStore();
  const { setServers, selectedServer, setSelectedServer } =
    useListServersStore();
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  useNotificationObserver();
  const { notification } = usePushNotifications();
  useEffect(() => {
    const userStatusRef = ref(dbRealTime, `profiles/${profile?.userId}`);

    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        set(userStatusRef, {
          isOnline: true,
        });
      } else {
        set(userStatusRef, { isOnline: false });
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // if (!isLoaded) return;
    // const inTabsGroup = segments[0] === "(main)";
    // if (isSignedIn && !inTabsGroup) {
    //   profile === null
    //     ? initialProfile(user)
    //         .then((profile) => setProfile(profile))
    //         .then(() => router.replace("/(screen)/profile"))
    //     : router.replace("/(screen)/profile");
    // } else if (!isSignedIn) {
    //   router.replace("/(main)/login");
    // }
    const initial = async () => {
      if (!isLoaded) return;
      const inTabsGroup = segments[0] === "(main)";
      if (isSignedIn && !inTabsGroup) {
        const token = await getToken();
        const response = await fetch(
          `${API_URL}/api/profiles/initial-profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              mode: "cors",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const { profile, token: clientToken } = await response.json();
        const friends = await getUserFriends(profile.userId);
        const listServers = await fetchServers(profile.userId);
        const user: User = { id: profile.userId };

        router.replace("/(screen)/profile");
        try {
          const client = new StreamVideoClient({
            apiKey: STREAM_KEY!,
            user,
            token: clientToken,
          });
          setProfile(profile);
          setClient(client);
          setFriends(friends);
          setServers(listServers);
          !selectedServer && listServers && setSelectedServer(listServers[0]);
        } catch (e) {
          console.log("Error creating client: ", e);
        }
      } else if (!isSignedIn) {
        router.replace("/(main)/login");
      }
    };
    initial();
  }, [isSignedIn]);

  if (!client) {
    return <Slot />;
  }

  return (
    <StreamVideo client={client}>
      <Slot />
      <Toast />
    </StreamVideo>
  );
};

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const _Layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ClerkProvider
          publishableKey={CLERK_PUBLISHABLE_KEY}
          tokenCache={tokenCache}
        >
          <InitialLayout />
          <CreateChannelModal />
          <EditServerModal />
          <JoinConversationMdal />
          <EditChannelModal />
          <ColorPickerModal />
        </ClerkProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default _Layout;
