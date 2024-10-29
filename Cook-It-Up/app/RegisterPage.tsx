import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { supabase } from "../lib/supabase";
import {
  useNavigation,
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";

const RegisterPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      // Insert user into the Supabase table
      const { error } = await supabase
        .from("User")
        .insert([{ email, name, password }]);

      if (error) {
        throw error;
      }

      const { data } = await supabase
        .from("User")
        .select("*")
        .eq("email", email)
        .eq("password", password);

      Alert.alert("Success", "User registered successfully!");
      if (data) {
        navigation.navigate("CreateScreen", { userId: data[0].id }); // Pass userId to the next screen
      } else {
        throw new Error("User registration failed, no data returned.");
      }
    } catch (error) {
      Alert.alert("Error", (error as any).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Register</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "90%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: "#FAFAFA",
  },
  registerButton: {
    width: "90%",
    paddingVertical: 10,
    backgroundColor: "#3897f0",
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default RegisterPage;
