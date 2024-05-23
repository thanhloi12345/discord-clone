import { forwardRef, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { colors } from "../../libs/color";

import { Asset } from "expo-asset";
import EmojiPicker from "rn-emoji-picker";
import { emojis } from "rn-emoji-picker/dist/data";
import { ScrollView } from "react-native-gesture-handler";

const EmojiPickerModal = forwardRef<BottomSheetModal>((props, ref) => {
  const snapPoints = useMemo(() => ["45%", "60%", "80%"], []);
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
  const { emoji, setEmoji, select } = props;
  return (
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
      <View className="flex-1 mx-5 gap-4">
        <View className="flex-row gap-1 p-1 bg-[#111216] rounded-full">
          <Pressable className="bg-[#32323c] p-3 flex-1 rounded-full items-center justify-center">
            <Text className="text-lg text-white font-semibold">Emoji</Text>
          </Pressable>
          <Pressable className="flex-1 p-3 rounded-full items-center justify-center">
            <Text className="text-lg text-grayColor font-semibold">
              Ảnh Động
            </Text>
          </Pressable>
          <Pressable className="flex-1 p-3 rounded-full items-center justify-center">
            <Text className="text-lg text-grayColor font-semibold">
              Sticker
            </Text>
          </Pressable>
        </View>

        <View className="flex-1">
          <EmojiPicker
            emojis={emojis} // emojis data source see data/emojis
            recent={emoji} // store of recently used emojis
            autoFocus={false} // autofocus search input
            loading={false} // spinner for if your emoji data or recent store is async
            darkMode={true} // to be or not to be, that is the question
            perLine={7} // # of emoji's per line
            onSelect={(emoji) => {
              select((prev: any) => (prev += emoji.emoji));
            }} // callback when user selects emoji - returns emoji obj
            onChangeRecent={setEmoji} // callback to update recent storage - arr of emoji objs
            backgroundColor={colors.primaryColor} // optional custom bg color
            enabledCategories={[
              // optional list of enabled category keys
              "recent",
              "emotion",
              "emojis",
              "activities",
              "flags",
              "food",
              "places",
              "nature",
            ]}
            defaultCategory={"food"} // optional default category key
          />
        </View>
      </View>
    </BottomSheetModal>
  );
});

export default EmojiPickerModal;
