import { db } from "../core/config";
import { ChannelType, MemberRole, Server } from "../types/type";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  Transaction,
  where,
  writeBatch,
} from "firebase/firestore";
import "react-native-get-random-values";
import { v4 as generateUniqueId } from "uuid";
import { updateServerUpdatedAt } from "./channels";

export async function createNewServer(server: Server): Promise<void> {
  try {
    await runTransaction(db, async (transaction: Transaction) => {
      const newServer: Server = { ...server };
      const serverRef = doc(db, "servers", newServer.id);
      transaction.set(serverRef, newServer);

      // Create member with admin role
      const adminMemberId = new Date().toISOString(); // Function to generate unique ID
      const adminMember = {
        id: adminMemberId,
        role: MemberRole.ADMIN,
        profileId: newServer.profileId,
        serverId: newServer.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const adminMemberRef = doc(
        db,
        `servers/${newServer.id}/members`,
        adminMemberId
      );
      transaction.set(adminMemberRef, adminMember);

      // Create channels
      const channelsBatch = writeBatch(db);
      const textChannelId = generateUniqueId(); // Function to generate unique ID
      const audioChannelId = generateUniqueId(); // Function to generate unique ID

      const textChannel = {
        id: textChannelId,
        name: "General",
        type: ChannelType.TEXT,
        profileId: newServer.profileId,
        serverId: newServer.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const audioChannel = {
        id: audioChannelId,
        name: "General",
        type: ChannelType.AUDIO,
        profileId: newServer.profileId,
        serverId: newServer.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const textChannelRef = doc(
        db,
        `servers/${newServer.id}/channels`,
        textChannelId
      );
      const audioChannelRef = doc(
        db,
        `servers/${newServer.id}/channels`,
        audioChannelId
      );
      channelsBatch.set(textChannelRef, textChannel);
      channelsBatch.set(audioChannelRef, audioChannel);

      await channelsBatch.commit();
    });

    console.log(
      "Profile with server, admin member, and channels created successfully"
    );
  } catch (error) {
    console.error("Error creating profile with server:", error);
    throw error;
  }
}

export const fetchServers = async (profileId: string): Promise<Server[]> => {
  const serverCollectionRef = collection(db, "servers");
  const serverQuery = query(serverCollectionRef);
  const serverList: Server[] = [];

  try {
    const querySnapshot = await getDocs(serverQuery);
    querySnapshot.forEach(async (serverDoc) => {
      const memberCollectionRef = collection(serverDoc.ref, "members");
      const memberQuery = query(
        memberCollectionRef,
        where("profileId", "==", profileId)
      );

      const memberQuerySnapshot = await getDocs(memberQuery);
      if (!memberQuerySnapshot.empty) {
        const serverData = serverDoc.data() as Server;
        serverList.push(serverData);
      }
    });

    return serverList;
  } catch (error) {
    console.error("Error fetching servers:", error);
    return [];
  }
};

export const deleteAMemberById = async (
  memberId: string,
  serverId: string
): Promise<void> => {
  try {
    const memberRef = doc(db, `servers/${serverId}/members`, memberId);
    await deleteDoc(memberRef);
    await updateServerUpdatedAt(serverId);
  } catch (error) {
    console.error("Error fetching servers:", error);
  }
};
