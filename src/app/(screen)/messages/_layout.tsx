import React from "react";

import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        animation: "slide_from_right",
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="add-friends" />
      <Stack.Screen name="add-friend-by-name" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="room/[roomId]" />
      <Stack.Screen name="ringing" />
    </Stack>
  );
}
