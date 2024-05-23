import { forwardRef, useCallback, useMemo, useRef } from "react";
import { View, Text, TouchableOpacity, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
import { useRouter } from "expo-router";

const EditServerModal = forwardRef<BottomSheetModal>((props, ref) => {
  const snapPoints = useMemo(() => ["50%", "80%"], []);
  const { dismissAll } = useBottomSheetModal();
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

  const router = useRouter();
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
      <View className="flex-1">
        <View className="mx-5">
          <Image
            source={require("../../../assets/images/image-banner.png")}
            className="h-16 w-16 rounded-[10px] mb-6"
          />
          <Text className="font-bold text-white text-2xl mb-5">
            Máy chủ của Thành lợi
          </Text>
          <View className="flex-row gap-4 items-center mb-5">
            <View className="flex-row gap-1 items-center">
              <View className="h-2 w-2 rounded-full bg-[#23a857]" />
              <Text className="text-sm text-grayColor">1 Trực tuyến</Text>
            </View>
            <View className="flex-row gap-1 items-center">
              <View className="h-2 w-2  rounded-full bg-grayColor" />
              <Text className="text-sm text-grayColor">1 thành viên</Text>
            </View>
          </View>
        </View>
        <View className="w-full border-[0.2px] border-grayColor" />
        <View className="mx-5 py-5 h-24 justify-between items-center flex-row">
          <View className="items-center h-full justify-between">
            <MaterialCommunityIcons
              name="language-ruby"
              size={24}
              color="#ff70f9"
            />
            <Text className="text-base text-grayColor">Nâng Cấp</Text>
          </View>
          <View className="items-center h-full justify-between">
            <MaterialIcons
              name="person-add-alt-1"
              size={24}
              color={colors.grayColor}
            />
            <Text className="text-base text-grayColor">Lời mời</Text>
          </View>
          <View className="items-center h-full justify-between">
            <MaterialCommunityIcons
              name="language-ruby"
              size={24}
              color={colors.grayColor}
            />
            <Text className="text-base text-grayColor">Các Thông Báo</Text>
          </View>
          <Pressable
            onPress={() => {
              router.push({ pathname: "/server/setting-server" });
              dismissAll();
            }}
            className="items-center h-full justify-between"
          >
            <Ionicons
              name="settings-sharp"
              size={24}
              color={colors.grayColor}
            />
            <Text className="text-base text-grayColor">Cài đặt</Text>
          </Pressable>
        </View>
        <View className="mx-5 gap-5">
          <OptionButton title="Đánh dấu đã đọc" />
          <MutipleOptions
            options={[
              {
                title: "Tạo kênh",
                onPress: () => {
                  router.push("/server/channel/create-channel");
                  dismissAll();
                },
              },
              {
                title: "Chỉnh sửa Máy Chủ",
              },
            ]}
          />
          <OptionButton title="Báo cáo máy chủ" color="#e88487" />
        </View>
      </View>
    </BottomSheetModal>
  );
});

export default EditServerModal;
