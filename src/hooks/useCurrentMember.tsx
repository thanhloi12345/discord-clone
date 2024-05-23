import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../core/config";
import useProfileStore from "../store/profileStore";
import useServerStore from "../store/server-store";
import { Member } from "../types/type";

export function useMemberByProfileId() {
  const { profile } = useProfileStore();
  const { selectedServer } = useServerStore();

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const membersCollectionRef = collection(
          db,
          "servers",
          selectedServer ?? "",
          "members"
        );
        const q = query(
          membersCollectionRef,
          where("profileId", "==", profile?.userId)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("No member found with the given profileId.");
          setMember(null);
        } else {
          // Chỉ lấy thành viên đầu tiên trong trường hợp có nhiều thành viên trùng profileId
          const memberDoc = querySnapshot.docs[0];
          const memberData = memberDoc.data() as Member;
          setMember(memberData);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error getting member:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchMember();
  }, [selectedServer, profile]); // useEffect sẽ được gọi lại khi serverId hoặc profileId thay đổi

  return { member, loading, error };
}
