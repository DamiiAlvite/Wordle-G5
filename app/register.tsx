import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Register() {
    const router = useRouter();
    
  return (
    <View style={styles.container}>
        <View style={styles.subcontainer}>
      <Text style={styles.title}>Registrate</Text>
      <Text style={styles.subtitle}>Crea tu cuenta</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Nombre de usuario"
        autoCapitalize="none"
        placeholderTextColor="#a3b1bd"
      />
      <TextInput
        style={styles.textInput}
        placeholder="Correo electrónico"
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#a3b1bd"
      />
      <TextInput
        style={styles.textInput}
        placeholder="Contraseña"
        secureTextEntry
        placeholderTextColor="#a3b1bd"
      />
      <TextInput
        style={styles.textInput}
        placeholder="Repetir contraseña"
        secureTextEntry
        placeholderTextColor="#a3b1bd"
      />
      <TouchableOpacity style={styles.registerButton}>
        <Text style={styles.registerButtonText}>Registrarse</Text>
      </TouchableOpacity>
      </View>
      <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
                Ya tienes cuenta?
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.loginLink}> Inicia sesión</Text>
            </TouchableOpacity>
        </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d5e6ff",
  },
  subcontainer: {
    marginTop: '-20%',
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
  textInput: {
    padding: 10,
    paddingStart: 30,
    marginTop: 20,
    width: "80%",
    height: 50,
    borderRadius: 30,
    backgroundColor: "#fff",
    color: "black",
    fontSize: 20,
  },
  registerButton: {
    backgroundColor: "#5792EE",
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: "center",
    marginTop: 30,
    width: "80%",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginContainer: {
    position: 'absolute',
    bottom: 30,
    width: "100%",
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: "grey",
    fontSize: 18,
  },
  loginLink: {
    color: "#5792EE",
    fontSize: 18,
  },
});