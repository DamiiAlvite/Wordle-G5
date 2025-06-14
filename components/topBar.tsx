import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { router, usePathname } from "expo-router";
import { MaterialCommunityIcons, AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { useNavigation, DrawerActions } from '@react-navigation/native';


export default function TopBar() {
  
  const pathname = usePathname();
  const navigation = useNavigation();
  const isRules = pathname === "/rules";

  return (
    <View style={styles.container}>
      {/*
      <TouchableOpacity onPress={() => router.push("/rules")} style={styles.iconButton}>
        <SimpleLineIcons name="menu" size={28} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/stats")} style={styles.iconButton}>
        <Ionicons name="stats-chart" size={28} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity onPress={logOut} style={styles.iconButton}>
        <Feather name="log-out" size={28} color="#333" />
      </TouchableOpacity>
      */}
      <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={styles.iconButton}>
        <SimpleLineIcons name="menu" size={28} color="black" />
      </TouchableOpacity>
      {isRules ? (
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <AntDesign name="close" size={28} color="black" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => router.push("/rules")} style={styles.iconButton}>
          <MaterialCommunityIcons name="lightbulb-on-outline" size={28} color="#333" />
        </TouchableOpacity>
      )}
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
    marginHorizontal:20,
  },
});