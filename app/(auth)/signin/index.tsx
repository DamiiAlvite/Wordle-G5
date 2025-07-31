import LoginBackground from "@/assets/svg/LoginBackground";
import Logo from "@/assets/svg/LogoWhite";
import LogoBlack from "@/assets/svg/LogoBlack";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/context/themeContext";

type FormData = {
  email: string;
  password: string;
};

export default function Login() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const systemColorScheme = useColorScheme();
  const { theme } = useTheme();
  const isDark = systemColorScheme === 'dark';

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <LoginBackground style={styles.background} pointerEvents="none" />
      <View style={styles.solidBackground} pointerEvents="none" />
      <Logo style={styles.logo} width={300} pointerEvents="none" />
      <Text style={[styles.title, { color: isDark ? '#ffffff' : '#34434d' }]}>Bienvenido!</Text>
      <Text style={[styles.subtitle, { color: isDark ? '#b0b0b0' : 'grey' }]}>Inicia sesión en tu cuenta</Text>

      <Controller
        control={control}
        name="email"
        rules={{
          required: "El correo es obligatorio",
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: "Correo inválido",
          },
        }}
        render={({ field: { onChange, value } }) => (
          <View style={{ width: "100%", alignItems: "center" }}>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: theme.colors.border,
                color: isDark ? '#ffffff' : '#000000'
              }]}
              placeholder="Correo electrónico"
              autoCapitalize="none"
              placeholderTextColor={theme.colors.textSecondary}
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
            />
            {errors.email && <Text style={styles.inputError}>{errors.email.message}</Text>}
          </View>
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{
          required: "La contraseña es obligatoria",
          minLength: { value: 6, message: "Mínimo 6 caracteres" },
        }}
        render={({ field: { onChange, value } }) => (
          <View style={{ width: "100%", alignItems: "center" }}>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: theme.colors.border,
                color: isDark ? '#ffffff' : '#000000'
              }]}
              placeholder="Contraseña"
              secureTextEntry
              placeholderTextColor={theme.colors.textSecondary}
              value={value}
              onChangeText={onChange}
            />
            {errors.password && <Text style={styles.inputError}>{errors.password.message}</Text>}
          </View>
        )}
      />

      <TouchableOpacity>
        <Text style={[styles.forgotPassword, { color: isDark ? '#b0b0b0' : 'grey' }]}>Olvido su contraseña?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.loginButtonText}>Iniciar sesión</Text>
      </TouchableOpacity>
      {error && <Text style={styles.inputError}>{error}</Text>}

      <View style={styles.registerContainer}>
        <Text style={[styles.registerText, { color: isDark ? '#b0b0b0' : 'grey' }]}>
          No tienes cuenta?
        </Text>
        <TouchableOpacity onPress={() => router.push("/signup")}>
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
  solidBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '5%',
    backgroundColor: '#245CC7',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  logo: {
    position: 'absolute',
    top: 50, // Ajusta según necesidad
    alignSelf: 'center',
  },
  title: {
    fontSize: 70,
    fontWeight: "bold",
    color: '#34434d',
    marginTop: 200, // Ajusta según necesidad
  },
  subtitle: {
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
    borderRadius: 20,
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
    borderRadius: 20,
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
  registerText: {
    color: 'grey',
    fontSize: 18,
  },
  registerLink: {
    color: '#5792EE',
    fontSize: 18,
  },
  inputError: {
    color: "red",
    marginTop: 5,
    marginLeft: "10%",
    fontSize: 13,
    width: "80%",
    textAlign: "left",
    alignSelf: "center",
  },
});