import React from "react";
import { Stack } from "expo-router";
import { colors } from "../../libs/color";

const PublicLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primaryBg,
        },
        headerTintColor: colors.grayColor,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          headerTitle: "",
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="register"
        options={{
          headerTitle: "Create Account",
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="sign-in"
        options={{
          headerTitle: "Sign in",
        }}
      ></Stack.Screen>
    </Stack>
  );
};

export default PublicLayout;
