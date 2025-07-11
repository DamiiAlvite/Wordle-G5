import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, } from "react-native";
import { useAuth } from "@/providers/authProvider";
import { supabase } from "@/lib/supabase";
import WavesBackground from "@/assets/svg/wavesBackground";
import TopBar from "@/components/topBar";
import UpdateUsernameModal from "@/components/modals/updateUsernameModal";
import UpdatePasswordModal from "@/components/modals/updatePasswordModal";
import DeleteAccountModal from "@/components/modals/deleteAccountModal";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function MiPerfil() {
  const { userId, username, refreshUserData } = useAuth();
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
    <View style={styles.container}>
      <WavesBackground style={styles.WavesBackground} pointerEvents="none" />
      <TopBar />
      <View style={styles.subcontainer}>
        <Text style={styles.title}>Mi Perfil</Text>
        <Text style={styles.subtitle}>Edita tu información</Text>
        <View style={styles.dataContainer}>
          <Text style={styles.label}>Correo</Text>
          <Text style={styles.userData}>{loading ? "Cargando..." : email}</Text>
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.label}>Usuario</Text>
          <Text style={styles.userData}>{loading ? "Cargando..." : username}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.updateButton} onPress={openUpdateUsernameModal}>
            <Text style={styles.ButtonText}>Modificar usuario</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.updateButton} onPress={openUpdatePasswordModal}>
            <Text style={styles.ButtonText}>Modificar contraseña</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={openDeleteAccountModal}>
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
    backgroundColor: "#d5e6ff",
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
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  title: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#34434d",
  },
  subtitle: {
    fontSize: 20,
    color: "grey",
    marginBottom: 20,
  },
  dataContainer: {
    width: "80%",
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    color: "grey",
    marginBottom: 8,
    marginLeft: 8,
  },
  userData: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "600",
    color: "#34434d",
  },
  buttonsContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  updateButton: {
    backgroundColor: "#5792EE",
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
    backgroundColor: '#d00',
    borderRadius: 12,
    margin: 16,
    padding: 12,
    alignItems: 'center',
    width: "80%",
  },
});