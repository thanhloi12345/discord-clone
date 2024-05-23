import { View, Text, FlatList, Image, Pressable } from "react-native";
import React from "react";
import moment from "moment";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { colors } from "../libs/color";
import { Friends } from "../types/type";
import { useRouter } from "expo-router";
import useCurrentFriendStore from "../store/create-current-friend-store";

const MessagesFriend = ({
  friend,
  userId,
}: {
  friend: Friends;
  userId: string | undefined;
}) => {
  const { setCurrentFriend } = useCurrentFriendStore();
  const router = useRouter();
  const avatarRemote =
    friend.memberOneId === userId
      ? friend.memberTwo?.imageUrl
      : friend.memberOne?.imageUrl;
  const remoteFriend =
    friend.memberOneId === userId ? friend.memberTwo : friend.memberOne;
  const onStartAConversation = () => {
    setCurrentFriend(remoteFriend ?? null);
    router.push({
      pathname: "/messages/chat",
      params: {
        messageId: friend.id,
      },
    });
  };
  return (
    <Pressable
      onPress={onStartAConversation}
      className="w-full py-2 flex-row gap-3"
    >
      <Image
        source={{ uri: avatarRemote }}
        className="h-14 w-14 rounded-full object-contain"
      />
      {!!friend.lastMessage ? (
        <View className="flex-1 gap-1">
          <Text
            numberOfLines={1}
            className="font-bold text-grayColor text-base"
          >
            <Text className="text-white text-lg font-semibold">Người Gửi:</Text>{" "}
            {friend.lastMessage.member?.name}
          </Text>
          <Text numberOfLines={1} className="text-grayColor text-sm">
            {friend.lastMessage.content ?? "Đã gửi một file"}
          </Text>
        </View>
      ) : (
        <View className="flex-1 gap-2">
          <FontAwesome5 name="hand-peace" size={24} color="white" />
          <Text className="text-sm text-white font-semibold">
            Hãy Nhanh Chóng Bắt Đầu Cuộc Trò Truyện mới
          </Text>
        </View>
      )}
      <Text className="text-sm text-grayColor">
        {moment(friend.lastMessage?.createdAt).fromNow()}
      </Text>
    </Pressable>
  );
};
const ListFriends = ({
  friends,
  userId,
}: {
  friends?: Friends[];
  userId: string | undefined;
}) => {
  return (
    <FlatList
      style={{
        flex: 1,
        width: "100%",
      }}
      showsVerticalScrollIndicator={false}
      data={friends}
      renderItem={({ item }) => (
        <MessagesFriend friend={item} userId={userId} />
      )}
      keyExtractor={(item, index) => String(index)}
      contentContainerStyle={{
        paddingTop: 20,
        gap: 10,
        paddingBottom: 60,
      }}
      ListFooterComponent={
        <View className="w-full flex-row justify-between px-4 items-center">
          <View className="flex-row">
            <Text className="text-grayColor font-bold">Mời Thêm Bạn Vè</Text>
            <Entypo
              name="chevron-small-right"
              size={20}
              color={colors.grayColor}
            />
          </View>
          <View className="flex-row gap-3">
            <Pressable className="h-12 w-12 border border-black rounded-full bg-[#1c1d22] justify-center items-center">
              <Entypo
                name="share-alternative"
                size={18}
                color={colors.grayColor}
              />
            </Pressable>
            <Pressable className="h-12 w-12 border border-black rounded-full bg-[#1c1d22] justify-center items-center">
              <Entypo name="link" size={18} color={colors.grayColor} />
            </Pressable>
          </View>
        </View>
      }
    />
  );
};

export default ListFriends;
