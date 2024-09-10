import { StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import StacyScene from "@/components/scenes/StacyScene";

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <StacyScene />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
