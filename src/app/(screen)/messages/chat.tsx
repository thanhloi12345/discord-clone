import {
  View,
  Text,
  Pressable,
  TextInput,
  FlatList,
  Keyboard,
  Image,
  ActivityIndicator,
  Animated,
} from "react-native";

import React, { useEffect, useRef, useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Feather, FontAwesome6 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { DirectMessage, fileType, MessageType } from "../../../types/type";
import * as ImagePicker from "expo-image-picker";
import EmojiPickerModal from "../../../components/Modals/emoji-picker-modal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { colors } from "../../../libs/color";
import FileBottomSheet from "../../../components/bottomSheet/file-bottomSheet";
import { twMerge } from "tailwind-merge";
import { ScrollView } from "react-native-gesture-handler";
import * as DocumentPicker from "expo-document-picker";
import { formatTimeAgo, shortenFileName } from "../../../utils/util";
import useProfileStore from "../../../store/profileStore";
import { Octicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";

import ImageView from "../../../components/image-view";
import bytes from "bytes";
import PDFReader from "../../../components/PDFReader";

import {
  collection,
  DocumentData,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  startAfter,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, dbRealTime } from "../../../core/config";
import "react-native-get-random-values";
import { v4 } from "uuid";
import { uploadMultipleFiles } from "../../../utils/upload";
import PlayAudio from "@/src/provider/play-audio";
import RecordFriendModal from "@/src/components/Modals/record-modal-friend";
import { updateLastMessage } from "@/src/api/friends";
import useCurrentFriendStore from "@/src/store/create-current-friend-store";
import { useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import LongPressMessageModal from "@/src/components/Modals/long-press-message-modal";
import * as Linking from "expo-linking";
import DetailInformationModal from "@/src/components/Modals/detail-information-modal";
import { off, onValue, ref, set } from "firebase/database";
import { sendPushNotification } from "@/src/api/send-notification";
const windowWidth = Dimensions.get("window").width;
const windowHeigh = Dimensions.get("window").height;

const RenderMessage = ({ item }: { item: DirectMessage }) => {
  const [isVisible, setIsVisible] = useState(false);
  const longPressRef = useRef<BottomSheetModal>(null);
  const detailInformationRef = useRef<BottomSheetModal>(null);
  const isMessageContainCustomLink = (message: string) => {
    const customUrlRegex = /myapp:\/\/[^\s]+/;
    return customUrlRegex.test(message);
  };
  const isMessageContainLink = (message: string) => {
    const urlRegex = /(https?|ftp):\/\/[^\s/$.?#].[^\s]*/;
    return urlRegex.test(message);
  };
  return (
    <View>
      <Pressable
        onLongPress={() => longPressRef.current?.present()}
        className="py-5 flex-row gap-3"
      >
        <Pressable
          onPress={() => detailInformationRef.current?.present()}
          className="rounded-full h-12 w-12 overflow-hidden"
        >
          <Image
            source={{ uri: item.member?.imageUrl }}
            className="w-full h-full object-contain"
          />
        </Pressable>
        <View className="flex-1">
          <View className="flex-row gap-2 items-center">
            <Text
              numberOfLines={1}
              className="font-semibold text-white text-lg"
            >
              {item.member?.name}
            </Text>
            <Text className="text-[#84848e] text-[12px] font-semibold flex-1">
              {formatTimeAgo(item.createdAt)}
            </Text>
          </View>
          <View className="gap-3">
            {!!item.content &&
              (isMessageContainCustomLink(item.content) ||
                isMessageContainLink(item.content)) && (
                <Pressable
                  onPress={async () =>
                    await Linking.openURL(item?.content ?? "")
                  }
                >
                  <Text className="text-[#5865f2] text-base font-semibold">
                    {item.content}
                  </Text>
                </Pressable>
              )}
            {!!item.content &&
              !isMessageContainCustomLink(item.content) &&
              !isMessageContainLink(item.content) && (
                <Text className="text-[#c4c5ca] text-base font-semibold">
                  {item.content}
                </Text>
              )}
            {!!item.fileUrls &&
              item.fileUrls.length > 0 &&
              item.fileUrls.map(({ type, fileName, url, size }, id) => {
                if (type === MessageType.IMAGE)
                  return <ImageView url={url} key={id} />;
                else if (type === MessageType.FILE)
                  return (
                    <Pressable
                      onPress={() => setIsVisible(true)}
                      key={id}
                      className="bg-[#27272f] w-full rounded-lg border-[0.2px] border-grayColor flex-row items-center gap-3 px-3 py-4"
                    >
                      <Ionicons
                        name="document-text"
                        size={28}
                        color="#a6a7ac"
                      />
                      <View className="flex-1">
                        <Text
                          className="text-base text-blue-500 font-semibold"
                          numberOfLines={1}
                        >
                          {fileName}
                        </Text>
                        <Text className="text-sm text-grayColor">
                          {bytes(size ?? 0)}
                        </Text>
                      </View>
                      <Octicons name="download" size={28} color="#a6a7ac" />
                      <PDFReader
                        uri={url}
                        isVisible={isVisible}
                        setIsVisible={setIsVisible}
                      />
                    </Pressable>
                  );
                return <PlayAudio key={id} url={url} duration={size} />;
              })}
          </View>
        </View>
      </Pressable>
      <LongPressMessageModal ref={longPressRef} message={item} />
      <DetailInformationModal
        ref={detailInformationRef}
        information={item?.member}
      />
    </View>
  );
};

const ChatWelcome = ({ name }: { name: string }) => {
  return (
    <View className="gap-3">
      <View className="h-20 w-20 rounded-full justify-center items-center bg-[#373a43]">
        <Feather name="hash" size={35} color="white" />
      </View>
      <View className="gap-1">
        <Text className="text-3xl font-bold text-white">
          Chào mừng bạn đến với #{name}!
        </Text>
        <Text className="text-lg text-[#9699a2]">
          Đây là sự khởi đầu của kênh #{name}!
        </Text>
      </View>
    </View>
  );
};

const Chat = () => {
  const client = useStreamVideoClient();
  const { profile } = useProfileStore();
  const { currentFriend } = useCurrentFriendStore();
  const { messageId } = useLocalSearchParams<{ messageId: string }>();
  const emojiPickerRef = useRef<BottomSheetModal>(null);
  const [isOpenBottomSheetFile, setisOpenBottomSheetFile] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<fileType[]>([]);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [lastVisibleDoc, setLastVisibleDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [inputText, setInputText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [emoji, setEmoji] = useState<string[] | []>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isRecordVisible, SetIsRecordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInitialed, setIsInitialed] = useState(false);
  const flatListRef = useRef(null);
  const [showFloatButton, setShowFloatButton] = useState(false);
  const [typing, setTyping] = useState(false);
  const [friendToken, setFriendToken] = useState("");
  // Giá trị animated cho opacity của nút float
  const floatButtonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const getToken = async () => {
      const tokenRef = doc(db, "tokens", currentFriend?.userId ?? "");
      const notificationToken = await getDoc(tokenRef);
      if (notificationToken.exists()) {
        setFriendToken(notificationToken.data().expoPushToken);
      }
    };
    getToken();
  }, []);
  useEffect(() => {
    const messageStatusRef = ref(
      dbRealTime,
      `messages/${messageId}/${profile?.userId}`
    );
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        set(messageStatusRef, {
          isTyping: true,
        });
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        set(messageStatusRef, {
          isTyping: false,
        });
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    const messageStatusRef = ref(
      dbRealTime,
      `messages/${messageId}/${currentFriend?.userId}`
    );

    const fetchData = () => {
      onValue(messageStatusRef, (snapshot) => {
        if (snapshot.exists()) {
          const { isTyping } = snapshot.val() as { isTyping: boolean };
          setTyping(isTyping);
        } else {
          setTyping(false);
        }
      });
    };

    fetchData();

    return () => {
      off(messageStatusRef);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, `friends/${messageId}/messages`),
        orderBy("createdAt", "desc"),
        limit(10)
      ),
      async (snapshot) => {
        const updatedMessages: DirectMessage[] = [];
        for (const messageDoc of snapshot.docChanges()) {
          if (messageDoc.type === "added") {
            const message: DirectMessage =
              messageDoc.doc.data() as DirectMessage;
            updatedMessages.push(message);
          }
        }
        setMessages((prev) => [...updatedMessages, ...prev]);
        if (!isInitialed && snapshot.docs.length > 0) {
          setLastVisibleDoc(snapshot.docs[snapshot.docs.length - 1]);
        }
      }
    );
    setIsInitialed(true);
    return () => unsubscribe();
  }, []);

  const loadOlderMessages = async () => {
    if (!lastVisibleDoc) return;

    setLoading(true);
    const olderMessagesQuery = query(
      collection(db, `friends/${messageId}/messages`),
      orderBy("createdAt", "desc"), // Sắp xếp tin nhắn theo thời gian giảm dần
      startAfter(lastVisibleDoc),
      limit(10)
    );

    const olderMessagesSnapshot: QuerySnapshot<DocumentData> = await getDocs(
      olderMessagesQuery
    );

    const olderMessages: DirectMessage[] = [];

    for (const messageDoc of olderMessagesSnapshot.docs) {
      const message: DirectMessage = messageDoc.data() as DirectMessage;
      olderMessages.push(message);
    }
    setMessages((prevMessages) => [...prevMessages, ...olderMessages]); // Không cần reverse ở đây
    if (olderMessagesSnapshot.docs.length > 0) {
      setLastVisibleDoc(
        olderMessagesSnapshot.docs[olderMessagesSnapshot.docs.length - 1]
      );
    } else {
      setLastVisibleDoc(null); // No more messages to load
    }
    setLoading(false);
  };

  const handleOpenPress = () => {
    setisOpenBottomSheetFile((prev) => !prev);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChangeText = (text: string) => {
    if (text !== inputText && !isOpen) setIsOpen((prev) => !prev);
    if (emoji.length > 0) {
    }
    setInputText(text);
  };
  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "application/msword"],
    });
    if (!result.canceled) {
      const { mimeType, size, uri, name } = result.assets[0];
      !!size &&
        size < 1048576 &&
        setSelectedFiles([
          ...selectedFiles,
          { type: MessageType.FILE, url: uri, fileName: name, size: size },
        ]);
    }
  };
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: 10,
    });

    if (!result.canceled) {
      setSelectedFiles([
        ...selectedFiles,
        ...result.assets.map((asset) => ({
          type: MessageType.IMAGE,
          url: asset.uri,
        })),
      ]);
    }
  };

  const pickCameraAsync = async () => {
    let result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedFiles([
        ...selectedFiles,
        { type: MessageType.IMAGE, url: result.assets[0].uri },
      ]);
    }
  };

  const onSendAMessage = async () => {
    if (!profile || !messageId || !inputText) return;
    if (selectedFiles) return;
    const content = inputText;
    setInputText("");
    try {
      const message: DirectMessage = {
        id: v4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deleted: false,
        conversationId: messageId,
        content: content,
        fileUrls: selectedFiles,
        member: profile,
        memberId: profile.userId,
      };
      const messagesCollectionRef = collection(
        db,
        `friends/${messageId}/messages`
      );
      await addDoc(messagesCollectionRef, message);
      await updateLastMessage(messageId, message);
      if (!!friendToken) {
        await sendPushNotification(
          friendToken,
          `Tin Nhắn từ ${profile.name}`,
          content ?? "Đã gửi một file cho bạn",
          {
            url: "/(screen)/notification/",
          }
        );
      }
      setLoading(false);
    } catch (error) {
      console.log("add message erorr", error);
    }
  };

  const upLoadFile = async () => {
    if (!selectedFiles) return;
    if (!profile || !messageId) return;
    const content = inputText;
    setSelectedFiles([]);
    setInputText("");
    try {
      const result = await uploadMultipleFiles(selectedFiles);
      console.log(result);
      let message: DirectMessage;
      if (!!content) {
        message = {
          id: v4(),
          conversationId: messageId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deleted: false,
          content: content,
          fileUrls: result,
          member: profile,
          memberId: profile.userId,
        };
      } else {
        message = {
          id: v4(),
          conversationId: messageId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deleted: false,
          fileUrls: result,
          member: profile,
          memberId: profile.userId,
        };
      }
      const messagesCollectionRef = collection(
        db,
        `friends/${messageId}/messages`
      );
      await addDoc(messagesCollectionRef, message);
      await updateLastMessage(messageId, message);
      if (!!friendToken) {
        await sendPushNotification(
          friendToken,
          `Tin Nhắn từ ${profile.name}`,
          content ?? "Đã gửi một file cho bạn",
          {
            url: "/(screen)/notiication/",
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const scrollToTop = () => {
    !!flatListRef &&
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
  };

  // Hàm xử lý sự kiện scroll
  const handleScroll = (event: any) => {
    const { y } = event.nativeEvent.contentOffset;
    if (y > 0 && !showFloatButton) {
      setShowFloatButton(true);
      Animated.timing(floatButtonOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (y === 0 && showFloatButton) {
      setShowFloatButton(false);
      Animated.timing(floatButtonOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: "#1c1d22",
          borderTopColor: "#26262e",
          borderTopWidth: 0.5,
          borderStyle: "solid",
        }}
      >
        <Stack.Screen
          options={{
            headerShown: true,
            title: "",
            headerLeft: () => {
              return (
                <View className="flex-row gap-4 items-center w-40">
                  <Feather name="arrow-left" size={26} color="#a6a7ac" />
                  <View className="">
                    <Image
                      source={{ uri: currentFriend?.imageUrl }}
                      className="h-12 w-12 object-contain rounded-full"
                    />
                    <View className="absolute h-4 w-4 rounded-full bg-green-600 -bottom-[2px] -right-[2px]" />
                  </View>
                  <View className="flex-row items-center">
                    <Text
                      className="font-semibold text-xl text-white"
                      numberOfLines={1}
                    >
                      {currentFriend?.name}
                    </Text>
                    <Entypo name="chevron-right" size={18} color="#a6a7ac" />
                  </View>
                </View>
              );
            },
            headerRight: () => {
              return (
                <View className="flex-row gap-4 items-center">
                  <Pressable className="w-12 h-12 items-center justify-center rounded-full bg-[#26262e]">
                    <FontAwesome6 name="phone-volume" size={18} color="white" />
                  </Pressable>
                  <Pressable
                    onPress={async () => {
                      router.push(`/(screen)/messages/room/${messageId}`);
                    }}
                    className="w-12 h-12 items-center justify-center rounded-full bg-[#26262e]"
                  >
                    <Ionicons name="videocam" size={20} color="white" />
                  </Pressable>
                </View>
              );
            },
            headerStyle: { backgroundColor: "#1c1d22" },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerShadowVisible: false,
          }}
        />
        <View className="flex-1 mx-4">
          {loading && (
            <View className="absolute z-50 bg-inherit top-0 left-0 right-0 h-10 justify-center items-center">
              <ActivityIndicator size={"large"} color={colors.grayColor} />
            </View>
          )}
          <FlatList
            ref={flatListRef}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            onEndReached={loadOlderMessages}
            onEndReachedThreshold={0.1} // Tải tin nhắn cũ hơn khi đến 50% cuối danh sách
            inverted
            data={messages}
            // keyExtractor={(message) => message.id}
            keyExtractor={(item, index) => String(index)}
            renderItem={({ item }) => (
              // <View className="py-5 flex-row gap-3">
              //   <Pressable className="rounded-full h-14 w-14 overflow-hidden">
              //     <Image
              //       source={{ uri: item.member?.imageUrl }}
              //       className="w-full h-full object-contain"
              //     />
              //   </Pressable>
              //   <View className="flex-1">
              //     <View className="flex-row gap-1 items-center">
              //       <Text className="font-semibold text-white text-lg">
              //         {item.member?.name}
              //       </Text>
              //       <Text className="text-[#84848e] text-sm">
              //         {formatTimeAgo(item.createdAt)}
              //       </Text>
              //     </View>
              //     <View className="gap-3">
              //       {!!item.content && (
              //         <Text className="text-[#c4c5ca] text-base">
              //           {item.content}
              //         </Text>
              //       )}
              //       {!!item.fileUrls &&
              //         item.fileUrls.length > 0 &&
              //         item.fileUrls.map(({ type, fileName, url, size }, id) => {
              //           if (type === MessageType.IMAGE)
              //             return <ImageView url={url} key={id} />;
              //           else if (type === MessageType.FILE)
              //             return (
              //               <Pressable
              //                 onPress={() => setIsVisible(true)}
              //                 key={id}
              //                 className="bg-[#27272f] w-full rounded-lg border-[0.2px] border-grayColor flex-row items-center gap-3 px-3 py-4"
              //               >
              //                 <Ionicons
              //                   name="document-text"
              //                   size={28}
              //                   color="#a6a7ac"
              //                 />
              //                 <View className="flex-1">
              //                   <Text
              //                     className="text-base text-blue-500 font-semibold"
              //                     numberOfLines={1}
              //                   >
              //                     {fileName}
              //                   </Text>
              //                   <Text className="text-sm text-grayColor">
              //                     {bytes(size ?? 0)}
              //                   </Text>
              //                 </View>
              //                 <Octicons
              //                   name="download"
              //                   size={28}
              //                   color="#a6a7ac"
              //                 />
              //                 <PDFReader
              //                   uri={url}
              //                   isVisible={isVisible}
              //                   setIsVisible={setIsVisible}
              //                 />
              //               </Pressable>
              //             );

              //           return <PlayAudio key={id} url={url} duration={size} />;
              //         })}
              //     </View>
              //   </View>
              // </View>
              <RenderMessage item={item} />
            )}
            ListFooterComponent={
              messages?.length === 0 ? <ChatWelcome name="thanh Loi" /> : null
            }
          />
          {showFloatButton && (
            <Animated.View
              style={{
                position: "absolute",
                bottom: 20,
                right: 0,
                left: 0,
                justifyContent: "center",
                alignItems: "center",
                opacity: floatButtonOpacity, // Áp dụng opacity từ giá trị Animated
              }}
            >
              <Pressable
                className="h-14 tr w-14 rounded-full bg-neutral-900 items-center justify-center"
                onPress={scrollToTop}
              >
                {/* Hiển thị biểu tượng hoặc nội dung của nút float */}
                {/* Ví dụ: */}
                {/* <YourFloatButtonIconComponent /> */}
                {/* Hoặc: */}
                {/* <Text>Top</Text> */}
                <AntDesign name="down" size={20} color={"white"} />
              </Pressable>
            </Animated.View>
          )}
        </View>
        {typing && (
          <View className="flex-row w-[220px] items-center gap-3 px-2 py-1 rounded-tr-lg  bg-[#26262e]">
            <Text
              numberOfLines={1}
              className="flex-1 text-grayColor text-sm font-semibold"
            >
              {currentFriend?.name} đang soạn tin nhắn
            </Text>
            <Entypo
              name="dots-three-horizontal"
              size={24}
              color={colors.grayColor}
            />
          </View>
        )}
        {selectedFiles.length > 0 && (
          <View className="h-20  border-t-[0.5px] border-t-[#26262e]">
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flexGrow: 1,
                flexDirection: "row",
                flexWrap: "nowrap",
                gap: 10,
                paddingHorizontal: 10,
                alignContent: "center",
                justifyContent: "flex-start",
                paddingVertical: 10,
              }}
            >
              {selectedFiles.map(({ type, url, fileName }) =>
                type === MessageType.IMAGE ? (
                  <View key={url} className="w-16 h-16 rounded-lg">
                    <Image
                      source={{ uri: url }}
                      className="w-full h-full object-contain rounded-lg border-[0.2px] border-grayColor"
                    />

                    <Pressable
                      onPress={() => {
                        const newListFiles = selectedFiles.filter(
                          (file) => url !== file.url
                        );
                        setSelectedFiles(newListFiles);
                      }}
                      className="absolute -top-4 -right-4 w-6 h-6 rounded-full m-2 bg-[#c7c8cd] items-center justify-center"
                    >
                      <AntDesign name="close" size={10} color={"black"} />
                    </Pressable>
                  </View>
                ) : (
                  <View key={url} className="h-16 rounded-lg">
                    <View className="h-full rounded-lg border-[0.2px] border-grayColor bg-[#27272f] flex-row p-3 gap-2">
                      <AntDesign
                        name="pdffile1"
                        size={30}
                        color={colors.grayColor}
                      />
                      <View className="">
                        <Text className="text-sm text-white" numberOfLines={1}>
                          {shortenFileName(fileName ?? "", 15)}
                        </Text>
                        <Text className="text-[#848692] text-sm">{type}</Text>
                      </View>
                    </View>

                    <Pressable
                      onPress={() => {
                        const newListFiles = selectedFiles.filter(
                          (file) => url !== file.url
                        );
                        setSelectedFiles(newListFiles);
                      }}
                      className="absolute -top-4 -right-4 w-6 h-6 rounded-full m-2 bg-[#c7c8cd] items-center justify-center"
                    >
                      <AntDesign name="close" size={10} color={"black"} />
                    </Pressable>
                  </View>
                )
              )}
            </ScrollView>
          </View>
        )}
        <View className="w-full h-16 bottom-0 left-0 right-0 border-t-[0.5px] border-t-[#26262e] px-4 flex-row gap-3 items-center">
          {isFocused && inputText.length > 0 && isOpen ? (
            <Pressable
              onPress={() => setIsOpen((prev) => !prev)}
              className="w-10 h-10 justify-center items-center rounded-full active:bg-[#26262e]"
            >
              <AntDesign name="right" size={18} color="white" />
            </Pressable>
          ) : (
            <>
              <Pressable
                onPress={handleOpenPress}
                className={twMerge(
                  "w-10 h-10 justify-center items-center rounded-full",
                  !!isOpenBottomSheetFile ? "bg-[#5865f2]" : "bg-[#26262e]"
                )}
              >
                <AntDesign
                  name={!!isOpenBottomSheetFile ? "close" : "plus"}
                  size={22}
                  color={!!isOpenBottomSheetFile ? "white" : "#a6a7ac"}
                />
              </Pressable>
              <Pressable className="w-10 h-10 justify-center items-center rounded-full bg-[#26262e]">
                <MaterialCommunityIcons
                  name="shape-plus"
                  size={22}
                  color="#a6a7ac"
                />
              </Pressable>
              <Pressable className="w-10 h-10 justify-center items-center rounded-full bg-[#26262e]">
                <FontAwesome5 name="gift" size={22} color="#a6a7ac" />
              </Pressable>
            </>
          )}
          <View className="flex-1 rounded-full bg-[#26262e] px-3 flex-row gap-1 items-center">
            <TextInput
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Nhắn #dcf"
              placeholderTextColor={"#828490"}
              className="flex-1 text-base p-2 text-[white]"
              value={inputText}
              onChangeText={handleChangeText}
              selectionColor={colors.grayColor}
              multiline={true}
            />
            <Pressable
              onPress={() => {
                Keyboard.dismiss();
                setEmoji([]);
                emojiPickerRef.current?.present();
              }}
            >
              <View className="justify-center items-end">
                <AntDesign name="smile-circle" size={22} color="#a6a7ac" />
              </View>
            </Pressable>
          </View>
          {(isFocused && inputText.length > 0) || selectedFiles.length > 0 ? (
            <Pressable
              onPress={
                !!selectedFiles
                  ? async () => await upLoadFile()
                  : async () => await onSendAMessage()
              }
              className="w-12 h-12 justify-center items-center rounded-full bg-[#5865f2]"
            >
              <Ionicons name="send" size={20} color="white" />
            </Pressable>
          ) : (
            <Pressable
              onPressIn={() => SetIsRecordVisible((prev) => !prev)}
              className="w-10 h-10 justify-center items-center rounded-full bg-[#26262e]"
            >
              <FontAwesome name="microphone" size={22} color="#a6a7ac" />
            </Pressable>
          )}
        </View>
        {isOpenBottomSheetFile && (
          <View className="flex-1">
            <FileBottomSheet
              onOnpenImagePicker={pickImageAsync}
              onCameaPicker={pickCameraAsync}
              onPickPDF={pickDocument}
            />
          </View>
        )}
      </View>

      <EmojiPickerModal
        ref={emojiPickerRef}
        emoji={emoji}
        setEmoji={setEmoji}
        select={setInputText}
      />
      {isRecordVisible && (
        <RecordFriendModal
          isVisible={isRecordVisible}
          setIsVisible={SetIsRecordVisible}
          messagesId={messageId}
          member={profile}
        />
      )}
    </>
  );
};

export default Chat;
