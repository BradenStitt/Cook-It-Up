import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";

const LandingPage: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header Title */}
      <Text style={styles.header}>Cook It Up!</Text>

      <View style={styles.box}>
        {/* Username and Password Inputs */}
        <TextInput
          placeholder="Phone number, username, or email"
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
        />

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton}>
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
          <TouchableOpacity>
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
});

export default LandingPage;
