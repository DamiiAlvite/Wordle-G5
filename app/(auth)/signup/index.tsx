import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useForm, Controller, set } from "react-hook-form";
import { supabase } from "@/lib/supabase";

type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  const { control, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      if (error) {
        throw error;
      }else {
        const user = await supabase.auth.getUser();
        const userId = user.data.user?.id;
        if (userId) {
          const { error: userInsertError } = await supabase
            .from("user")
            .insert([{ user_id: userId, name: data.username }]);
          if (userInsertError) {
            setError("Error al guardar el nombre de usuario");
            return;
          }
        }
      }
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (loginError) {
        throw loginError;
      }

    } catch (error) {
        setError(error instanceof Error ? error.message : "Error al registrarse");
    }
};

  return (
    <View style={styles.container}>
      <View style={styles.subcontainer}>
        <Text style={styles.title}>Registrate</Text>
        <Text style={styles.subtitle}>Crea tu cuenta</Text>

        <Controller
          control={control}
          name="username"
          rules={{ required: "El nombre de usuario es obligatorio" }}
          render={({ field: { onChange, value } }) => (
          <View style={{ width: "100%", alignItems: "center" }}>
            <TextInput
              style={styles.textInput}
              placeholder="Nombre de usuario"
              autoCapitalize="none"
              placeholderTextColor="#a3b1bd"
              value={value}
              onChangeText={onChange}
            />
            {errors.username && <Text style={styles.inputError}>{errors.username.message}</Text>}
          </View>
          )}
        />

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
                style={styles.textInput}
                placeholder="Correo electrónico"
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="#a3b1bd"
                value={value}
                onChangeText={onChange}
              />
              {errors.email && (
                <Text style={styles.inputError}>{errors.email.message}</Text>
              )}
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
                style={styles.textInput}
                placeholder="Contraseña"
                secureTextEntry
                placeholderTextColor="#a3b1bd"
                value={value}
                onChangeText={onChange}
              />
              {errors.password && <Text style={styles.inputError}>{errors.password.message}</Text>}
            </View>
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: "Repite la contraseña",
            validate: value =>
              value === watch("password") || "Las contraseñas no coinciden",
          }}
          render={({ field: { onChange, value } }) => (
            <View style={{ width: "100%", alignItems: "center" }}>
              <TextInput
                style={styles.textInput}
                placeholder="Repetir contraseña"
                secureTextEntry
                placeholderTextColor="#a3b1bd"
                value={value}
                onChangeText={onChange}
              />
              {errors.confirmPassword && <Text style={styles.inputError}>{errors.confirmPassword.message}</Text>}
            </View>
          )}
        />

        <TouchableOpacity style={styles.registerButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.registerButtonText}>Registrarse</Text>
        </TouchableOpacity>
        {error && <Text style={styles.inputError}>{error}</Text>}
      </View>
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>
          Ya tienes cuenta?
        </Text>
        <TouchableOpacity onPress={() => router.replace("/signin")}>
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
    marginTop: 30,
    width: "80%",
    height: 50,
    borderRadius: 20,
    backgroundColor: "#fff",
    color: "black",
    fontSize: 20,
  },
  registerButton: {
    backgroundColor: "#5792EE",
    borderRadius: 20,
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