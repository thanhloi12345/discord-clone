import {
  View,
  Text,
  Dimensions,
  Modal,
  Animated,
  PanResponder,
  Pressable,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import Pdf from "react-native-pdf";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const windowHeigh = Dimensions.get("window").height;

// const PDFReader = () => {
//   const pdfResource = {
//     uri: "https://firebasestorage.googleapis.com/v0/b/discord-clone-3ce0b.appspot.com/o/pdfs%2F20110ST1_20110ST2_NgonNguLTTT_KiemTraDinhKy1.pdf?alt=media&token=b9624587-278f-4d1f-98c3-ba67ac8ba2a6",
//     cache: true,
//   };
//   return (
//     <View className="flex-1">
//       <Pdf
//         source={pdfResource}
//         trustAllCerts={false}
//         onLoadComplete={(numberPages, paths) => console.log(numberPages)}
//         style={{
//           flex: 1,
//           width: windowWidth,
//           height: windowHeigh,
//         }}
//       />
//     </View>
//   );
// };

const PDFReader = ({
  uri,
  isVisible,
  setIsVisible,
}: {
  uri: any;
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
}) => {
  const pdfResource = {
    uri: "https://firebasestorage.googleapis.com/v0/b/discord-clone-3ce0b.appspot.com/o/pdfs%2F20110ST1_20110ST2_NgonNguLTTT_KiemTraDinhKy1.pdf?alt=media&token=b9624587-278f-4d1f-98c3-ba67ac8ba2a6",
    cache: true,
  };
  return (
    <Modal
      onRequestClose={() => setIsVisible(false)}
      visible={isVisible}
      animationType="slide"
      transparent={true}
    >
      <View className="flex-1">
        <Pdf
          source={pdfResource}
          trustAllCerts={false}
          style={{
            flex: 1,
            width: windowWidth,
            height: windowHeigh,
          }}
        />

        <Pressable
          onPress={() => setIsVisible(false)}
          className="absolute left-4 top-4 h-11 w-11 justify-center items-center"
        >
          <AntDesign name="arrowleft" size={25} color={"black"} />
        </Pressable>
      </View>
    </Modal>
  );
};
export default PDFReader;
