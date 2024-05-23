import { useEffect } from "react";
import { View, Image, Platform } from "react-native";
import { PermissionsAndroid } from "react-native";

const StartPage = () => {
  useEffect(() => {
    const run = async () => {
      if (Platform.OS === "android") {
        await PermissionsAndroid.requestMultiple([
          "android.permission.POST_NOTIFICATIONS",
          "android.permission.BLUETOOTH_CONNECT",
        ]);
      }
    };
    run();
  }, []);
  return (
    <View
      className="bg-primaryColor"
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Image
        source={require("../../assets/images/icon.png")}
        resizeMode="contain"
        style={{
          height: 150,
          width: 150,
        }}
      />
    </View>
  );
};

export default StartPage;
