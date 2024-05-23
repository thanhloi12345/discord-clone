import {
  View,
  Text,
  Pressable,
  Image,
  Dimensions,
  Alert,
  Platform,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { ImagePreview } from "react-native-images-preview";
import { ChannelType, MessageType } from "../types/type";
import { AntDesign } from "@expo/vector-icons";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { twMerge } from "tailwind-merge";
import * as Sharing from "expo-sharing";
import { ToastAndroid } from "react-native";
import * as FileSystem from "expo-file-system";

const ImageView = ({ url }: { url: any }) => {
  //const { width, height } = Image.resolveAssetSource({ uri: url });

  const [ratio, setRatio] = useState(16 / 9);
  useEffect(() => {
    Image.getSize(
      url,
      (width, height) => {
        setRatio(width / height);
      },
      (error) => {
        console.log("error:", error);
      }
    );
  }, []);

  const [isOpenImageOptions, setIsOpenImageOptions] = useState(false);

  const _handlePressButtonAsync = async (uri: any) => {
    await WebBrowser.openBrowserAsync(url);
  };

  const share = async () => {
    const fileName = `default-${new Date().toISOString()}.png`;
    const imageUrl = url;
    try {
      const result = await FileSystem.downloadAsync(
        imageUrl,
        FileSystem.documentDirectory + fileName
      );
      await Sharing.shareAsync(result.uri, {
        dialogTitle: "Share a image from discord-clone",
      });
    } catch (error) {
      ToastAndroid.show("Cannot share a content!", 300);
    }
  };

  const handleDownloadImage = async () => {
    const fileName = `default-${new Date().toISOString()}.png`;
    const imageUrl = url;

    const result = await FileSystem.downloadAsync(
      imageUrl,
      FileSystem.documentDirectory + fileName
    );
    if (Platform.OS === "android") {
      const permission =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (permission.granted) {
        const base64 = await FileSystem.readAsStringAsync(result.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await FileSystem.StorageAccessFramework.createFileAsync(
          permission.directoryUri,
          fileName,
          "image/*"
        )
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, {
              encoding: FileSystem.EncodingType.Base64,
            });
          })
          .then(() =>
            ToastAndroid.showWithGravity(
              "Download succesfully!",
              ToastAndroid.BOTTOM,
              1000
            )
          )
          .catch(console.log);
      } else {
        alert("cannot save a image");
      }
    } else {
      alert("Not allow");
    }
  };

  return (
    <View className="rounded-xl border-[3px] border-[#26262e] overflow-hidden">
      <ImagePreview
        imageSource={{ uri: url }}
        imageStyle={{
          width: "100%",
          height: undefined,
          aspectRatio: ratio,
        }}
        renderHeader={(close) => (
          <View className="flex-row px-5 justify-between items-center">
            <Pressable
              onPress={close}
              className="bg-black/75 rounded-full justify-center items-center h-12 w-12"
            >
              <AntDesign name="close" size={16} color={"white"} />
            </Pressable>
            <View className="flex-row gap-3">
              <Pressable className="bg-black/75 flex-row rounded-full  items-center h-12 px-5 gap-4">
                <Text className="text-lg text-white font-semibold">Remind</Text>
                <MaterialCommunityIcons
                  name="pencil-plus"
                  size={16}
                  color="white"
                />
              </Pressable>
              <Pressable
                onPress={() => setIsOpenImageOptions((prev) => !prev)}
                className="bg-black/75 rounded-full justify-center items-center h-12 w-12"
              >
                <Entypo name="dots-three-vertical" size={16} color="white" />
                <View
                  className={twMerge(
                    "absolute w-72 top-11 right-9 rounded-2xl bg-[#2d2d35]",
                    isOpenImageOptions ? "flex" : "hidden"
                  )}
                >
                  <Pressable
                    onPress={async () => await handleDownloadImage()}
                    className="flex-row justify-between items-center px-3 py-3 border-b-[0.5px] border-b-[#26262e]"
                  >
                    <Text className="text-white text-lg font-semibold">
                      Lưu
                    </Text>
                    <MaterialIcons name="save-alt" size={24} color="white" />
                  </Pressable>
                  <Pressable
                    onPress={async () => await share()}
                    className="flex-row justify-between items-center px-3 py-3 border-b-[0.5px] border-b-[#26262e]"
                  >
                    <Text className="text-white text-lg font-semibold">
                      Chia Sẻ
                    </Text>
                    <FontAwesome5 name="share-alt" size={24} color="white" />
                  </Pressable>
                  <Pressable
                    onPress={async () => await _handlePressButtonAsync(url)}
                    className="flex-row justify-between items-center px-3 py-3"
                  >
                    <Text className="text-white text-lg font-semibold">
                      Mở trong trình duyệt
                    </Text>
                    <MaterialIcons
                      name="open-in-browser"
                      size={24}
                      color="white"
                    />
                  </Pressable>
                </View>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
};
export default ImageView;
