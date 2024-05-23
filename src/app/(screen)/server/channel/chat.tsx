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
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import {
  fileType,
  Member,
  Message,
  MessageType,
  Profile,
} from "../../../../types/type";
import * as ImagePicker from "expo-image-picker";
import EmojiPickerModal from "../../../../components/Modals/emoji-picker-modal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { colors } from "../../../../libs/color";
import FileBottomSheet from "../../../../components/bottomSheet/file-bottomSheet";
import { twMerge } from "tailwind-merge";
import { ScrollView } from "react-native-gesture-handler";
import * as DocumentPicker from "expo-document-picker";
import { formatTimeAgo, shortenFileName } from "../../../../utils/util";
import useProfileStore from "../../../../store/profileStore";
import { Octicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";

import ImageView from "../../../../components/image-view";
import bytes from "bytes";
import PDFReader from "../../../../components/PDFReader";
import RecordModal from "../../../../components/Modals/record- modal";
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
  getDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { db } from "../../../../core/config";
import { useMemberByProfileId } from "../../../../../src/hooks/useCurrentMember";
import "react-native-get-random-values";
import { v4 } from "uuid";
import useServerStore from "../../../../store/server-store";
import { uploadMultipleFiles } from "../../../../utils/upload";
import PlayAudio from "@/src/provider/play-audio";
import useListServersStore from "@/src/store/create-list-server-store";

const windowWidth = Dimensions.get("window").width;
const windowHeigh = Dimensions.get("window").height;

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
  const { profile } = useProfileStore();
  const { selectedServer: server } = useListServersStore();
  const { channelId } = useLocalSearchParams<{ channelId: string }>();
  const emojiPickerRef = useRef<BottomSheetModal>(null);
  const [isOpenBottomSheetFile, setisOpenBottomSheetFile] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<fileType[]>([]);
  const { member } = useMemberByProfileId();
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastVisibleDoc, setLastVisibleDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [inputText, setInputText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [emoji, setEmoji] = useState<string[] | []>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isRecordVisible, SetIsRecordVisible] = useState(false);
  const { selectedServer } = useServerStore();
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isInitialed, setIsInitialed] = useState(false);
  const flatListRef = useRef(null);
  const [showFloatButton, setShowFloatButton] = useState(false);
  // Giá trị animated cho opacity của nút float
  const floatButtonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(
          db,
          `servers/${selectedServer}/channels/${channelId}/messages`
        ),
        orderBy("createdAt", "desc"),
        limit(10)
      ),
      async (snapshot) => {
        const updatedMessages: Message[] = [];
        for (const messageDoc of snapshot.docChanges()) {
          if (messageDoc.type === "added") {
            const message: Message = messageDoc.doc.data() as Message;
            const profileId = message.member?.profileId ?? "";
            const profileRef = doc(db, "profiles", profileId);
            const profileSnapshot = await getDoc(profileRef);
            const profileData = profileSnapshot.data() as Profile;
            message.member &&
              (message.member.profile = profileData ?? undefined);
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
      collection(
        db,
        `servers/${selectedServer}/channels/${channelId}/messages`
      ),
      orderBy("createdAt", "desc"), // Sắp xếp tin nhắn theo thời gian giảm dần
      startAfter(lastVisibleDoc),
      limit(10)
    );

    const olderMessagesSnapshot: QuerySnapshot<DocumentData> = await getDocs(
      olderMessagesQuery
    );

    const olderMessages: Message[] = [];

    for (const messageDoc of olderMessagesSnapshot.docs) {
      const message: Message = messageDoc.data() as Message;
      const profileId = message.member?.profileId ?? "";
      const profileRef = doc(db, "profiles", profileId);
      const profileSnapshot = await getDoc(profileRef); // Sử dụng await
      const profileData = profileSnapshot.data() as Profile;

      message.member && (message.member.profile = profileData ?? undefined);
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
    if (!member || !channelId || !inputText) return;
    if (selectedFiles) return;
    const content = inputText;
    setInputText("");
    try {
      const message: Message = {
        id: v4(),
        channelId: channelId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deleted: false,
        content: content,
        fileUrls: selectedFiles,
        member: member,
        memberId: member.id,
      };
      const messagesCollectionRef = collection(
        db,
        `servers/${selectedServer}/channels/${channelId}/messages`
      );
      await addDoc(messagesCollectionRef, message);
      setLoading(false);
    } catch (error) {
      console.log("add message erorr", error);
    }
  };

  const upLoadFile = async () => {
    if (!selectedFiles) return;
    if (!member || !channelId) return;
    const content = inputText;
    setSelectedFiles([]);
    setInputText("");
    try {
      const result = await uploadMultipleFiles(selectedFiles);
      console.log(result);
      let message: Message;
      if (!!content) {
        message = {
          id: v4(),
          channelId: channelId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deleted: false,
          content: content,
          fileUrls: result,
          member: member,
          memberId: member.id,
        };
      } else {
        message = {
          id: v4(),
          channelId: channelId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deleted: false,
          fileUrls: result,
          member: member,
          memberId: member.id,
        };
      }
      const messagesCollectionRef = collection(
        db,
        `servers/${selectedServer}/channels/${channelId}/messages`
      );
      await addDoc(messagesCollectionRef, message);
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
                  <Feather name="arrow-left" size={24} color="#a6a7ac" />

                  <View className="flex-row gap-2 items-center">
                    <Feather name="hash" size={20} color="#a6a7ac" />
                    <View className="flex-row items-center">
                      <Text
                        numberOfLines={1}
                        className="font-bold text-xl text-white"
                      >
                        {server?.name}
                      </Text>
                      <Entypo name="chevron-right" size={14} color="#a6a7ac" />
                    </View>
                  </View>
                </View>
              );
            },
            headerRight: () => {
              return (
                <Pressable className="w-10 h-10 items-center justify-center rounded-full bg-[#26262e]">
                  <AntDesign name="search1" size={24} color="#a6a7ac" />
                </Pressable>
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
              <View className="py-5 flex-row gap-3">
                <Pressable className="rounded-full h-14 w-14 overflow-hidden">
                  <Image
                    source={{ uri: item.member?.profile?.imageUrl }}
                    className="w-full h-full object-contain"
                  />
                </Pressable>
                <View className="flex-1">
                  <View className="flex-row gap-1 items-center">
                    <Text className="font-semibold text-white text-lg">
                      {item.member?.profile?.name}
                    </Text>
                    <Text className="text-[#84848e] text-sm">
                      {formatTimeAgo(item.createdAt)}
                    </Text>
                  </View>
                  <View className="gap-3">
                    {!!item.content && (
                      <Text className="text-[#c4c5ca] text-base">
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
                              <Octicons
                                name="download"
                                size={28}
                                color="#a6a7ac"
                              />
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
              </View>
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
        <RecordModal
          isVisible={isRecordVisible}
          setIsVisible={SetIsRecordVisible}
          channelId={channelId}
          serverId={selectedServer}
          member={member}
        />
      )}
    </>
  );
};

export default Chat;
