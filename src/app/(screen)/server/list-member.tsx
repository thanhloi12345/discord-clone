import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { AntDesign, Entypo } from "@expo/vector-icons";

import { colors } from "@/src/libs/color";
import { TextInput } from "react-native-gesture-handler";
import { useLoadServerById } from "@/src/hooks/useLoadServers";
import { Member, Profile, Server } from "@/src/types/type";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/src/core/config";
import useProfileStore from "@/src/store/profileStore";
import DeleteMemberModal from "@/src/components/Modals/delete-member-from-a-server";

const MemberItem = ({ item }: { item: Member }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { profile: isMyProfile } = useProfileStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  useEffect(() => {
    const getProfileByMember = async () => {
      const profileId = item.profileId ?? "";
      const profileRef = doc(db, "profiles", profileId);
      const profileSnapshot = await getDoc(profileRef);
      const profileData = profileSnapshot.data() as Profile;
      setProfile(profileData);
    };
    getProfileByMember();
  }, []);
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  if (!profile) return null;
  return (
    <Pressable
      onPress={
        isMyProfile?.userId !== profile.userId
          ? handleOpenModal
          : () => console.log("Cant delelte")
      }
      className="bg-[#27272f] px-4 py-4 flex-row items-center gap-3"
    >
      <Image
        source={{ uri: profile?.imageUrl }}
        className="w-16 h-16 rounded-full object-contain"
      />
      <View className="flex-1">
        <Text numberOfLines={1} className="text-white text-lg font-bold -mb-1">
          {profile?.name}
        </Text>
        <Text numberOfLines={1} className="text-white text-base font-semibold">
          {profile?.email}
        </Text>
      </View>
      <AntDesign name="right" size={20} color={"white"} />
      <DeleteMemberModal
        isVisible={isModalVisible}
        member={item}
        profile={profile}
        onClose={handleCloseModal}
      />
    </Pressable>
  );
};
const ListMember = () => {
  const { server } = useLoadServerById();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View className="flex-1 bg-primaryBg border-t-[0.2px] border-t-grayColor">
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Thành Viên",
            headerTitleAlign: "center",
            contentStyle: {
              alignContent: "center",
            },
            headerLeft: () => {
              return (
                <View className="flex-row gap-4 items-center">
                  <AntDesign name="arrowleft" size={24} color="white" />
                </View>
              );
            },
            headerRight: () => (
              <Pressable className="w-10 h-10 items-center justify-center rounded-full bg-inherit">
                <Entypo name="dots-three-horizontal" size={24} color="white" />
              </Pressable>
            ),
            headerStyle: { backgroundColor: "#1c1d22" },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerShadowVisible: false,
          }}
        />
        <View className="py-4 px-5 border-b-[0.2px] border-b-grayColor">
          <View className="flex-row w-full items-center gap-3 px-5 py-4 rounded-3xl bg-[#14151a]">
            <AntDesign name="search1" size={24} color={colors.grayColor} />
            <TextInput
              className="flex-1 text-white text-base font-semibold"
              placeholder="Tìm kiếm"
              placeholderTextColor={colors.grayColor}
            />
          </View>
        </View>
        <View className="flex-1 mt-2">
          <FlatList
            style={{
              flex: 1,
              width: "100%",
            }}
            showsVerticalScrollIndicator={false}
            data={server?.members}
            renderItem={({ item }) => {
              return <MemberItem item={item} />;
            }}
            keyExtractor={(item, id) => String(id)}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 60,
            }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ListMember;
