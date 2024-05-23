import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { db } from "../core/config";
import useProfileStore from "../store/profileStore";
import { StatusFriendRequest } from "../types/type";
import { sendPushNotification } from "../api/send-notification";

const useSendFriendRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { profile } = useProfileStore();

  const sendFriendRequest = async (receiverEmail: string) => {
    try {
      setLoading(true);
      setError(false);
      setSuccess(false);

      if (!profile) {
        setLoading(false);
        return;
      }
      // Kiểm tra xem email của người nhận có tồn tại trong danh sách Profile không
      const profileQuery = query(
        collection(db, "profiles"),
        where("email", "==", receiverEmail.trim())
      );
      const profileSnapshot = await getDocs(profileQuery);

      if (profileSnapshot.empty) {
        console.log(receiverEmail);
        setError(true);
        setLoading(false);
        return;
      }

      const receiverProfile = profileSnapshot.docs[0].data();

      // Kiểm tra xem người nhận đã nhận yêu cầu từ người gửi chưa
      const existingRequestQuery = query(
        collection(db, "friendRequests"),
        where("senderId", "==", profile.userId),
        where("receiverId", "==", receiverProfile.userId)
      );
      const existingRequestSnapshot = await getDocs(existingRequestQuery);

      if (!existingRequestSnapshot.empty) {
        setError(true);
        setLoading(true);
        return;
      }

      const tokenRef = doc(db, "tokens", receiverProfile.userId);
      const notificationToken = await getDoc(tokenRef);

      const newRequestId = profile.userId + "_" + receiverProfile.userId;
      // Gửi yêu cầu kết bạn
      const newRequest = {
        id: newRequestId,
        senderId: profile.userId,
        receiverId: receiverProfile.userId,
        sender: profile,
        receiver: receiverProfile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: StatusFriendRequest.PENDING,
      };

      await setDoc(doc(db, "friendRequests", newRequestId), newRequest);

      if (notificationToken.exists()) {
        console.log("fff");
        const token = notificationToken.data().expoPushToken;
        await sendPushNotification(
          token,
          "Yêu Cầu Kết Bạn",
          `Bạn nhận được yêu cầu kết bạn từ ${profile.name}`,
          {
            url: "/(screen)/notification/",
          }
        );
      }

      setSuccess(true);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return { sendFriendRequest, loading, error, success, setError, profile };
};

export default useSendFriendRequest;
