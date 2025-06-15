import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useAuth } from "@/providers/authProvider";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import TopBar from "@/components/topBar";

export default function ProfileScreen() {
  const { userId } = useAuth();
  const [userName, setUserName] = useState('');


  useEffect(() => {
    const getUserName = async () => {
      const { data, error } = await supabase
        .from('user')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (!error && data?.name) {
        setUserName(data.name);
      }
    };
    if (userId) getUserName();
  }, [userId]);

  return (
    <View style={styles.container}>
        <TopBar/>
        <View style={styles.subcontainer}>
            <Text style={styles.username}>Bienvenido, {userName || 'Usuario'}</Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  username: {
    fontWeight: 'bold',
    fontSize: 28,
  },
  subcontainer: {
    flex: 0.8,
    alignItems: "center",
    justifyContent: "center",
    },
});