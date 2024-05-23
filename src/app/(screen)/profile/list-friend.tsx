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

import React, { useRef, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  Feather,
  FontAwesome5,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { twMerge } from "tailwind-merge";
import { TextInput } from "react-native-gesture-handler";
import { colors } from "@/src/libs/color";
import useFriendStore from "@/src/store/friend-store";
import useCurrentFriendStore from "@/src/store/create-current-friend-store";
import DetailInformationModal from "@/src/components/Modals/detail-information-modal";
import BottomSheet from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ExtendedProfile } from "@/src/api/friends";

const RenderFriendItem = ({ item }: { item: ExtendedProfile | undefined }) => {
  const detailInformationRef = useRef<BottomSheetModal>(null);
  const router = useRouter();
  const { setCurrentFriend } = useCurrentFriendStore();

  const onStartAConversation = () => {
    setCurrentFriend(item?.friend ?? null);
    router.push({
      pathname: "/messages/chat",
      params: {
        messageId: item?.conversationId ?? "",
      },
    });
  };
  return (
    <>
      <Pressable
        onPress={() => detailInformationRef.current?.present()}
        className="bg-[#27272f] rounded-3xl px-4 py-4 flex-row gap-3 items-center"
      >
        <Image
          source={{ uri: item?.friend?.imageUrl }}
          className="h-12 w-12 object-contain rounded-full"
        />
        <Text
          numberOfLines={1}
          className="text-white text-lg font-semibold flex-1"
        >
          {item?.friend?.name}
        </Text>
        <View className="flex-row gap-2 items-center">
          <Pressable className="w-12 h-12 justify-center items-center">
            <FontAwesome6 name="phone-volume" size={18} color="white" />
          </Pressable>
          <Pressable
            onPress={onStartAConversation}
            className="w-12 h-12 justify-center items-center"
          >
            <MaterialCommunityIcons
              name="message-reply"
              size={18}
              color="white"
            />
          </Pressable>
        </View>
      </Pressable>
      <DetailInformationModal
        ref={detailInformationRef}
        information={item?.friend}
      />
    </>
  );
};
const ListFriend = () => {
  const router = useRouter();
  const { friends } = useFriendStore();
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View className="flex-1 bg-primaryBg pt-3">
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Bạn Bè",
            headerTitleAlign: "center",
            contentStyle: {
              alignContent: "center",
            },
            headerLeft: () => {
              return (
                <View className="flex-row gap-4 items-center">
                  <Feather name="arrow-left" size={24} color="#838592" />
                </View>
              );
            },
            headerRight: () => {
              return (
                <Pressable
                  onPress={() =>
                    router.push("/(screen)/messages/add-friend-by-name")
                  }
                  className="items-center justify-center rounded-full bg-inherit"
                >
                  <Text
                    numberOfLines={1}
                    className={twMerge(
                      "text-lg font-semibold",
                      false ? "text-red-500" : "text-[#656c9f]"
                    )}
                  >
                    Thêm Bạn Bè
                  </Text>
                </Pressable>
              );
            },
            headerStyle: { backgroundColor: "#1c1d22" },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "400",
              fontSize: 15,
            },
            headerShadowVisible: false,
          }}
        />
        <View className="rounded-3xl bg-[#111216] gap-4 px-5 py-3 mx-5 items-center flex-row mb-6">
          <Feather name="search" size={20} color="white" />
          <TextInput
            className="flex-1 text-white text-sm font-semibold"
            numberOfLines={1}
            placeholder="Tìm Kiếm"
            placeholderTextColor={colors.grayColor}
            selectionColor={colors.grayColor}
          />
        </View>
        <View className="mx-5 flex-1">
          <FlatList
            contentContainerStyle={{
              flexGrow: 1,
              gap: 15,
            }}
            showsVerticalScrollIndicator={false}
            data={friends}
            // keyExtractor={(message) => message.id}
            keyExtractor={(item, index) => String(index)}
            renderItem={({ item }) => {
              return <RenderFriendItem item={item} />;
            }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ListFriend;
