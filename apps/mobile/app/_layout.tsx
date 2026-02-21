
import { Stack } from "expo-router";
import { AuthProvider } from "../src/context/AuthContext";

import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';


export default function RootLayout() {
  return (
    <AuthProvider>

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />

      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />

      </Stack>
    </AuthProvider>
  );
}