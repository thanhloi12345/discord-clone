import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { storage } from "../core/config";
import { fileType, MessageType } from "../types/type";

export async function uploadImage(file: Blob): Promise<string> {
  try {
    const fileName = `${uuidv4()}`; // Tạo tên file duy nhất bằng UUID
    const storageRef = ref(storage, `images/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    const snapshot = await uploadTask;
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

export async function uploadFile(file: fileType): Promise<fileType> {
  try {
    const fileName = `${uuidv4()}`;
    const fetchResponse = await fetch(file.url);
    const theBlob = await fetchResponse.blob();

    let storageRef;
    if (file.type === MessageType.IMAGE)
      storageRef = ref(storage, `images/${fileName}`);
    else if (file.type === MessageType.FILE)
      storageRef = ref(storage, `pdfs/${fileName}`);
    else storageRef = ref(storage, `records/${fileName}`);

    const uploadTask = uploadBytesResumable(storageRef, theBlob);
    const snapshot = await uploadTask;
    const downloadURL = await getDownloadURL(snapshot.ref);

    if (file.type === MessageType.IMAGE)
      return {
        url: downloadURL,
        type: file.type,
      };
    else if (file.type === MessageType.RECORD) {
      return {
        type: file.type,
        url: downloadURL,
        size: file.size,
      };
    }
    return {
      type: file.type,
      size: file.size,
      fileName: file.fileName,
      url: downloadURL,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

export async function uploadMultipleFiles(
  files: fileType[]
): Promise<fileType[]> {
  const uploadPromises: Promise<fileType>[] = files.map(async (file) => {
    try {
      const url = await uploadFile(file);
      return url;
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  try {
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
