import { View, Text, Button, Pressable, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import useProfileStore from "../../store/profileStore";

const Home = () => {
  const { profile, setProfile } = useProfileStore();
  const { signOut } = useAuth();

  const doLogout = () => {
    signOut();
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome, {profile?.name} 🎉</Text>
      <Image
        source={{ uri: profile?.imageUrl }}
        className="h-16 w-16 rounded-full object-contain"
      />
      <Pressable
        onPress={() => {
          setProfile(null);
          doLogout();
        }}
      >
        <Text>Logout</Text>
      </Pressable>
    </View>
  );
};

export default Home;
