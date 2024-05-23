import { View, Text, Pressable } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { getDurationFormatted } from "../utils/util";
import { Audio } from "expo-av";
import { FontAwesome6 } from "@expo/vector-icons";
// import Slider from "@react-native-community/slider";
import { colors } from "../libs/color";
import { twMerge } from "tailwind-merge";
const PlayAudio = ({ url, duration }: { url: string; duration?: number }) => {
  const [currentSound, setCurentSound] = useState<Audio.Sound>();
  const [value, setValue] = useState<number>(0);
  const [isPlaying, setIsPlay] = useState(false);
  const [audioTime, setAudioTime] = useState(duration);
  const intervalRef = useRef<any>();
  async function playSound() {
    setIsPlay(true);
    const { sound, status } = await Audio.Sound.createAsync(
      { uri: url },
      {
        positionMillis: 0,
        progressUpdateIntervalMillis: 1000,
      },
      (status) => {
        if (!!status.positionMillis) {
          setAudioTime(duration - status.positionMillis);
        }
        if (status.didJustFinish === true) {
          setIsPlay(false);
          setAudioTime(duration);
          setCurentSound(undefined);
        }
      }
    );

    await sound.replayAsync();
    setCurentSound(sound);
  }

  useEffect(() => {
    return currentSound
      ? () => {
          currentSound.unloadAsync();
        }
      : undefined;
  }, [currentSound]);

  const playAtValue = async () => {
    try {
      await currentSound?.setPositionAsync(value);
    } catch (error) {
      console.log(error);
    }
  };

  const pauseAudio = async () => {
    setIsPlay(false);
    await currentSound?.pauseAsync();
  };
  return (
    <View
      className={twMerge(
        "h-14 w-2/3 rounded-full flex-row gap-2 items-center overflow-hidden pl-2 py-2 pr-4",
        isPlaying ? "bg-[#4e47e3]" : "bg-[#27272f]"
      )}
    >
      <Pressable
        onPress={!!isPlaying ? pauseAudio : playSound}
        className="h-12 w-12 rounded-full justify-center items-center bg-[#4e47e3]"
      >
        <View>
          {!!isPlaying ? (
            <Entypo name="controller-paus" size={20} color="white" />
          ) : (
            <FontAwesome5 name="play" size={18} color="white" />
          )}
        </View>
      </Pressable>
      <View className="flex-1"></View>
      <Text className="text-sm text-white font-semibold">
        {getDurationFormatted(audioTime)}
      </Text>
    </View>
  );
};

export default PlayAudio;
