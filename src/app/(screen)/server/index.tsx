import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../../libs/color";

import ListServer from "../../../components/servers/list-server";
import { AntDesign } from "@expo/vector-icons";
import GroupChannels from "../../../components/channels/group-channels";

import useServerStore from "../../../store/server-store";
import { useLoadServerById } from "../../../hooks/useLoadServers";
import { ChannelType } from "../../../types/type";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useEffect, useRef } from "react";
import EditChannelModal from "../../../components/Modals/edit-channel-modal";
import JoinConversationMdal from "../../../components/Modals/join-convertsation-modal";
import CreateChannelModal from "../../../components/Modals/create-channel-modal";
import EditServerModal from "../../../components/Modals/edit-server-modal";
import InviteServerModal from "@/src/components/Modals/invite-server-modal";

const Home = () => {
  const { selectedServer, selectServer } = useServerStore();
  const { server } = useLoadServerById();
  const editChannelSheetRef = useRef<BottomSheetModal>(null);
  const createChannelSheetRef = useRef<BottomSheetModal>(null);
  const editServerSheetRef = useRef<BottomSheetModal>(null);
  const inviteServerSheetRef = useRef<BottomSheetModal>(null);

  return (
    <>
      <View className="flex-1 flex-row bg-[#141318]">
        <View
          style={{
            width: wp("20%"),
            height: hp("100%"),
          }}
          className="bg-[#141318] pt-10 items-center"
        >
          <ListServer />
        </View>

        {!!selectedServer ? (
          <View
            style={{
              width: wp("73%"),
              height: hp("100%"),
            }}
            className="mt-10 bg-primaryColor rounded-tl-[32px] rounded-tr-xl"
          >
            <View className="flex-row gap-4 justify-between items-center px-6 mt-6">
              <Text
                numberOfLines={1}
                className="flex-[8] text-white text-xl font-bold"
              >
                {server?.name}
              </Text>
              <Pressable
                onPress={() => editServerSheetRef.current?.present()}
                className="flex-[2] justify-center items-center transition active:bg-white/40 active:rounded-full"
              >
                <Entypo name="dots-three-horizontal" size={16} color="white" />
              </Pressable>
            </View>
            <View
              style={{
                height: hp("6%"),
                width: "100%",
              }}
              className="flex-row gap-2 items-center px-6 mt-6"
            >
              <View className="flex-1 flex-row h-full w-full p-3 bg-[#111216] rounded-full justify-center items-center">
                <View>
                  <Feather name="search" size={20} color="white" />
                </View>
                <TextInput
                  placeholder="Tìm kiếm"
                  className="px-2 flex-1 font-semibold text-base text-white"
                  placeholderTextColor={colors.grayColor}
                />
              </View>
              <TouchableOpacity
                onPress={inviteServerSheetRef.current?.present}
                style={{
                  padding: 12,
                  borderRadius: 9999,
                  backgroundColor: "#26262e",
                }}
              >
                <AntDesign name="adduser" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <View className="px-3 mt-6 flex-1">
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  flexGrow: 1,
                  gap: 24,
                  paddingBottom: 50,
                }}
              >
                <GroupChannels
                  onPresent={editChannelSheetRef.current?.present}
                  name="Kênh chat"
                  channels={server?.channels?.filter(
                    (channel) => channel.type === ChannelType.TEXT
                  )}
                  initial
                  type="text"
                  onLongPress={createChannelSheetRef.current?.present}
                />
                <GroupChannels
                  name="Kênh Đàm thoại"
                  onPresent={editChannelSheetRef.current?.present}
                  channels={server?.channels?.filter(
                    (channel) => channel.type === ChannelType.AUDIO
                  )}
                  initial
                  type="voice"
                  onLongPress={createChannelSheetRef.current?.present}
                />
              </ScrollView>
            </View>
          </View>
        ) : (
          <View className="flex-1 mt-10 bg-primaryBg justify-center items-center">
            <Image
              style={{
                height: hp("30%"),
                width: wp("60%"),
              }}
              className="mb-5"
              source={require("../../../../assets/images/image-server.png")}
            />
            <View className="w-[78%] gap-4">
              <Text className="font-bold text-white text-xl text-center">
                Bạn đã sẵn sàng nâng trò chuyện nhóm lên một tầm cao mới chưa?
              </Text>
              <Text className="font-semibold text-grayColor text-center text-base">
                Xây dựng cộng đồng của bạn với các cuộc trò truyện hiệu quả,
                những buội tụ tập ngẫu hứng và các tính năng tùy chinh mạnh mẽ!
              </Text>
            </View>

            <View className="mt-4 gap-4">
              <TouchableOpacity
                style={{
                  height: hp("6%"),
                  width: wp("70%"),
                  backgroundColor: colors.primaryButton,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 99999,
                }}
                className=""
              >
                <Text className="text-white text-base font-semibold text-center">
                  Tham Gia Máy Chủ
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: hp("6%"),
                  width: wp("70%"),
                  backgroundColor: colors.secondaryBg,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 99999,
                }}
              >
                <Text className="text-white text-base font-semibold text-center">
                  Tạo Máy Chủ Của Bạn
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <StatusBar style="light" backgroundColor="#141318" />
      </View>

      <EditChannelModal ref={editChannelSheetRef} server={server} />
      <CreateChannelModal ref={createChannelSheetRef} />
      <EditServerModal ref={editServerSheetRef} />
      <InviteServerModal ref={inviteServerSheetRef} server={server} />
    </>
  );
};

export default Home;
