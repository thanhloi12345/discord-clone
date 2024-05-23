import { doc, setDoc } from "firebase/firestore";
import { db } from "../core/config";

export async function sendPushNotification(
  expoPushToken: any,
  title: string,
  body: string,
  data: object
) {
  const message = {
    to: expoPushToken.data,
    sound: "default",
    title: title,
    body: body,
    data: data,
  };

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error sending notification:", errorData);
      throw new Error("Failed to send push notification");
    }

    const responseData = await response.json();
    console.log("Notification sent successfully:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
}

export async function saveTokenToFirestore(userId: string, token: any) {
  try {
    // Create a document reference with the userId as the key
    const userRef = doc(db, "tokens", userId);

    // Set the token in the Firestore document
    await setDoc(userRef, { expoPushToken: token }, { merge: true });

    console.log("Token saved successfully!");
  } catch (error) {
    console.error("Error saving token to Firestore:", error);
  }
}
