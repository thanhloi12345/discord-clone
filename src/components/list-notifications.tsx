import { View, Text, FlatList, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { FriendRequests, Friends, StatusFriendRequest } from "../types/type";
import {
  ExtendedFriendRequests,
  NotificationType,
} from "../app/(screen)/notification";
import {
  collection,
  doc,
  onSnapshot,
  or,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../core/config";
import useProfileStore from "../store/profileStore";

const NotificationItem = ({
  friendRequest,
}: {
  friendRequest: ExtendedFriendRequests;
}) => {
  const { profile } = useProfileStore();
  const handleAccept = async () => {
    try {
      // Cập nhật trạng thái yêu cầu kết bạn thành accepted
      await updateDoc(doc(db, "friendRequests", friendRequest.id), {
        status: StatusFriendRequest.ACCEPTED,
        updatedAt: new Date().toISOString(),
      });

      // Tạo một bản ghi trong collection "Friends"
      const newFriend: Friends = {
        id: friendRequest.id || "", // Thông thường id này sẽ được Firebase tạo tự động
        memberOneId: friendRequest.senderId || "",
        memberTwoId: friendRequest.receiverId || "",
        memberOne: friendRequest.sender,
        memberTwo: friendRequest.receiver,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Lưu bản ghi mới vào Firestore
      await setDoc(doc(db, "friends", newFriend.id), newFriend);
    } catch (error) {
      console.error("Lỗi khi chấp nhận yêu cầu kết bạn:", error);
    }
  };

  const handleReject = async () => {
    try {
      // Cập nhật trạng thái yêu cầu kết bạn thành rejected
      await updateDoc(doc(db, "friendRequests", friendRequest.id), {
        status: StatusFriendRequest.REJECTED,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Lỗi khi từ chối yêu cầu kết bạn:", error);
    }
  };

  if (friendRequest.receiverId === profile?.userId) {
    if (friendRequest.status === StatusFriendRequest.ACCEPTED) {
      return (
        <View className="w-full py-2 flex-row gap-3">
          <Image
            source={{ uri: friendRequest.sender?.imageUrl }}
            className="h-14 w-14 rounded-full object-contain"
          />
          <View className="flex-1 gap-1">
            <Text
              numberOfLines={3}
              className="text-grayColor text-sm font-semibold"
            >
              {`Bạn đã chấp nhận lời mời kết bạn của ${friendRequest.sender?.name}`}
            </Text>
          </View>
          <Text className="text-sm text-grayColor">
            {moment(friendRequest.updatedAt).fromNow()}
          </Text>
        </View>
      );
    }

    if (friendRequest.status === StatusFriendRequest.REJECTED) {
      return (
        <View className="w-full py-2 flex-row gap-3">
          <Image
            source={{ uri: friendRequest.sender?.imageUrl }}
            className="h-14 w-14 rounded-full object-contain"
          />
          <View className="flex-1 gap-1">
            <Text
              numberOfLines={3}
              className="text-grayColor text-sm font-semibold"
            >
              {`Bạn đã từ chối lời mời kết bạn của ${friendRequest.sender?.name} 😟`}
            </Text>
          </View>
          <Text className="text-sm text-grayColor">
            {moment(friendRequest.updatedAt).fromNow()}
          </Text>
        </View>
      );
    }
    return (
      <View className="w-full py-2 flex-row gap-3">
        <Image
          source={{ uri: friendRequest.sender?.imageUrl }}
          className="h-14 w-14 rounded-full object-contain"
        />
        <View className="flex-1 gap-1">
          <Text
            numberOfLines={3}
            className="text-grayColor text-sm font-semibold"
          >
            {`${friendRequest.sender?.name} đã gửi một yêu cầu kết bạn đến bạn`}
          </Text>
          <View className="flex-row gap-2 items-center">
            <Pressable
              onPress={handleAccept}
              className="rounded-full items-center justify-center bg-[#247f44] px-3 py-3"
            >
              <Text className="text-base text-white font-semibold">
                Chấp nhận
              </Text>
            </Pressable>
            <Pressable
              onPress={handleReject}
              className="rounded-full items-center justify-center bg-[#383949] px-3 py-3"
            >
              <Text className="text-base text-white font-semibold">
                Từ Chối
              </Text>
            </Pressable>
          </View>
        </View>
        <Text className="text-sm text-grayColor">
          {moment(friendRequest.createdAt).fromNow()}
        </Text>
      </View>
    );
  } else {
    if (friendRequest.status === StatusFriendRequest.ACCEPTED) {
      return (
        <View className="w-full py-2 flex-row gap-3">
          <Image
            source={{ uri: friendRequest.receiver?.imageUrl }}
            className="h-14 w-14 rounded-full object-contain"
          />
          <View className="flex-1 gap-1">
            <Text
              numberOfLines={3}
              className="text-grayColor text-sm font-semibold"
            >
              {`${friendRequest.receiver?.name} đã chấp nhận lời mời kết bạn của bạn`}
            </Text>
          </View>
          <Text className="text-sm text-grayColor">
            {moment(friendRequest.updatedAt).fromNow()}
          </Text>
        </View>
      );
    }

    if (friendRequest.status === StatusFriendRequest.REJECTED) {
      return (
        <View className="w-full py-2 flex-row gap-3">
          <Image
            source={{ uri: friendRequest.receiver?.imageUrl }}
            className="h-14 w-14 rounded-full object-contain"
          />
          <View className="flex-1 gap-1">
            <Text
              numberOfLines={3}
              className="text-grayColor text-sm font-semibold"
            >
              {`${friendRequest.receiver?.name} Đã từ chối lời mời kết bạn của bạn 😟`}
            </Text>
          </View>
          <Text className="text-sm text-grayColor">
            {moment(friendRequest.updatedAt).fromNow()}
          </Text>
        </View>
      );
    }
    return (
      <View className="w-full py-2 flex-row gap-3">
        <Image
          source={{ uri: friendRequest.receiver?.imageUrl }}
          className="h-14 w-14 rounded-full object-contain"
        />
        <View className="flex-1 gap-1">
          <Text
            numberOfLines={3}
            className="text-grayColor text-sm font-semibold"
          >
            {`Bạn đã gửi một lời mời kết bạn đến với ${friendRequest.receiver?.name}`}
          </Text>
        </View>
        <Text className="text-sm text-grayColor">
          {moment(friendRequest.createdAt).fromNow()}
        </Text>
      </View>
    );
  }
};
const ListNotifiactions = () => {
  const { profile } = useProfileStore();
  const [friendRequests, setFriendRequests] = useState<
    ExtendedFriendRequests[]
  >([]);

  useEffect(() => {
    if (!profile) {
      console.error("Người dùng chưa đăng nhập!");
      return;
    }

    const friendRequestQuery = query(
      collection(db, "friendRequests"),
      or(
        where("receiverId", "==", profile.userId ?? ""),
        where("senderId", "==", profile.userId ?? "")
      )
    );

    const unsubscribe = onSnapshot(friendRequestQuery, (snapshot) => {
      const requests: ExtendedFriendRequests[] = [];
      snapshot.forEach((doc) => {
        requests.push({
          type: NotificationType.FRIENDREQUEST,
          ...doc.data(),
        } as ExtendedFriendRequests);
      });
      setFriendRequests(requests);
    });
    return () => unsubscribe();
  }, []);

  if (friendRequests.length <= 0)
    return (
      <Text className="text-center text-xl font-bold text-white">
        Không có thông báo nào
      </Text>
    );
  return (
    <FlatList
      style={{
        flex: 1,
        width: "100%",
      }}
      showsVerticalScrollIndicator={false}
      data={friendRequests}
      renderItem={({ item }) => {
        if (item.type === NotificationType.FRIENDREQUEST) {
          return <NotificationItem friendRequest={item} />;
        }
        return null;
      }}
      keyExtractor={(item, id) => String(id)}
      contentContainerStyle={{
        paddingTop: 20,
        gap: 10,
        paddingBottom: 60,
      }}
    />
  );
};

export default ListNotifiactions;
