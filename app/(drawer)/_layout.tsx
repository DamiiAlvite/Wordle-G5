import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList, } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity, StyleSheet, } from 'react-native';
import { useAuth } from '@/providers/authProvider';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Feather from '@expo/vector-icons/Feather';

function CustomDrawerContent(props) {
  const { userId } = useAuth();
  const [userName, setUserName] = useState('');
  const logOut = () => {
    supabase.auth.signOut()
  }

  useEffect(() => {
    const getUserName = async () => {
      const { data, error } = await supabase
        .from('user')
        .select('name')
        .eq('user_id', userId)
        .single();
      if (!error && data?.name) {
        setUserName(data.name);
      }
    };
    if (userId) getUserName();
  }, [userId]);

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.header}>
        <Feather name="user" size={32} color="black" style={styles.userIcon}/>
        <Text style={styles.username}>Bienvenido, {userName || 'Usuario'}</Text>
      </View>
      <View style={styles.menu}>
        <DrawerItemList {...props} />
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={logOut}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false, // Oculta el título de la página
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          name="index"
          options={{ drawerLabel: "Juego" }}
        />
        <Drawer.Screen
          name="rules"
          options={{ drawerLabel: "Reglas" }}
        />
        <Drawer.Screen
          name="stats"
          options={{ drawerLabel: "Estadísticas" }}
        />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginVertical: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    marginRight: 12,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 28,
  },
  menu: {
    flex: 1,
  },
  logoutButton: {
    margin: 16,
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#d00',
    fontWeight: 'bold',
  },
});