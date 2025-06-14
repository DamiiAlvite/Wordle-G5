import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import Game from "@/components/game";
import TopBar from "@/components/topBar";
import { supabase } from "@/lib/supabase";

export default function Home() {

  return (
      <View style={styles.container}>
          <TopBar/>
          <Game />
      </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: "center",
  },
  day: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});