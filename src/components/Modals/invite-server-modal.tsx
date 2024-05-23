import {
  View,
  Text,
  Pressable,
  Share,
  FlatList,
  Image,
  ToastAndroid,
} from "react-native";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { colors } from "../../libs/color";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";

import "react-native-get-random-values";
import { v4 } from "uuid";

import * as Clipboard from "expo-clipboard";
import useFriendStore from "@/src/store/friend-store";
import { ExtendedProfile, updateLastMessage } from "@/src/api/friends";
import useProfileStore from "@/src/store/profileStore";
import { DirectMessage, Server } from "@/src/types/type";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/src/core/config";
import Toast from "react-native-toast-message";
import { useUserFriends } from "@/src/hooks/useUserFriensd";

const SendAInviteToFriend = ({
  data,
  server,
}: {
  data?: ExtendedProfile;
  server?: Server;
}) => {
  const [isSending, setIsSending] = useState(false);
  const { profile } = useProfileStore();

  const onSendAMessage = async () => {
    setIsSending(true);
    if (!profile || !data.conversationId) {
      Toast.show({
        type: "error",
        text1: `Không thể gửi đi tin nhắn.`,
      });
      setIsSending(false);
      return;
    }
    const content = `myapp://server/invite?serverId=${server.id}&secretKey=${server.inviteCode}`;
    try {
      const message: DirectMessage = {
        id: v4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deleted: false,
        conversationId: data.conversationId,
        content: content,
        member: profile,
        memberId: profile.userId,
      };
      const messagesCollectionRef = collection(
        db,
        `friends/${data.conversationId}/messages`
      );
      await addDoc(messagesCollectionRef, message);
      await updateLastMessage(data.conversationId, message);
      Toast.show({
        type: "success",
        text1: `Bạn đã gửi một lời tham gia Server  ${server.name} đên ${data.friend?.name}.`,
      });
      setIsSending(false);
    } catch (error) {
      setIsSending(false);
      console.log("add message erorr", error);
    }
  };
  return (
    <View className="bg-[#27272f] rounded-3xl px-3 py-4 items-center flex-row gap-2">
      <Image
        source={{ uri: data?.friend?.imageUrl }}
        className="h-12 w-12 rounded-full object-contain"
      />
      <Text numberOfLines={1} className="flex-1 text-base text-white font-bold">
        {data?.friend?.name}
      </Text>
      <Pressable
        disabled={isSending}
        onPress={onSendAMessage}
        className="px-6 py-3 rounded-full items-center bg-[#373a43] justify-center"
      >
        <Text className="text-base text-grayColor font-semibold">Mời</Text>
      </Pressable>
    </View>
  );
};
const InviteServerModal = forwardRef<BottomSheetModal>((props, ref) => {
  const { friends } = useUserFriends();
  const snapPoints = useMemo(() => ["60%", "80%"], []);

  // @ts-ignore

  const { server } = props;

  const copyToClipboard = async () => {
    const message = `myapp://server/invite?serverId=${server.id}&secretKey=${server.inviteCode}`;
    await Clipboard.setStringAsync(message);
    showToast("Đã sao chép nội dung tin nhắn vào bộ nhớ đệm!");
  };
  const showToast = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const share = async () => {
    const message = `myapp://server/invite?serverId=${server.id}&secretKey=${server.inviteCode}`;
    try {
      const result = await Share.share({ message: message });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      ToastAndroid.show("Cannot share a content!", 300);
    }
  };

  const renderBackDrop = useCallback((props: BottomSheetBackdropProps) => {
    return (
      <BottomSheetBackdrop
        {...props}
        opacity={0.5}
        animatedIndex={{ value: 1 }}
        pressBehavior={"close"}
      />
    );
  }, []);

  return (
    <View
      style={{
        zIndex: 150,
      }}
    >
      <BottomSheetModal
        name="bottomSheetModal"
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        handleIndicatorStyle={{
          backgroundColor: "white",
        }}
        backgroundStyle={{
          backgroundColor: colors.primaryColor,
        }}
        backdropComponent={renderBackDrop}
      >
        <View className="flex-1 gap-4">
          <Text className="text-lg text-white font-bold text-center">
            Mời Bạn Bè
          </Text>
          <View className="flex-row mx-5 items-start justify-between">
            <View className="w-16 gap-2 items-center justify-center">
              <Pressable
                onPress={share}
                className="w-14 h-14 items-center justify-center bg-[#373a43] rounded-full"
              >
                <Feather name="upload" size={24} color="white" />
              </Pressable>
              <Text
                numberOfLines={2}
                className="text-sm text-white font-semibold"
              >
                Chia sẻ Lời Mời
              </Text>
            </View>
            <View className="w-16 gap-2 items-center  justify-center">
              <Pressable
                onPress={copyToClipboard}
                className="w-14 h-14 items-center justify-center bg-[#373a43] rounded-full"
              >
                <AntDesign name="link" size={24} color="white" />
              </Pressable>
              <Text
                numberOfLines={2}
                className="text-sm text-white font-semibold"
              >
                Sao Chép Link
              </Text>
            </View>
            <View className="w-16 gap-2   items-center  justify-center">
              <Pressable className="w-14 h-14 items-center justify-center bg-[#373a43] rounded-full">
                <Entypo name="message" size={24} color="white" />
              </Pressable>
              <Text
                numberOfLines={2}
                className="text-sm text-white font-semibold"
              >
                Tin Nhắn
              </Text>
            </View>
            <View className="w-16 gap-2  items-center justify-center">
              <Pressable className="w-14 h-14 items-center justify-center bg-[#373a43] rounded-full">
                <MaterialIcons name="email" size={24} color="white" />
              </Pressable>
              <Text
                numberOfLines={2}
                className="text-sm text-white font-semibold"
              >
                Email
              </Text>
            </View>
          </View>
          <View className="h-[0.5px] w-full bg-neutral-700" />
          <View className="gap-3 mx-5 my-2 ">
            <View className="flex-row gap-4 px-5 py-4 bg-[#111216] rounded-3xl items-center">
              <Feather name="search" size={20} color={colors.grayColor} />
              <TextInput
                placeholder={`Mời bạn vè vào máy chủ của ${server?.name}`}
                placeholderTextColor={colors.grayColor}
                className="text-base flex-1 text-white font-semibold"
                numberOfLines={1}
              />
            </View>
            <FlatList
              style={{
                flexGrow: 1,
                width: "100%",
              }}
              contentContainerStyle={{
                gap: 15,
              }}
              data={friends}
              keyExtractor={(item, index) => String(index)}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <SendAInviteToFriend data={item} server={server} />
              )}
            />
          </View>
        </View>
      </BottomSheetModal>
    </View>
  );
});

export default InviteServerModal;
