import { View, Text, Modal, Pressable, Animated, Easing } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

import React, { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import { dB_to_mappedValue, getDurationFormatted } from "../../utils/util";
import { uploadFile } from "../../utils/upload";
import { Member, Message, MessageType } from "../../types/type";
import "react-native-get-random-values";
import { v4 } from "uuid";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/src/core/config";

const RecordModal = ({
  isVisible,
  setIsVisible,
  serverId,
  channelId,
  member,
}: {
  isVisible: boolean;
  setIsVisible: any;
  serverId?: string | null;
  channelId?: string;
  member?: Member | null;
}) => {
  const [recordTime, setRecordTime] = useState(0);
  const [recording, setRecording] = useState<any>();
  const intervalRef = useRef<any>();
  const [metering, setMetering] = useState<number | undefined>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [animatedSize] = useState(new Animated.Value(1000));
  const [heights, setHeight] = useState<number[]>([3]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRecordTime((prevTime) => prevTime + 1000);
    }, 1000);

    const onStartRecord = async () => {
      try {
        if (permissionResponse?.status !== "granted") {
          console.log("Requesting permission..");
          await requestPermission();
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        console.log("Starting recording..");

        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY,
          (status) => {
            setMetering(status.metering);
          },
          200
        );

        setRecording(recording);

        console.log("Recording started");
      } catch (err) {
        console.error("Failed to start recording", err);
      }
    };

    onStartRecord();
  }, []);

  useEffect(() => {
    const updateViewSize = () => {
      let newSize;
      let height;
      if (metering === undefined) {
        newSize = 1000;
        height = 3;
      } else {
        newSize = 1000 + (160 + metering) / 4;
        height = dB_to_mappedValue(metering);
      }
      setHeight([...heights, height]);
      Animated.timing(animatedSize, {
        toValue: newSize,
        duration: 200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }).start();
    };

    updateViewSize();
  }, [metering]);

  const onStopRecord = async () => {
    setRecordTime(0);
    clearInterval(intervalRef.current);
    setRecording(undefined);
    await recording.stopAndUnloadAsync();

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    const duration = recording._finalDurationMillis;

    await upLoadRecored(uri, duration);
  };

  const upLoadRecored = async (uri: any, duration: any) => {
    if (!uri || !channelId || !serverId || !member) return;
    try {
      setIsVisible((prev: boolean) => !prev);
      const result = await uploadFile({
        url: uri,
        type: MessageType.RECORD,
        size: duration,
      });
      const message: Message = {
        id: v4(),
        channelId: channelId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deleted: false,
        fileUrls: [result],
        member: member,
        memberId: member.id,
      };

      const messagesCollectionRef = collection(
        db,
        `servers/${serverId}/channels/${channelId}/messages`
      );
      await addDoc(messagesCollectionRef, message);
    } catch (error) {
      console.log("Cannot upload a record file!", error);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View className="flex-1 bg-inherit">
        <Animated.View
          style={{
            height: animatedSize,
            width: animatedSize,
          }}
          className="absolute bottom-[-112%] left-[-90.5%]  bg-[#5865f2bb] rounded-full"
        ></Animated.View>
        <Animated.View
          style={{
            height: animatedSize,
            width: animatedSize,
          }}
          className="absolute bottom-[-115%] bg-[#5865f2] left-[-90.5%] rounded-full"
        ></Animated.View>
        <View className="z-30 absolute bottom-3 right-0 left-0 px-4 flex-row gap-3 items-center">
          <Pressable
            onPress={async () => {
              setRecordTime(0);
              clearInterval(intervalRef.current);
              setRecording(undefined);
              await recording.stopAndUnloadAsync();
              setRecording(null);
              setIsVisible((prev: boolean) => !prev);
            }}
            className="h-14 w-14 justify-center items-center rounded-full bg-[#3b45a6]"
          >
            <MaterialCommunityIcons name="trash-can" size={30} color="white" />
          </Pressable>
          <Pressable className="flex-1 rounded-full bg-[#3d44a6] px-6 py-4 flex-row gap-2 items-center">
            <View className="h-2 w-2 rounded-full bg-[#eb3f43]" />
            <Text className="text-sm text-white font-semibold">
              {getDurationFormatted(recordTime)}
            </Text>
            <ScrollView
              contentContainerStyle={{
                borderRadius: 9999,
                overflow: "hidden",
                flexDirection: "row",
                flexWrap: "nowrap",
                flexGrow: 1,
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 4,
              }}
              showsHorizontalScrollIndicator={false}
              invertStickyHeaders
            >
              {heights.map((height, id) => (
                <View
                  key={id}
                  style={{ height: height }}
                  className="w-[3px] rounded-full bg-[white]"
                />
              ))}
            </ScrollView>
          </Pressable>

          <Pressable
            onPress={async () => {
              {
                await onStopRecord();
                setRecording(null);
              }
            }}
            className="h-14 w-14 justify-center items-center rounded-full bg-[white]"
          >
            <MaterialCommunityIcons name="send" size={30} color="#4d4f5c" />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default RecordModal;
