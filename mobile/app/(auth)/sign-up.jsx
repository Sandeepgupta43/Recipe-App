import React, { useState } from "react";
import {
    View,
    Text,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import { authStyles } from "../../assets/styles/auth.styles";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import VerifyEmail from "./verify-email";

const SignUpScreen = () => {
    const router = useRouter();

    // ✅ Properly typed state variables
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pendingVerification, setPendingVerification] = useState(false);

    const { isLoaded, signUp } = useSignUp();

    const handleSignUp = async () => {
        if (!email || !password) {
            return Alert.alert("Error", "Please fill in all fields");
        }
        if (password.length < 6) {
            return Alert.alert(
                "Error",
                "Password must be at least 6 characters"
            );
        }

        if (!isLoaded) return;

        setLoading(true);

        try {
            await signUp.create({ emailAddress: email, password });
            await signUp.prepareVerification({ strategy: "email_code" }); 
            setPendingVerification(true);
        } catch (error) {
            console.error("Signup error raw:", error);

            // Try parsing error if it's a ClerkError
            if (error && typeof error === "object" && "errors" in error) {
                const clerkError = error;
                Alert.alert(
                    "Sign Up Error",
                    clerkError.errors[0]?.message || "Unknown error occurred."
                );
            } else {
                Alert.alert("Sign Up Error", "An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (pendingVerification) return <VerifyEmail email={email} onBack={() => {
      setPendingVerification(false);
    }}/>

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={authStyles.container}>
                <KeyboardAvoidingView
                    style={authStyles.keyboardView}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "android" ? 64 : 0}
                >
                    <ScrollView
                        contentContainerStyle={authStyles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={authStyles.imageContainer}>
                            <Image
                                source={require("../../assets/images/i2.png")}
                                style={authStyles.image}
                                contentFit="contain"
                            />
                        </View>

                        <Text style={authStyles.title}>Create Account</Text>

                        <View style={authStyles.formContainer}>
                            {/* Email Input */}
                            <View style={authStyles.inputContainer}>
                                <TextInput
                                    style={authStyles.textInput}
                                    placeholder="Enter email"
                                    placeholderTextColor={COLORS.textLight}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            {/* Password Input */}
                            <View style={authStyles.inputContainer}>
                                <TextInput
                                    style={authStyles.textInput}
                                    placeholder="Enter password"
                                    placeholderTextColor={COLORS.textLight}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                />
                                {password.length > 0 && (
                                    <TouchableOpacity
                                        style={authStyles.eyeButton}
                                        onPress={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        <Ionicons
                                            name={
                                                showPassword
                                                    ? "eye-outline"
                                                    : "eye-off-outline"
                                            }
                                            size={20}
                                            color={COLORS.textLight}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[
                                authStyles.authButton,
                                loading && authStyles.buttonDisabled,
                            ]}
                            onPress={handleSignUp}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <Text style={authStyles.buttonText}>
                                {loading ? "Signing Up..." : "Sign Up"}
                            </Text>
                        </TouchableOpacity>

                        {/* Sign In Link */}
                        <TouchableOpacity
                            style={authStyles.linkContainer}
                            onPress={() => router.push("/(auth)/sign-in")}
                        >
                            <Text style={authStyles.linkText}>
                                Already have an account?{" "}
                                <Text style={authStyles.link}>Sign in</Text>
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default SignUpScreen;
