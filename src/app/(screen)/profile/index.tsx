import { View, Text, Image, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../../libs/color";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useProfileStore from "@/src/store/profileStore";
import moment from "moment";
import useFriendStore from "@/src/store/friend-store";

import { ref, set, onValue, off } from "firebase/database";
import { dbRealTime } from "@/src/core/config";
import { twMerge } from "tailwind-merge";
import { CallingState, useCalls } from "@stream-io/video-react-native-sdk";
import useNotificationTokenStore from "@/src/store/create-token-notification-store";
import {
  saveTokenToFirestore,
  sendPushNotification,
} from "@/src/api/send-notification";

const Profile = () => {
  const router = useRouter();
  const [online, setOnline] = useState(false);
  const { profile, setProfile } = useProfileStore();
  const { friends } = useFriendStore();
  const { token } = useNotificationTokenStore();

  useEffect(() => {
    const dbRef = ref(dbRealTime, `profiles/${profile?.userId}`);

    const fetchData = () => {
      onValue(dbRef, (snapshot) => {
        if (snapshot.exists()) {
          const { isOnline } = snapshot.val() as { isOnline: boolean };
          setOnline(isOnline);
        } else {
          setOnline(false);
        }
      });
    };

    fetchData();

    return () => {
      off(dbRef);
    };
  }, []);

  useEffect(() => {
    if (!profile || !token) return;

    saveTokenToFirestore(profile.userId, token).catch((error) =>
      console.log(error)
    );
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#111214",
        paddingTop: 12,
      }}
    >
      <View className="flex-row mx-5 justify-end mb-24">
        <Pressable
          onPress={() => router.navigate("/profile/setting")}
          className="h-12 w-12 active:bg-neutral-700 rounded-full bg-[#080808] justify-center items-center overflow-hidden"
        >
          <Ionicons name="settings-sharp" size={24} color="white" />
        </Pressable>
      </View>
      <View className="flex-1 bg-[#1c1d22] px-5">
        <View className="absolute h-28 w-28 justify-center items-center rounded-full bg-[rgba(59,165,91,255)] border-8 border-[#1c1d22] -translate-y-1/2 left-5">
          <View className="w-full h-full justify-center items-center">
            {!!profile?.imageUrl ? (
              <Image
                source={{ uri: profile?.imageUrl }}
                className="h-full w-full object-contain rounded-full"
              />
            ) : (
              <FontAwesome5 name="discord" size={50} color="white" />
            )}
            <View
              className={twMerge(
                "h-7 w-7 rounded-full absolute border-[4px] border-[#1c1d22] bottom-1 right-1",
                online ? "bg-[rgba(59,165,91,255)]" : "bg-slate-500"
              )}
            />
          </View>
        </View>

        <View className="p-5 bg-[#27272f] w-full rounded-3xl mt-20 mb-6">
          <View className="gap-1 flex-row items-center">
            <Text className="text-3xl text-white font-bold">
              {profile?.name}
            </Text>
            <AntDesign name="down" size={16} color="white" />
          </View>
          <Text className="text-white text-base mb-5">thanhloi019</Text>
          <View className="flex-row gap-6 items-center">
            <Pressable className="flex-1 px-4 py-3 bg-[#373a43] rounded-full flex-row items-center gap-2">
              <MaterialCommunityIcons name="chat" size={24} color="white" />
              <Text
                numberOfLines={1}
                className="flex-1 text-sm font-bold text-white"
              >
                Thêm trạng thái của bạn
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.navigate("/profile/edit-profile")}
              className="flex-1 px-4 py-3 bg-[#373a43] rounded-full flex-row items-center gap-2"
            >
              <MaterialCommunityIcons
                name="pencil-remove"
                size={24}
                color="white"
              />
              <Text
                numberOfLines={1}
                className="flex-1 text-sm font-bold text-white"
              >
                Sửa Hồ sơ
              </Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={async () => {
            await sendPushNotification(token, "test", "tôi đang test thử", {
              url: "/server/",
            });
          }}
          className="p-5 bg-[#27272f] w-full rounded-3xl mb-6"
        >
          <Text className="text-grayColor text-base font-semibold">
            Gia Nhập Discord Từ:
          </Text>
          <Text className="text-lg text-grayColor">
            {moment(profile?.createdAt, "YYYY-MM-DD").format(
              "DD [thg] M, YYYY"
            )}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.navigate("/(screen)/profile/list-friend")}
          className="p-5 bg-[#27272f] flex-row justify-between items-center w-full rounded-3xl mb-6"
        >
          <Text className="text-grayColor text-base font-semibold">Bạn Bè</Text>
          <View className="flex-row gap-3 items-center">
            <Image
              source={{ uri: friends[0]?.friend?.imageUrl }}
              className="w-8 h-8 rounded-full object-contain"
            />
            <AntDesign name="right" size={16} color="white" />
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
