import { forwardRef, useCallback, useMemo } from "react";
import { View, Text, Image } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProvider,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { colors } from "../../libs/color";
import OptionButton from "../option-buton";
import MutipleOptions from "../mutiple-options";
import useListServersStore from "@/src/store/create-list-server-store";
import { useRouter } from "expo-router";

const CreateChannelModal = forwardRef<BottomSheetModal>((props, ref) => {
  const { selectedServer } = useListServersStore();
  const router = useRouter();
  const snapPoints = useMemo(() => ["50%", "65%"], []);
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
  const { dismiss } = useBottomSheetModal();
  return (
    <BottomSheetModal
      name="bottomSheetModal"
      ref={ref}
      index={0} // Initial position: open (modify if needed)
      snapPoints={snapPoints}
      handleIndicatorStyle={{
        backgroundColor: "white",
      }}
      backgroundStyle={{
        backgroundColor: colors.primaryColor,
      }}
      backdropComponent={renderBackDrop}
    >
      <View className="flex-1 mx-5 gap-4">
        <View className="flex-row gap-4 items-center">
          <Image
            source={
              selectedServer
                ? { uri: selectedServer.imageUrl }
                : require("../../../assets/images/image-banner.png")
            }
            className="h-14 w-14 rounded-[30px] "
          />
          <Text className="font-bold text-white text-xl">Kênh Chat</Text>
        </View>
        <OptionButton
          title="Đánh dấu đã đọc"
          icon={<Entypo name="eye" size={20} color="#c7c8cd" />}
        />
        <OptionButton
          title="Lời mời"
          icon={<AntDesign name="adduser" size={20} color="#c7c8cd" />}
        />
        <MutipleOptions
          options={[
            {
              title: "Tắt Âm Danh Mục",
              icon: <Ionicons name="volume-mute" size={16} color="#c7c8cd" />,
            },
            {
              title: "Cài Đặt Thông Báo",
              icon: (
                <MaterialCommunityIcons
                  name="message-badge"
                  size={16}
                  color="#c7c8cd"
                />
              ),
            },
          ]}
        />
        <MutipleOptions
          options={[
            {
              title: "Chỉnh Sửa Danh Mục",
              icon: <MaterialIcons name="settings" size={20} color="#c7c8cd" />,
            },
            {
              title: "Tạo Kênh",
              icon: <AntDesign name="plus" size={20} color="#c7c8cd" />,
              onPress: () => {
                router.push("/(screen)/server/channel/create-channel");
                dismiss();
              },
            },
          ]}
        />
      </View>
    </BottomSheetModal>
  );
});

export default CreateChannelModal;
