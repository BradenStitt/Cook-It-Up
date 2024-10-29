import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RegisterPage: React.FC = () => {
  const navigation = useNavigation();

  // Form state for each field
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Submit handler
  const handleRegister = () => {
    if (firstName && lastName && email && username && password) {
      // Redirect to the login page after successful registration
      navigation.navigate('LandingPage.tsx');
      Alert.alert('Registration Successful', 'You have been registered successfully!');
    } else {
      Alert.alert('Registration Failed', 'Please fill out all fields.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Register</Text>

      <View style={styles.box}>
        <TextInput
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />
        <TextInput
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        <View style={styles.loginRedirectContainer}>
          <Text>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('LandingPage')}>
            <Text style={styles.loginRedirectText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  box: {
    width: '90%',
    maxWidth: 400,
    padding: 20,
    textAlign: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    backgroundColor: '#fff',
  },
  input: {
    width: '90%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: '#FAFAFA',
  },
  registerButton: {
    width: '90%',
    paddingVertical: 10,
    backgroundColor: '#3897f0',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
  },
  loginRedirectContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginRedirectText: {
    color: '#00376b',
    fontWeight: 'bold',
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
});

export default RegisterPage;