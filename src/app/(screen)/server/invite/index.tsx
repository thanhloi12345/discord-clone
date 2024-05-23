import {
  View,
  Text,
  Modal,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import useJoinInviteServer from "../../../../hooks/useAcceptInvite";
import { Entypo } from "@expo/vector-icons";
import { colors } from "@/src/libs/color";
const Invite = () => {
  const { serverId, secretKey } = useLocalSearchParams<{
    serverId: string;
    secretKey: string;
  }>();
  const {
    serverStatus,
    error,
    loading,
    invitationExpired,
    acceptInvite,
    server,
    count,
  } = useJoinInviteServer(serverId, secretKey);

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onAcceptInvite = async () => {
    setIsLoading(true);
    try {
      await acceptInvite();
      router.replace({
        pathname: "/(screen)/server/",
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  if (loading)
    return (
      <View className="flex-1 bg-primaryBg items-center justify-center">
        <ActivityIndicator size={"large"} color={"#5165f4"} />
      </View>
    );

  if (error || invitationExpired)
    return (
      <View className="flex-1 bg-primaryBg items-center justify-center">
        <Image
          source={require("../../../../../assets/images/image-server.png")}
          className="object-cover w-full h-72 rounded-full"
          blurRadius={5}
        />
        <Modal
          transparent
          statusBarTranslucent
          animationType="fade"
          visible
          style={{}}
        >
          <View className="items-center justify-center flex-1 px-5">
            <View className="px-5 pt-7 w-full items-center bg-[#323439] rounded-2xl">
              <View className="rounded-full h-28 w-28 items-center justify-center bg-neutral-900 mb-4">
                <Entypo name="link" size={40} color={colors.grayColor} />
              </View>
              <Text className="text-2xl text-white font-semibold mb-3 text-center">
                {error}
              </Text>
              <Text className="text-sm text-grayColor font-semibold mb-6">
                Hãy sử dụng một liên kết khách để tham gia máy chủ này.
              </Text>
              <Pressable
                onPress={() =>
                  router.replace({
                    pathname: "/(screen)/server/",
                  })
                }
                className="w-full py-3 justify-center items-center bg-[#5165f4] rounded-md  mb-6"
              >
                <Text className="text-base text-white font-semibold">
                  Đã rõ
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    );

  if (serverStatus)
    return (
      <View className="flex-1 bg-primaryBg items-center justify-center">
        <Image
          source={require("../../../../../assets/images/image-banner.png")}
          blurRadius={10}
          className="object-cover w-full h-72"
        />

        <Modal
          transparent
          statusBarTranslucent
          animationType="fade"
          visible
          style={{}}
        >
          <View className="items-center justify-center flex-1 px-5">
            <View className="px-5 pt-10 w-full items-center bg-[#323439] rounded-2xl">
              <Image
                source={{ uri: server?.imageUrl }}
                className="object-contain h-20 w-20 rounded-2xl mb-9"
              />
              <Text className="text-base text-grayColor font-semibold mb-3">
                You've been invited to join
              </Text>
              <Text className="text-2xl font-semibold text-white mb-2">
                {server?.name}
              </Text>
              <View className="flex-row items-center gap-4 mb-5">
                <View className="flex-row gap-1 items-center">
                  <View className="h-2 w-2 rounded-full bg-[#27c93f]" />
                  <Text className="text-sm font-semibold text-grayColor">
                    616 online
                  </Text>
                </View>
                <View className="flex-row gap-1 items-center">
                  <View className="h-2 w-2 rounded-full bg-[#85878c]" />
                  <Text className="text-sm font-semibold text-grayColor">
                    {count} Members
                  </Text>
                </View>
              </View>
              <Pressable
                disabled={isLoading}
                onPress={async () => await onAcceptInvite()}
                className="w-full py-3 justify-center items-center bg-[#5165f4] rounded-md mb-2"
              >
                <Text className="text-base text-white font-semibold">
                  Accept Invite
                </Text>
                {isLoading && (
                  <ActivityIndicator
                    size={20}
                    color={"white"}
                    className="absolute right-7"
                  />
                )}
              </Pressable>
              <Pressable
                disabled={isLoading}
                onPress={() =>
                  router.replace({
                    pathname: "/(screen)/server/",
                  })
                }
                className="w-full py-3 justify-center items-center rounded-lg mb-5"
              >
                <Text className="text-base text-white font-semibold">
                  Nerver Mind
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    );

  return null;
};

export default Invite;
