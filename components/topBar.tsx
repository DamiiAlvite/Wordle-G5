import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { router, usePathname, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons, AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { useNavigation, DrawerActions } from '@react-navigation/native';


export default function TopBar() {
  
  const pathname = usePathname();
  const navigation = useNavigation();
  const { from } = useLocalSearchParams(); 
  const showClose = ["/rules", "/profile", "/stats"].includes(pathname);
  const handleRulesPress = () => {
    router.push(`/rules?from=${encodeURIComponent(pathname)}`);
  };
  const handleClose = () => {
    if (pathname === "/stats" || pathname === "/profile") {
      router.push("/(drawer)/(tabs)/classicMode");
      return;
    }
    if (from && typeof from === 'string') {
      router.push(from);
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      router.push("/(drawer)/(tabs)/classicMode");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={styles.iconButton}>
        <SimpleLineIcons name="menu" size={28} color="black" />
      </TouchableOpacity>
      {showClose ? (
        <TouchableOpacity onPress={handleClose} style={styles.iconButton}>
          <AntDesign name="close" size={28} color="black" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handleRulesPress} style={styles.iconButton}>
          <MaterialCommunityIcons name="lightbulb-on-outline" size={28} color="#333" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: "15%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "2%",
    backgroundColor: "white",
  },
  iconButton: {
    padding: 6,
    marginHorizontal:20,
  },
});