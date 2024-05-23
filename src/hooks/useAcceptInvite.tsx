import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../core/config";
import useProfileStore from "../store/profileStore";
import { ChannelType, Member, MemberRole, Server } from "../types/type";
import { v4 } from "uuid";
import { updateServerUpdatedAt } from "../api/channels";

const useJoinInviteServer = (serverId: string, secretCode: string) => {
  const [serverStatus, setServerStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [invitationExpired, setInvitationExpired] = useState(false);
  const [server, setServer] = useState<Server>();
  const { profile } = useProfileStore();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const joinServer = async () => {
      setLoading(true);
      // Check if the member exists in the server
      const memberQuery = query(
        collection(db, `servers/${serverId}/members`),
        where("profileId", "==", profile?.userId ?? "")
      );
      const memberSnapshot = await getDocs(memberQuery);

      if (!memberSnapshot.empty) {
        // Member doesn't exist in the server
        setError("Link is broken or invitation has expired.");
        setInvitationExpired(true);
        setLoading(false);
        return;
      }

      // Member exists, check secret code
      const serverDocRef = doc(db, `servers/${serverId}`);
      const serverDocSnapshot = await getDoc(serverDocRef);

      if (!serverDocSnapshot.exists()) {
        setError("Link is broken or invitation has expired.");
        setInvitationExpired(true);
        setLoading(false);
        return;
      }

      const serverData = serverDocSnapshot.data() as Server;
      if (serverData.inviteCode !== secretCode) {
        setError("Incorrect secret code.");
        setLoading(false);
        return;
      }

      const queryMemberSize = query(
        collection(db, `servers/${serverId}/members`)
      );
      const memberSizeSnapshot = await getDocs(queryMemberSize);
      const count = memberSizeSnapshot.size;

      // Both conditions passed, set success status
      setServer(serverDocSnapshot.data() as Server);
      setCount(count);
      setServerStatus("Success");
      setLoading(false);
    };

    if (serverId && profile && secretCode) {
      joinServer();
    }
  }, [serverId, profile, secretCode]);

  const acceptInvite = async () => {
    if (!profile || !serverId) return;

    try {
      const member: Member = {
        id: v4(),
        profileId: profile.userId,
        role: MemberRole.GUEST,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        serverId: serverId,
      };

      const adminMemberRef = doc(db, `servers/${serverId}/members`, member.id);
      await setDoc(adminMemberRef, member);
      await updateServerUpdatedAt(serverId);
    } catch (error) {
      console.log("cannot accept a server invite! ", error);
    }
  };

  return {
    serverStatus,
    error,
    loading,
    invitationExpired,
    acceptInvite,
    server,
    count,
  };
};

export default useJoinInviteServer;
