import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import {
  useNavigation,
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";
import { supabase } from "../lib/supabase"; // Adjust the path as needed

const LandingPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("User").select("*");
      if (error) {
        throw error;
      }
      setUsers(data);
    } catch (error) {
      Alert.alert("Error", (error as any).message);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      // Sign in the user
      const { data, error } = await supabase
        .from("User")
        .select("*")
        .eq("email", email)
        .eq("password", password);

      if (error) {
        throw error;
      }

      if (data) {
        Alert.alert("Success", "Login successful!");
        navigation.navigate("CreateScreen", { userId: data[0].id }); // Pass userId to the next screen
      } else {
        Alert.alert("Error", "Invalid email or password");
      }
    } catch (error) {
      Alert.alert("Error", (error as any).message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Title */}
      <Text style={styles.header}>Cook It Up!</Text>

      <View style={styles.box}>
        {/* Email Input */}
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        {/* Password Input */}
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>

        {/* OR Divider */}
        <Text style={styles.orText}>OR</Text>

        {/* Forgot Password Link */}
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Signup Container */}
        <View style={styles.signupContainer}>
          <Text>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("RegisterPage")}>
            <Text style={styles.signupText}>Sign up</Text>
          </TouchableOpacity>
        </View>

        {/* Get the App Section */}
        <Text style={styles.getAppText}>Get the app.</Text>

        <View style={styles.appIconsContainer}>
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg",
            }}
            style={styles.appIcon}
          />
        </View>
      </View>

      {/* Display Users */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userContainer}>
            <Text style={styles.userText}>{item.name}</Text>
            <Text style={styles.userText}>{item.email}</Text>
          </View>
        )}
      />
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
  box: {
    width: "90%",
    maxWidth: 400,
    padding: 20,
    textAlign: "center",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    backgroundColor: "#fff",
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
  loginButton: {
    width: "90%",
    paddingVertical: 10,
    backgroundColor: "#3897f0",
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
  },
  orText: {
    color: "#999",
    marginVertical: 20,
  },
  forgotPassword: {
    color: "#00376b",
    marginTop: 10,
    textDecorationLine: "underline",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  signupText: {
    color: "#00376b",
    fontWeight: "bold",
    marginLeft: 5,
    textDecorationLine: "underline",
  },
  getAppText: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 14,
    color: "#999",
  },
  appIconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  appIcon: {
    width: 120,
    height: 40,
    resizeMode: "contain",
  },
  userContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userText: {
    fontSize: 16,
  },
});

export default LandingPage;
