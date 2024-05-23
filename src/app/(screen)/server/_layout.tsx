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
      <Stack.Screen name="create-server" />
      <Stack.Screen name="invite" />
      <Stack.Screen name="join-server" />
      <Stack.Screen
        name="channel"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen name="setting-server" />
      <Stack.Screen name="edit-server" />
      <Stack.Screen name="list-channel" />
      <Stack.Screen name="list-member" />
    </Stack>
  );
}
