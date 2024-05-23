import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../../libs/color";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import ListFriends from "../../../components/list-friends";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Friends } from "@/src/types/type";
import useProfileStore from "@/src/store/profileStore";
import { collection, onSnapshot, or, query, where } from "firebase/firestore";
import { db } from "@/src/core/config";

const Messages = () => {
  const router = useRouter();
  const { profile } = useProfileStore();
  const [friends, setFriends] = useState<Friends[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const friendsRef = collection(db, "friends");
    const friendsQuery = query(
      friendsRef,
      or(
        where("memberOneId", "==", profile?.userId),
        where("memberTwoId", "==", profile?.userId)
      )
    );
    const unsubscribe = onSnapshot(
      friendsQuery,
      (snapshot) => {
        const updatedFriends: Friends[] = [];
        snapshot.forEach((doc) => {
          updatedFriends.push(doc.data() as Friends);
        });
        setFriends(updatedFriends);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching friends:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [profile]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.primaryColor,
        paddingHorizontal: 15,
        paddingTop: 10,
      }}
    >
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-white text-xl font-bold">Các Tin Nhắn</Text>
        <Pressable
          onPress={() => router.push("/(screen)/messages/add-friends")}
          className="gap-2 flex-row py-2 px-3 bg-[#26262e] items-center rounded-full"
        >
          <MaterialIcons
            name="person-add-alt-1"
            size={24}
            color={colors.grayColor}
          />
          <Text className="text-base text-grayColor font-semibold">
            Thêm Bạn Bè
          </Text>
        </Pressable>
      </View>
      <View className="flex-row gap-4 items-center px-3 py-2 rounded-full bg-[#111216] h-18">
        <Feather name="search" size={20} color={colors.grayColor} />
        <TextInput
          placeholder="Tìm kiếm"
          placeholderTextColor={colors.grayColor}
          className="flex-1 text-white text-base font-semibold"
        />
      </View>
      {loading ? (
        <ActivityIndicator size={"large"} color={colors.primaryButton} />
      ) : (
        <ListFriends friends={friends} userId={profile?.userId} />
      )}
      <View className="absolute z-30 bottom-[80px] right-5 h-20 w-20 bg-primaryButton rounded-full justify-center items-center">
        <MaterialCommunityIcons name="chat-plus" size={35} color="white" />
      </View>
    </SafeAreaView>
  );
};

export default Messages;
