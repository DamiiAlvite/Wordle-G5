import React from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Modal, Alert } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@/providers/authProvider";
import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/context/themeContext";

interface deleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
}
type FormData = {
  email: string;
  password: string;
};

export default function deleteAccounteModal({ visible, onClose }: deleteAccountModalProps) {
  const { theme } = useTheme();
  const { control, handleSubmit, formState: { errors }, setError, reset } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: ""
    }
  });
  const onSubmit = async ({ password }: FormData) => {
    try {
      const { data: userData, error: authError } = await supabase.auth.getUser();
      if (authError || !userData?.user?.email) {
        throw new Error("No se pudo obtener el email del usuario.");
      }
      const email = userData.user.email;
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (loginError) {
        setError("password", {
          type: "manual",
          message: "Contraseña incorrecta."
        });
        return;
      }
      const { error: deleteError } = await supabase
        .from('user')
        .delete()
        .eq('user_id', userData.user.id);
      if (deleteError) {
        console.error(deleteError);
        Alert.alert("Error", "No se pudo eliminar la cuenta.");
        return;
      }
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error('Error al cerrar sesión:', signOutError);
      }
      await supabase.auth.signOut();
      await AsyncStorage.removeItem("@supabase.auth.token");
      reset();
      onClose();
      Alert.alert("Éxito", "Cuenta eliminada exitosamente.");
    } catch (err: any) {
      console.error('Error inesperado:', err);
      Alert.alert("Error", "Ocurrió un error inesperado.");
    }
  };
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: theme.colors.overlay }]}>
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Está seguro de eliminar su cuenta?</Text>
          <View style={styles.modalContent}>
            <Controller
              control={control}
              name="password"
              rules={{ required: "La contraseña es obligatoria" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.colors.card,
                    color: theme.colors.text,
                    borderColor: theme.colors.border 
                  }]}
                  placeholder="Ingrese su contraseña"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  placeholderTextColor={theme.colors.textSecondary}
                />
              )}
            />
            {errors.password && (
              <Text style={styles.error}>{errors.password.message}</Text>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                <Text style={styles.buttonText}>ELIMINAR</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.cancelButton, { backgroundColor: theme.colors.primary }]} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    width: "80%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
  },
  buttonContainer: {
    marginTop: 15,
    width: "100%",
  },
  button: {
    backgroundColor: "#d00",
    borderRadius: 10,
    width: "100%",
    padding: 10,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    color: "red",
    fontSize: 13,
    alignSelf: "flex-start",
    marginLeft: 8,
  },
});