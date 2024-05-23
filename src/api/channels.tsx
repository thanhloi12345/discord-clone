import { db } from "../core/config";
import { Channel, Server } from "../types/type";
import {
  collection,
  addDoc,
  serverTimestamp,
  Firestore,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

// Function to create a new channel
export async function createChannel(
  serverId: string,
  channelData: Omit<Channel, "createdAt" | "updatedAt">
) {
  try {
    // Reference to the server's collection of channels
    const channelsRef = doc(db, `servers/${serverId}/channels`, channelData.id);

    // Add a new channel document with server timestamp
    await setDoc(channelsRef, {
      ...channelData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await updateServerUpdatedAt(serverId);
  } catch (error) {
    console.error("Error creating channel: ", error);
    throw new Error("Failed to create channel");
  }
}

export async function deleteChannel(serverId: string, channelId: string) {
  try {
    // Reference to the server's collection of channels
    const channelRef = doc(db, `servers/${serverId}/channels`, channelId);

    // Delete the channel document
    await deleteDoc(channelRef);

    await updateServerUpdatedAt(serverId);
  } catch (error) {
    console.error("Error deleting channel: ", error);
    throw new Error("Failed to delete channel");
  }
}

export async function updateChannel(
  serverId: string,
  channelId: string,
  {
    name,
    description,
  }: {
    name: string;
    description: string;
  }
) {
  try {
    const channelRef = doc(db, `servers/${serverId}/channels`, channelId);

    await updateDoc(channelRef, {
      name: name,
      description: description,
      updatedAt: new Date().toISOString(),
    });

    await updateServerUpdatedAt(serverId);
  } catch (error) {
    console.error("Error updating channel: ", error);
    throw new Error("Failed to update channel");
  }
}

export async function updateServerUpdatedAt(serverId: string): Promise<void> {
  try {
    const serverDocRef = doc(db, `servers/${serverId}`);
    await updateDoc(serverDocRef, {
      updatedAt: new Date().toISOString(),
    });
    console.log("Server updated successfully");
  } catch (error) {
    console.error("Error updating server: ", error);
    throw new Error("Failed to update server");
  }
}

export async function updateImageServer(
  serverId: string,
  url: string
): Promise<Server | null> {
  try {
    const serverDocRef = doc(db, `servers/${serverId}`);
    await updateDoc(serverDocRef, {
      imageUrl: url,
      updatedAt: new Date().toISOString(),
    });
    const serverSnapshot = await getDoc(serverDocRef);
    if (serverSnapshot.exists()) {
      return serverSnapshot.data() as Server;
    }
    console.log("Server updated successfully");
    return null;
  } catch (error) {
    console.error("Error updating server: ", error);
    throw new Error("Failed to update server");
  }
}

export async function updateServerName(
  serverId: string,
  name: string
): Promise<Server | null> {
  try {
    const serverDocRef = doc(db, `servers/${serverId}`);
    await updateDoc(serverDocRef, {
      name: name,
      updatedAt: new Date().toISOString(),
    });
    const serverSnapshot = await getDoc(serverDocRef);
    if (serverSnapshot.exists()) {
      return serverSnapshot.data() as Server;
    }
    console.log("Server updated successfully");
    return null;
  } catch (error) {
    console.error("Error updating server: ", error);
    throw new Error("Failed to update server");
  }
}
