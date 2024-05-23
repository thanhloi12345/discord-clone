import { Tabs, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

import { FontAwesome5 } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import useProfileStore from "@/src/store/profileStore";

export const LogoutButton = () => {
  const { signOut } = useAuth();

  const doLogout = () => {
    signOut();
  };

  return (
    <Pressable onPress={doLogout} style={{ marginRight: 10 }}>
      <Ionicons name="log-out-outline" size={24} color={"#fff"} />
    </Pressable>
  );
};

const TabsPage = () => {
  const path = usePathname();
  const { profile } = useProfileStore();
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "#6c47ff",
        },
        headerTintColor: "#fff",
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: hp("7%"),
          backgroundColor: "#2d2d35",
          borderTopWidth: 0,
          display:
            path.includes("create-server") ||
            path.includes("chat") ||
            path.includes("channel") ||
            path.includes("invite") ||
            path.includes("join-server") ||
            path.includes("edit-profile") ||
            path.includes("setting") ||
            path.includes("add-friends") ||
            path.includes("add-friend-by-name") ||
            path.includes("list-friend") ||
            path.includes("room") ||
            path.includes("edit-server") ||
            path.includes("list-member")
              ? "none"
              : "flex",
        },
        tabBarActiveTintColor: "white",
        tabBarHideOnKeyboard: true,
        tabBarBadgeStyle: {
          fontSize: 16,
        },
        tabBarItemStyle: {
          gap: 1,
          paddingVertical: 3,
        },
      }}
    >
      <Tabs.Screen
        name={`server`}
        options={{
          headerTitle: "Home",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="server" size={size} color={color} />
          ),

          tabBarLabel: "Server",
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          headerTitle: "Messages",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-sharp" size={size} color={color} />
          ),
          tabBarLabel: "Message",
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          headerTitle: "Notification",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-sharp" size={size} color={color} />
          ),
          tabBarLabel: "Notification",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: "My Profile",
          tabBarIcon: ({ color, size }) => {
            if (!!profile)
              return (
                <Image
                  resizeMode="cover"
                  source={{ uri: profile.imageUrl }}
                  style={{
                    width: size,
                    height: size,
                    borderRadius: 9999,
                    objectFit: "cover",
                  }}
                />
              );

            return <Ionicons name="person" size={size} color={color} />;
          },
          tabBarLabel: "My Profile",
          headerRight: () => <LogoutButton />,
        }}
      />
    </Tabs>
  );
};

export default TabsPage;
