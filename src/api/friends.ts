import {
  collection,
  doc,
  getDocs,
  or,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../core/config";
import { DirectMessage, Friends, Profile } from "../types/type";

export type ExtendedProfile = {
  friend: Profile | undefined;
  conversationId?: string;
};
export async function getUserFriends(userId: string) {
  try {
    const friendsRef = collection(db, "friends");
    // Truy vấn danh sách bạn bè có memberOneId hoặc memberTwoId là userId
    const friendsQuery = query(
      friendsRef,
      or(where("memberOneId", "==", userId), where("memberTwoId", "==", userId))
    );
    const friendsSnapshot = await getDocs(friendsQuery);
    const friends: (ExtendedProfile | undefined)[] = [];
    friendsSnapshot.forEach((doc) => {
      const friend = doc.data() as Friends;

      if (friend.memberOneId !== userId)
        friends.push({
          friend: friend.memberOne,
          conversationId: friend.id,
        });
      else
        friends.push({ friend: friend.memberTwo, conversationId: friend.id });
    });

    return friends;
  } catch (error) {
    console.error("Error fetching friends:", error);
    throw new Error("Internal Server Error");
  }
}

export async function updateFriendUpdatedDate(friendId: string) {
  try {
    const friendRef = doc(db, "friends", friendId);
    await updateDoc(friendRef, {
      updatedDate: new Date().toISOString(),
    });
    console.log("Đã cập nhật updatedDate cho bạn bè có id:", friendId);
  } catch (error) {
    console.error("Lỗi khi cập nhật updatedDate:", error);
    throw new Error("Internal Server Error");
  }
}

export async function updateLastMessage(
  friendId: string,
  lastMessage: DirectMessage
) {
  try {
    const friendRef = doc(db, "friends", friendId);
    await updateDoc(friendRef, {
      lastMessage: lastMessage,
    });
    console.log("Đã cập nhật lastMessage cho bạn bè có id:", friendId);
  } catch (error) {
    console.error("Lỗi khi cập nhật lastMessage:", error);
    throw new Error("Internal Server Error");
  }
}
