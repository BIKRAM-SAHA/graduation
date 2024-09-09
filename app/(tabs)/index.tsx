import { StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { Canvas } from "@react-three/fiber/native";
import { ThemedText } from "@/components/ThemedText";
import StacyScene from "@/components/scenes/StacyScene";

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ThemedText>Hi</ThemedText>

            <StacyScene />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
