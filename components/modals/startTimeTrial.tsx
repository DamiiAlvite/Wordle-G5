import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import StartIcon from "@/assets/svg/startIcon";

interface startTimeTrialProps {
    onClose: () => void;
}

export default function StartTimeTrial({ onClose }: startTimeTrialProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Comenzar desafío</Text>
            <View style={styles.subcontainer}>
                <TouchableOpacity onPress={onClose}>
                    <StartIcon width={100} height={100} />
                </TouchableOpacity>
            </View>
            <Text style={styles.footer}>Presiona el boton para comenzar. Buena suerte!</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        width: "90%",
        height: "auto",
        maxWidth: 400,
        padding: 28,
        backgroundColor: "#f9f9fb",
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
        color: "#2E3A59",
        letterSpacing: 3,
        textAlign: "center",
        paddingHorizontal: 20,
    },
    footer: {
        textAlign: "center",
        fontSize: 15,
        color: "#666",
        marginTop: 20,
    },
});
