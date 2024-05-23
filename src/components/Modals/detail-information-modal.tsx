import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, Text, Pressable, Image, ToastAndroid } from "react-native";
import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  Fontisto,
} from "@expo/vector-icons";

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { colors } from "../../libs/color";
import { useRouter } from "expo-router";
import moment from "moment";
import { twMerge } from "tailwind-merge";
import { dbRealTime } from "@/src/core/config";
import { off, onValue, ref } from "firebase/database";

const DetailInformationModal = forwardRef<BottomSheetModal>(
  (props, refferent) => {
    // @ts-ignore
    const { information } = props;
    const [online, setOnline] = useState(false);
    const snapPoints = useMemo(() => ["68%"], []);
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

    useEffect(() => {
      const dbRef = ref(dbRealTime, `profiles/${information?.userId}`);
      const fetchData = () => {
        onValue(dbRef, (snapshot) => {
          if (snapshot.exists()) {
            const { isOnline } = snapshot.val() as { isOnline: boolean };
            setOnline(isOnline);
          } else {
            setOnline(false);
          }
        });
      };
      fetchData();
      return () => {
        off(dbRef);
      };
    }, []);

    return (
      <BottomSheetModal
        name="bottomSheetModal"
        ref={refferent}
        index={0} // Initial position: open (modify if needed)
        snapPoints={snapPoints}
        handleIndicatorStyle={{
          backgroundColor: colors.grayColor,
        }}
        backgroundStyle={{
          backgroundColor: information?.favoriteColor
            ? information?.favoriteColor
            : "black",
        }}
        backdropComponent={renderBackDrop}
      >
        <View className="flex-1 bg-primaryBg">
          <View
            style={{
              backgroundColor: information?.favoriteColor
                ? information?.favoriteColor
                : "black",
            }}
            className={twMerge(`h-48 items-end px-3 pt-3`)}
          >
            <Pressable className="w-10 h-10 rounded-full bg-[#697277] items-center justify-center">
              <Entypo name="dots-three-horizontal" size={24} color="white" />
            </Pressable>
            <View className="absolute h-28 w-28 items-center justify-center -bottom-14 rounded-full border-8 border-primaryBg left-5">
              <Image
                source={{ uri: information?.imageUrl }}
                className="w-full h-full rounded-full object-contain"
              />
              <View
                className={twMerge(
                  "absolute w-8 h-8 rounded-full bg-green-600 border-2 border-primaryBg -right-1 -bottom-1",
                  online ? "bg-green-600" : "bg-slate-600"
                )}
              ></View>
            </View>
          </View>
          <View className="mt-16 mx-5 rounded-xl bg-[#16151a] px-5 py-5">
            <Text className="text-white text-2xl font-semibold">
              {information?.name}
            </Text>
            <Text className="text-white text-sm font-semibold mb-10">
              {information?.email}
            </Text>
            <View className="flex-row items-center justify-between">
              <Pressable className="items-center gap-2">
                <Fontisto name="messenger" size={24} color="white" />
                <Text className="text-white text-sm font-semibold">
                  Tin Nhắn
                </Text>
              </Pressable>
              <Pressable className="items-center gap-2">
                <FontAwesome5 name="phone-alt" size={24} color="white" />
                <Text className="text-white text-sm font-semibold">
                  Cuộc Gọi Thoại
                </Text>
              </Pressable>
              <Pressable className="items-center gap-2">
                <FontAwesome name="video-camera" size={24} color="white" />
                <Text className="text-white text-sm font-semibold">
                  Cuôc Gọi Video
                </Text>
              </Pressable>
            </View>
          </View>
          <View className="mt-6 mx-5 rounded-xl bg-[#16151a] px-5 py-5">
            <Text className="text-white text-base font-semibold">
              GIA NHẬP DIDCORD TỪ
            </Text>
            <Text className="text-lg text-grayColor">
              {moment(information?.createdAt, "YYYY-MM-DD").format(
                "DD [thg] M, YYYY"
              )}
            </Text>
          </View>
        </View>
      </BottomSheetModal>
    );
  }
);
export default DetailInformationModal;
