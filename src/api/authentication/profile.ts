import { db } from "../../core/config";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { Profile } from "../../types/type";

export const initialProfile = async (user: any) => {
  // @ts-ignore
  const profile = await getProfileByUserId(user.id);

  if (profile) return profile;
  // @ts-ignore
  const name = user.firstName
    ? // @ts-ignore
      `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
    : // @ts-ignore
      user.id;

  const newProfile = await createProfile({
    userId: user.id,
    name: name,
    imageUrl: user?.imageUrl,
    email: user.emailAddresses[0].emailAddress,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return newProfile;
};

export async function getProfileByUserId(
  userId: string
): Promise<Profile | null> {
  try {
    const profileRef = collection(db, "profiles");
    const q = query(profileRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const profileDoc = querySnapshot.docs[0];
      return profileDoc.data() as Profile;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}

async function createProfile(profile: Profile): Promise<Profile> {
  try {
    const docRef = doc(db, "profiles", profile.userId);
    await setDoc(docRef, profile);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Profile;
    } else {
      throw new Error("Error retrieving created profile");
    }
  } catch (error) {
    throw error;
  }
}
