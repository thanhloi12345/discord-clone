import { useState, useEffect } from "react";

import { collection, query, where, onSnapshot, or } from "firebase/firestore";
import useProfileStore from "../store/profileStore";
import useFriendStore from "../store/friend-store";
import { db } from "../core/config";
import { ExtendedProfile } from "../api/friends";
export const useUserFriends = () => {
  const { profile } = useProfileStore();
  const { friends, setFriends } = useFriendStore();

  useEffect(() => {
    if (!profile || !friends) return;

    const friendsRef = collection(db, "friends");
    const friendsQuery = query(
      friendsRef,
      or(
        where("memberOneId", "==", profile.userId),
        where("memberTwoId", "==", profile.userId)
      )
    );

    const unsubscribe = onSnapshot(
      friendsQuery,
      (snapshot) => {
        const friendsList: ExtendedProfile[] = [];
        snapshot.forEach((doc) => {
          const friend = doc.data();
          if (friend.memberOneId !== profile.userId) {
            friendsList.push({
              friend: friend.memberOne,
              conversationId: friend.id,
            });
          } else {
            friendsList.push({
              friend: friend.memberTwo,
              conversationId: friend.id,
            });
          }
        });
        setFriends(friendsList);
      },
      (error) => {
        console.error("Error fetching friends:", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [profile]);

  return { friends };
};
