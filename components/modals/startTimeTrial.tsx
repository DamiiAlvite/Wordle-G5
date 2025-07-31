import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import StartIcon from "@/assets/svg/startIcon";
import { useTheme } from "@/context/themeContext";

interface startTimeTrialProps {
    onClose: () => void;
}

export default function StartTimeTrial({ onClose }: startTimeTrialProps) {
    const { theme } = useTheme();
    
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Comenzar desafío</Text>
            <View style={styles.subcontainer}>
                <TouchableOpacity onPress={onClose}>
                    <StartIcon width={100} height={100} />
                </TouchableOpacity>
            </View>
            <Text style={[styles.footer, { color: theme.colors.textSecondary }]}>Presiona el boton para comenzar. Buena suerte!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "90%",
        height: "auto",
        maxWidth: 400,
        padding: 28,
        borderRadius: 32,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 6,
        marginTop: "30%",
    },
    subcontainer: {
        marginTop: 20,
        alignItems: "center",
    },
    title: {
        fontSize: 36,
        fontWeight: "900",
        letterSpacing: 3,
        textAlign: "center",
        paddingHorizontal: 20,
    },
    footer: {
        textAlign: "center",
        fontSize: 15,
        marginTop: 20,
    },
});
