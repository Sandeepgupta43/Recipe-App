import { Slot } from "expo-router";
import "../global.css";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { KeyboardAvoidingView, Platform } from "react-native";
import SafeScreen from "../components/SafeScreen";

export default function RootLayout() {
    return (
        <ClerkProvider tokenCache={tokenCache}>
            <SafeScreen>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <Slot />
                </KeyboardAvoidingView>
            </SafeScreen>
        </ClerkProvider>
    );
}
