import { forwardRef, useCallback, useMemo } from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { colors } from "../../libs/color";

import OptionButton from "../option-buton";
import MutipleOptions from "../mutiple-options";
import useChannelStore from "../../store/channel-store";
import { useRouter } from "expo-router";

const EditChannelModal = forwardRef<BottomSheetModal>((props, ref) => {
  const snapPoints = useMemo(() => ["50%", "65%"], []);
  const { selectedChannel } = useChannelStore();
  const router = useRouter();
  const { dismiss, dismissAll } = useBottomSheetModal();
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
            // @ts-ignore
            source={{ uri: props?.server?.imageUrl }}
            className="h-14 w-14 rounded-[15px] "
          />
          <Text className="font-bold text-white text-xl">
            {selectedChannel?.name}
          </Text>
        </View>
        <OptionButton
          title="Đánh dấu đã đọc"
          icon={<Entypo name="eye" size={20} color="#c7c8cd" />}
        />

        <MutipleOptions
          options={[
            {
              title: "Chỉnh sửa kênh",
              icon: <MaterialIcons name="settings" size={20} color="#c7c8cd" />,
              onPress: () => {
                router.push({
                  pathname: "/server/channel/edit-channel",
                });
                dismissAll();
              },
            },
            {
              title: "Lời mời",
              icon: <AntDesign name="adduser" size={20} color="#c7c8cd" />,
            },
            {
              title: "Sao chép link",
              icon: <Entypo name="link" size={20} color="#c7c8cd" />,
            },
          ]}
        />
      </View>
    </BottomSheetModal>
  );
});

export default EditChannelModal;
