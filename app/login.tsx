import LoginBackground from "@/assets/svg/LoginBackground";
import Logo from "@/assets/svg/Logo";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
  const router = useRouter();
    return (
    
    <View style={styles.container}>
        <LoginBackground style={styles.background}/>
        <Logo style={styles.logo} width={300}/>
        <Text style={styles.title}>Bienvenido!</Text>
        <Text style={styles.subtitle}>Inicia sesión en tu cuenta</Text>
        <TextInput
            style={styles.textInput}
            placeholder="Correo electrónico"
            autoCapitalize="none"
            placeholderTextColor="#a3b1bd"

        />
        <TextInput
            style={styles.textInput}
            placeholder="Contraseña"
            secureTextEntry
            placeholderTextColor="#a3b1bd"
        />
        <TouchableOpacity>
            <Text style={styles.forgotPassword}>Olvido su contraseña?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={() => router.push("/home")}>
            <Text style={styles.loginButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>
        <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
                No tienes cuenta?
            </Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
                    <Text style={styles.registerLink}> Registrate</Text>
            </TouchableOpacity>
        </View>
        <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    background: {
        position: 'absolute',
        top: -20,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
    },
    logo: {
        position: 'absolute',
        top: -325,
        zIndex: 10,
    },
    title: {
        fontSize: 70,
        fontWeight: "bold",
        color: '#34434d',
        marginTop: 150,
    },
    subtitle:{
        fontSize: 20,
        color: 'grey',
        marginBottom: 23,
    },
    textInput: {
        padding: 10,
        paddingStart: 30,
        marginTop: 23,
        width: '80%',
        height: 50,
        borderRadius: 30,
        backgroundColor: '#fff',
        color: 'black',
        fontSize: 20,
    },
    forgotPassword: {
        color: 'grey',
        fontSize: 16,
        alignSelf: 'flex-end',
        marginRight: '-40%',
        marginTop: 13,
    },
    loginButton: {
        backgroundColor: '#5792EE',
        borderRadius: 30,
        paddingVertical: 15,
        paddingHorizontal: 40,
        alignItems: 'center',
        marginTop: 33,
        width: '80%',
    },
    loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    },
    registerContainer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    registerText:{
        color: 'grey',
        fontSize: 18,
    },
    registerLink: {
        color: '#5792EE',
        fontSize: 18,
    },
});