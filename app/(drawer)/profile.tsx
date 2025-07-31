import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, } from "react-native";
import { useAuth } from "@/providers/authProvider";
import { supabase } from "@/lib/supabase";
import WavesBackground from "@/assets/svg/wavesBackground";
import TopBar from "@/components/topBar";
import UpdateUsernameModal from "@/components/modals/updateUsernameModal";
import UpdatePasswordModal from "@/components/modals/updatePasswordModal";
import DeleteAccountModal from "@/components/modals/deleteAccountModal";
import { useTheme } from "@/context/themeContext";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function MiPerfil() {
  const { userId, username, refreshUserData } = useAuth();
  const { theme } = useTheme();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const getUser = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const { data, error: userError } = await supabase.auth.getUser();
      if (userError || !data.user) {
        throw new Error("No se pudo obtener el usuario autenticado.");
      }
      setEmail(data.user.email || "");
    } catch (error) {
      console.error('Error inesperado:', error);
      Alert.alert("Error", "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };
  const [isUpdateUsernameModalVisible, setIsUpdateUsernameModalVisible] = useState(false);
  const openUpdateUsernameModal = () => {
    setIsUpdateUsernameModalVisible(true);
  };
  const closeUpdateUsernameModal = () => {
    setIsUpdateUsernameModalVisible(false);
  };
  const [isUpdatePasswordModalVisible, setIsUpdatePasswordModalVisible] = useState(false);
  const openUpdatePasswordModal = () => {
    setIsUpdatePasswordModalVisible(true);
  };
  const closeUpdatePasswordModal = () => {
    setIsUpdatePasswordModalVisible(false);
  };
  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] = useState(false);
  const openDeleteAccountModal = () => {
    setIsDeleteAccountModalVisible(true);
  };
  const closeDeleteAccountModal = () => {
    setIsDeleteAccountModalVisible(false);
  };

  useEffect(() => {
    if (userId) {
      getUser();
    } else {
      Alert.alert("Error", "No se pudo obtener el ID de usuario.");
      setLoading(false);
    }
  }, [userId]);



  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <WavesBackground style={styles.WavesBackground} waveColor={theme.colors.waves} pointerEvents="none" />
      <TopBar />
      <View style={[styles.subcontainer, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Mi Perfil</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Edita tu información</Text>
        <View style={styles.dataContainer}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Correo</Text>
          <Text style={[styles.userData, { color: theme.colors.text }]}>{loading ? "Cargando..." : email}</Text>
        </View>
        <View style={styles.dataContainer}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Usuario</Text>
          <Text style={[styles.userData, { color: theme.colors.text }]}>{loading ? "Cargando..." : username}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.updateButton, { backgroundColor: theme.colors.primary }]} onPress={openUpdateUsernameModal}>
            <Text style={styles.ButtonText}>Modificar usuario</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.updateButton, { backgroundColor: theme.colors.primary }]} onPress={openUpdatePasswordModal}>
            <Text style={styles.ButtonText}>Modificar contraseña</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.deleteButton, { backgroundColor: theme.colors.error }]} onPress={openDeleteAccountModal}>
            <Text style={styles.ButtonText}>Eliminar cuenta</Text>
          </TouchableOpacity>
        </View>
        <UpdateUsernameModal onClose={closeUpdateUsernameModal} visible={isUpdateUsernameModalVisible} />
        <UpdatePasswordModal onClose={closeUpdatePasswordModal} visible={isUpdatePasswordModalVisible} />
        <DeleteAccountModal onClose={closeDeleteAccountModal} visible={isDeleteAccountModalVisible} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  WavesBackground: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  subcontainer: {
    marginTop: '10%',
    width: "80%",
    paddingVertical: 40,
    alignItems: "center",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: 60,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  dataContainer: {
    width: "80%",
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginLeft: 8,
  },
  userData: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "600",
  },
  buttonsContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  updateButton: {
    borderRadius: 12,
    margin: 16,
    padding: 12,
    alignItems: "center",
    width: "80%",
  },
  ButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteButton: {
    borderRadius: 12,
    margin: 16,
    padding: 12,
    alignItems: 'center',
    width: "80%",
  },
});