import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps, } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity, StyleSheet, } from 'react-native';
import { useAuth } from '@/providers/authProvider';
import { supabase } from '@/lib/supabase';
import Feather from '@expo/vector-icons/Feather';
import { useTheme, ThemeMode } from '@/context/themeContext';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { userId, username } = useAuth();
  const { theme, themeMode, setThemeMode } = useTheme();
  const [themeModalVisible, setThemeModalVisible] = useState(false);

  const logOut = () => {
    supabase.auth.signOut();
  };

  const getThemeIcon = (mode: ThemeMode) => {
    switch (mode) {
      case 'light': return 'light-mode';
      case 'dark': return 'dark-mode';
      case 'system': return 'settings-brightness';
      default: return 'settings-brightness';
    }
  };

  const getThemeLabel = (mode: ThemeMode) => {
    switch (mode) {
      case 'light': return 'Claro';
      case 'dark': return 'Oscuro';
      case 'system': return 'Sistema';
      default: return 'Sistema';
    }
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }} style={[styles.drawerContainer, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.header}>
        <Feather name="user" size={32} color={theme.colors.text} style={styles.userIcon}/>
        <Text style={[styles.username, { color: theme.colors.text }]}>Hola! {username || 'Usuario'}</Text>
      </View>
      
      <View style={styles.menu}>
        <DrawerItemList {...props} />
      </View>

      <View style={styles.themeSection}>
        <TouchableOpacity
          style={[styles.themeButton, { borderColor: theme.colors.border }]}
          onPress={() => setThemeModalVisible(true)}
        >
          <MaterialIcons 
            name={getThemeIcon(themeMode) as any}
            size={24}
            color={theme.colors.text}
          />
          <Text style={[styles.themeButtonText, { color: theme.colors.text }]}>
            Tema: {getThemeLabel(themeMode)}
          </Text>
          <MaterialIcons name="arrow-drop-down" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {themeModalVisible && (
        <View style={styles.themeModalOverlay}>
          <TouchableOpacity style={styles.themeModalBackdrop} activeOpacity={1} onPress={() => setThemeModalVisible(false)} />
          <View style={[styles.themeModalSheet, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.themeModalTitle, { color: theme.colors.text }]}>Elegir tema</Text>
            {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.themeOption,
                  { backgroundColor: themeMode === mode ? theme.colors.primary + '22' : 'transparent' }
                ]}
                onPress={() => {
                  setThemeMode(mode);
                  setThemeModalVisible(false);
                }}
              >
                <MaterialIcons 
                  name={getThemeIcon(mode) as any} 
                  size={24} 
                  color={themeMode === mode ? theme.colors.primary : theme.colors.textSecondary} 
                />
                <Text style={[
                  styles.themeOptionText,
                  { color: themeMode === mode ? theme.colors.primary : theme.colors.text }
                ]}>
                  {getThemeLabel(mode)}
                </Text>
                {themeMode === mode && (
                  <MaterialIcons name="check" size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.themeModalClose}
              onPress={() => setThemeModalVisible(false)}
            />
          </View>
        </View>
      )}

      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.colors.border }]} onPress={logOut}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const { theme } = useTheme();
  
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.textSecondary,
        drawerStyle: { backgroundColor: theme.colors.surface },
        drawerLabelStyle: { color: theme.colors.text },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="profile" options={{ drawerLabel: 'Mi Perfil' }} />
      <Drawer.Screen name="(tabs)" options={{ drawerLabel: 'Juego' }} />
      <Drawer.Screen name="rules" options={{ drawerLabel: 'Reglas' }} />
      <Drawer.Screen name="stats" options={{ drawerLabel: 'Estadísticas' }} />
      <Drawer.Screen
          name="index"
          options={{
            drawerItemStyle: { height: 0 },
            drawerLabelStyle: { display: 'none' }
          }}
        />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
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
    marginLeft: 8,
    paddingRight: "10%",
  },
  menu: {
    flex: 1,
  },
  themeSection: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  themeButtonText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
    fontWeight: 'bold',
  },
  themeModalOverlay: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 1000,
  },
  themeModalBackdrop: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  themeModalSheet: {
    width: '95%',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    marginBottom: 18,
    alignItems: 'stretch',
    elevation: 10,
  },
  themeModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  themeOptionText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  themeModalClose: {
    marginTop: 10,
    alignSelf: 'center',
    padding: 8,
  },
  logoutButton: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#d00',
    fontWeight: 'bold',
  },
});
