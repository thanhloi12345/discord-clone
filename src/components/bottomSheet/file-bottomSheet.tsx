import { View, Text, Pressable } from "react-native";
import React, { useMemo } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { colors } from "../../libs/color";
import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

interface FileBottomSheetProps {
  onOnpenImagePicker?: () => Promise<void>;
  onCameaPicker?: () => Promise<void>;
  onPickPDF?: () => Promise<void>;
}
const FileBottomSheet = ({
  onOnpenImagePicker,
  onCameaPicker,
  onPickPDF,
}: FileBottomSheetProps) => {
  const snapPoints = useMemo(() => ["100%"], []);
  return (
    <BottomSheet
      index={0}
      snapPoints={snapPoints}
      handleIndicatorStyle={{
        backgroundColor: "white",
      }}
      backgroundStyle={{
        backgroundColor: colors.primaryColor,
      }}
    >
      <View className="flex-1 mx-5 gap-4 mb-4">
        <View className="flex-row gap-3 items-center">
          <Pressable className="py-3 flex-1 px-5 rounded-full bg-[#373a43] flex-row items-center">
            <FontAwesome5 name="table" size={20} color={colors.grayColor} />
            <View className="flex-1 justify-center items-center">
              <Text
                numberOfLines={1}
                className="text-lg text-grayColor font-semibold"
              >
                Bảng Tạo Khảo Sát
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={onPickPDF}
            className="py-3 flex-1 px-4 rounded-full bg-[#373a43] flex-row items-center"
          >
            <Feather name="paperclip" size={20} color={colors.grayColor} />
            <View className="flex-1 justify-center items-center">
              <Text
                numberOfLines={1}
                className="text-lg text-grayColor font-semibold"
              >
                Tệp Tin
              </Text>
            </View>
          </Pressable>
        </View>
        <View className="flex-1 flex-row gap-2 rounded-2xl overflow-hidden ">
          <Pressable
            onPress={onCameaPicker}
            className="flex-1 items-center justify-center bg-[#26262e]"
          >
            <Entypo name="camera" size={30} color={colors.grayColor} />
          </Pressable>
          <Pressable
            onPress={onOnpenImagePicker}
            className="flex-1 items-center justify-center bg-[#26262e]"
          >
            <Entypo name="images" size={30} color={colors.grayColor} />
          </Pressable>
        </View>
      </View>
    </BottomSheet>
  );
};

export default FileBottomSheet;
