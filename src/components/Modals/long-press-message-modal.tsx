import { forwardRef, useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Image,
  ToastAndroid,
} from "react-native";
import {
  AntDesign,
  Entypo,
  Feather,
  Ionicons,
  Octicons,
} from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { colors } from "../../libs/color";

import { useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";

const LongPressMessageModal = forwardRef<BottomSheetModal>((props, ref) => {
  // @ts-ignore
  const { message } = props;

  const snapPoints = useMemo(() => ["50%", "85%"], []);
  const router = useRouter();
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

  const copyToClipboard = async () => {
    if (!message?.content) {
      showToast("Không thể sao chép tin nhắn này!");
    } else {
      await Clipboard.setStringAsync(message?.content ?? "");
      showToast("Đã sao chép nội dung tin nhắn vào bộ nhớ đệm!");
    }
  };
  const showToast = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

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
        <View className="flex-row items-center mx-5 justify-between mt-3">
          <Pressable className="w-14 h-14 rounded-full justify-center items-center bg-[#2f3239]">
            <Text className="text-3xl">👍</Text>
          </Pressable>
          <Pressable className="w-14 h-14 rounded-full justify-center items-center bg-[#2f3239]">
            <Text className="text-3xl">👎</Text>
          </Pressable>
          <Pressable className="w-14 h-14 rounded-full justify-center items-center bg-[#2f3239]">
            <Text className="text-3xl">🥰</Text>
          </Pressable>
          <Pressable className="w-14 h-14 rounded-full justify-center items-center bg-[#2f3239]">
            <Text className="text-3xl">😢</Text>
          </Pressable>
          <Pressable className="w-14 h-14 rounded-full justify-center items-center bg-[#2f3239]">
            <Text className="text-3xl">😃</Text>
          </Pressable>
          <Pressable className="w-14 h-14 rounded-full justify-center items-center bg-[#2f3239]">
            <Text className="text-3xl">😡</Text>
          </Pressable>
        </View>

        <View className="mx-5 mt-4">
          <View className="rounded-2xl overflow-hidden">
            <Pressable className="flex-row items-center gap-4 bg-[#27272f] py-6 px-3">
              <MaterialIcons name="edit" size={24} color="white" />
              <Text className="text-lg flex-1 text-white font-bold">
                Chỉnh sửa tin nhắn
              </Text>
            </Pressable>
            <Pressable className="flex-row items-center gap-4 bg-[#27272f] py-6 px-3">
              <Entypo name="reply" size={24} color="white" />
              <Text className="text-lg flex-1 text-white font-bold">
                Trả lời
              </Text>
            </Pressable>
            <Pressable className="flex-row  items-center gap-4 bg-[#27272f] py-6 px-3">
              <Feather name="paperclip" size={24} color="white" />
              <Text className="text-lg flex-1 text-white font-bold">
                Tạo chủ đề
              </Text>
            </Pressable>
          </View>
        </View>
        <View className="mx-5 mt-4">
          <View className="rounded-2xl overflow-hidden">
            <Pressable className="flex-row items-center gap-4 bg-[#27272f] py-6 px-3">
              <MaterialIcons name="save-alt" size={24} color="white" />
              <Text className="text-lg flex-1 text-white font-bold">
                Lưu hình ảnh
              </Text>
            </Pressable>
            {!!message?.content && (
              <Pressable
                onPress={copyToClipboard}
                className="flex-row items-center gap-4 bg-[#27272f] py-6 px-3"
              >
                <Ionicons name="copy" size={24} color="white" />
                <Text className="text-lg flex-1 text-white font-bold">
                  Sao chép văn bản
                </Text>
              </Pressable>
            )}
            <Pressable className="flex-row items-center gap-4 bg-[#27272f] py-6 px-3">
              <MaterialCommunityIcons name="pin" size={24} color="white" />
              <Text className="text-lg flex-1 text-white font-bold">
                Ghim tin nhắn
              </Text>
            </Pressable>
            <Pressable className="flex-row  items-center gap-4 bg-[#27272f] py-6 px-3">
              <Octicons name="link" size={24} color="white" />
              <Text className="text-lg flex-1 text-white font-bold">
                Sao chép liên kết
              </Text>
            </Pressable>
          </View>
        </View>
        <View className="mx-5 mt-4">
          <Pressable className="flex-row group active:bg-[#1c1d22] rounded-2xl items-center gap-4 bg-[#27272f] py-6 px-3">
            <Text className="text-lg group-active:text-red-200 flex-1 text-red-400 font-bold">
              Xóa Tin Nhắn
            </Text>
          </Pressable>
        </View>
      </View>
    </BottomSheetModal>
  );
});

export default LongPressMessageModal;
