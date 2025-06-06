import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons, Ionicons, Feather } from "@expo/vector-icons";

export default function TopBar({ logOut }) {

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton}>
        <MaterialCommunityIcons name="lightbulb-on-outline" size={28} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="stats-chart" size={28} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity onPress={logOut} style={styles.iconButton}>
        <Feather name="log-out" size={28} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "white",
  },
  iconButton: {
    padding: 6,
  },
});