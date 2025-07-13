import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { authStyles } from "../../assets/styles/auth.styles"; // adjust path if needed
import { COLORS } from "../../constants/colors";
import { Image } from "expo-image";

const VerifyEmail = ({ email, onBack }) => {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    const { signUp, isLoaded, setActive } = useSignUp();
    const router = useRouter();

    const handleVerify = async () => {
        if (!isLoaded) return;

        if (!code) {
            return Alert.alert(
                "Verification Code Required",
                "Please enter the code sent to your email."
            );
        }

        setLoading(true);

        try {
            const result = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                Alert.alert("Success", "Email verified successfully!");
                router.replace("/(auth)/sign-in");
            } else {
                Alert.alert("Error");
            }
        } catch (error) {
            console.error("Verification Error:", error);
            Alert.alert(
                "Verification Failed",
                error?.errors?.[0]?.message || "Invalid code."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={authStyles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={authStyles.container}
            >
                <View style={authStyles.imageContainer}>
                    <Image
                        source={require("../../assets/images/i3.png")}
                        style={authStyles.image}
                        contentFit="contain"
                    />
                </View>

                <Text style={authStyles.title}>Create Account</Text>

                <View style={authStyles.formContainer}>
                    <Text style={authStyles.title}>Verify Your Email</Text>
                    <Text style={authStyles.subtitle}>
                        Enter the 6-digit code sent to your email address
                    </Text>

                    <TextInput
                        placeholder="Enter verification code"
                        placeholderTextColor={COLORS.textLight}
                        style={authStyles.textInput}
                        keyboardType="number-pad"
                        value={code}
                        onChangeText={setCode}
                        autoCapitalize="none"
                    />

                    <TouchableOpacity
                        style={[
                            authStyles.authButton,
                            loading && authStyles.buttonDisabled,
                        ]}
                        onPress={handleVerify}
                        disabled={loading}
                    >
                        <Text style={authStyles.buttonText}>
                            {loading ? "Verifying..." : "Verify Email"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={authStyles.link} onPress={onBack}>
                        <Text style={authStyles.linkText}>
                            <Text style={authStyles.link}>Back to Sugn up</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default VerifyEmail;
