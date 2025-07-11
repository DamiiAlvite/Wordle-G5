import React from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Modal, Alert } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@/providers/authProvider";
import { supabase } from "@/lib/supabase";

interface UpdatePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}
type FormData = {
  email: string;
  password: string;
  newPassword: string;
  repeatNewPassword: string;
};

export default function UpdatePasswordModal({ visible, onClose }: UpdatePasswordModalProps) {
  const { userId, refreshUserData } = useAuth();
  const { control, handleSubmit, formState: { errors }, setError, reset } = useForm<FormData>({
    defaultValues: {
      password: "",
      newPassword: "",
      repeatNewPassword: ""
    }
  });
  const onSubmit = async ({ password, newPassword, repeatNewPassword }: FormData) => {
    try {
      if (newPassword !== repeatNewPassword) {
        setError("repeatNewPassword", {
          type: "manual",
          message: "Las contraseñas no coinciden."
        });
        return;
      }
      if (newPassword == password) {
        setError("repeatNewPassword", {
          type: "manual",
          message: "Las contraseña no puede ser la actual."
        });
        return;
      }
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
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) {
        Alert.alert("Error", "No se pudo actualizar la contraseña.");
        return;
      }
      Alert.alert("Éxito", "La contraseña ha sido actualizada.");
      reset();
      onClose();

    } catch (error) {
      console.error("Error inesperado:", error);
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
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Modificar contraseña</Text>
          <View style={styles.modalContent}>
            <Controller
              control={control}
              name="password"
              rules={{ required: "La contraseña es obligatoria" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña actual"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                />
              )}
            />
            {errors.password && (
              <Text style={styles.error}>{errors.password.message}</Text>
            )}
            <Controller
              control={control}
              name="newPassword"
              rules={{ required: "La nueva contraseña es obligatoria" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Nueva contraseña"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                />
              )}
            />
            {errors.newPassword && (
              <Text style={styles.error}>{errors.newPassword.message}</Text>
            )}
            <Controller
              control={control}
              name="repeatNewPassword"
              rules={{ required: "Repetir la nueva contraseña es obligatorio" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Repita nueva contraseña"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                />
              )}
            />
            {errors.repeatNewPassword && (
              <Text style={styles.error}>{errors.repeatNewPassword.message}</Text>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                <Text style={styles.buttonText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
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
    backgroundColor: "white",
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
    color: "#34434d",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginTop: 15,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#5792EE",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    padding: 15,
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#d00",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    padding: 15,
    flex: 1,
    alignItems: "center",
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