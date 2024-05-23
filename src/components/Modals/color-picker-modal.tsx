import { forwardRef, useCallback, useMemo, useRef, useState } from "react";
import { View, Pressable, Text, TextInput } from "react-native";

import ColorPicker, { Panel1, HueSlider } from "reanimated-color-picker";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { colors } from "../../libs/color";

const ColorPickerModal = forwardRef<BottomSheetModal>((prop, ref) => {
  const snapPoints = useMemo(() => ["60%", "65%"], []);
  // @ts-ignore
  const { onSetColor, color } = prop;
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
      index={0} // Initial position: open (modify if needed)
      snapPoints={snapPoints}
      handleIndicatorStyle={{
        backgroundColor: "white",
      }}
      ref={ref}
      backgroundStyle={{
        backgroundColor: colors.primaryColor,
      }}
      backdropComponent={renderBackDrop}
    >
      <View className="flex-1 mx-5 gap-4 items-center">
        <View className="flex-row items-center justify-end mb-6">
          <Text className="flex-1 ml-[113px]  font-bold text-white text-lg">
            Chọn một màu
          </Text>
          <Pressable onPress={() => onSetColor(color)}>
            <Text className="text-lg text-primaryButton">Chọn</Text>
          </Pressable>
        </View>
        <View className="w-[85%] items-center">
          <TextInput
            value={color}
            focusable={false}
            className="px-4 py-5 w-full bg-[#32323c] rounded-md text-lg text-grayColor"
          />
        </View>
        <View className="w-[75%] items-center">
          <ColorPicker
            style={{ width: "100%" }}
            value={color}
            onComplete={(colors) => onSetColor(colors.hex)}
          >
            <View className="mb-6 items-center">
              <Panel1
                thumbSize={25}
                style={{
                  width: 250,
                  height: 250,
                  borderWidth: 0,
                }}
              />
            </View>
            <View>
              <HueSlider thumbSize={40} sliderThickness={35} />
            </View>
          </ColorPicker>
        </View>
      </View>
    </BottomSheetModal>
  );
});

export default ColorPickerModal;
