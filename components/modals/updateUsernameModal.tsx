import React from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Modal, Alert } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@/providers/authProvider";
import { supabase } from "@/lib/supabase";

interface UpdateUsernameModalProps {
  visible: boolean;
  onClose: () => void;
}
type FormData = {
  newUsername: string;
  password: string;
};


export default function UpdateUsernameModal({ visible, onClose }: UpdateUsernameModalProps) {
  const { userId, refreshUserData } = useAuth();
  const { control, handleSubmit, formState: { errors }, setError, reset } = useForm<FormData>({
    defaultValues: {
      newUsername: "",
      password: ""
    }
  });
  const onSubmit = async ({ newUsername, password }: FormData) => {
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

      const { error: updateError } = await supabase
        .from("user")
        .update({ name: newUsername })
        .eq("user_id", userId);
      if (updateError) {
        console.error(updateError);
        Alert.alert("Error", "No se pudo actualizar el nombre de usuario.");
        return;
      }

      Alert.alert("Éxito", "Nombre de usuario actualizado.");
      await refreshUserData();
      reset();
      onClose();
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Error inesperado.");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal transparent visible={visible} onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Modificar nombre de usuario</Text>
          <View style={styles.modalContent}>

            <Controller
              control={control}
              name="newUsername"
              rules={{ required: "El nombre es obligatorio" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Nuevo nombre de usuario"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#a3b1bd"
                />
              )}
            />
            {errors.newUsername && (
              <Text style={styles.error}>{errors.newUsername.message}</Text>
            )}

            <Controller
              control={control}
              name="password"
              rules={{ required: "La contraseña es obligatoria" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Ingrese su contraseña"
                  secureTextEntry
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#a3b1bd"
                />
              )}
            />
            {errors.password && (
              <Text style={styles.error}>{errors.password.message}</Text>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
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
    backgroundColor: "#f9f9f9",
    fontSize: 16,
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
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