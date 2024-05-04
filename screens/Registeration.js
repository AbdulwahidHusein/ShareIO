import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Button, ActivityIndicator, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import {auth, database} from '../firebaseConfig';

const Registration = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  //additional fields
  const [avatar, setAvatar] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');


  const handleRegister = () => {
  if (
    firstName === '' ||
    lastName === '' ||
    phoneNumber === '' ||
    email === '' ||
    password === '' ||
    confirmPassword === ''
  ) {
    Alert.alert('Registration Error', 'Please fill in all fields');
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert('Registration Error', 'Passwords do not match');
    return;
  }

  setIsLoading(true);
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      // Save additional user data to the database
      saveUserInformation(user.uid, firstName, lastName, phoneNumber, avatar, age, gender);
      setIsLoading(false);
      Alert.alert('Registration Successful');
      navigation.navigate('ChatPage');
    })
    .catch((error) => {
      setIsLoading(false);
      Alert.alert('Registration Error', error.message);
    });
};

const saveUserInformation = (userId, firstName, lastName, phoneNumber, avatar, age, gender) => {
  // Save user information to the database
  // Modify this function to save the information to your desired database or storage
  // For example, you can use Firebase Realtime Database or Firestore
  addDoc(collection(database, 'users'), {
    firstName,
    lastName,
    phoneNumber,
    email,
    password,
    avatar,
    age,
    gender,
    userId,
    
  })
};

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>Registration</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          onChangeText={(text) => setFirstName(text)}
          value={firstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          onChangeText={(text) => setLastName(text)}
          value={lastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          onChangeText={(text) => setPhoneNumber(text)}
          value={phoneNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          onChangeText={(text) => setPhoneNumber(text)}
          value={phoneNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Avatar"
          onChangeText={(text) => setAvatar(text)}
          value={avatar}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          onChangeText={(text) => setAge(text)}
          value={age}
        />
        <TextInput
          style={styles.input}
          placeholder="Gender"
          onChangeText={(text) => setGender(text)}
          value={gender}
        />
        {isLoading ? (
          <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
        ) : (
          <Button title="Register" onPress={handleRegister} />
        )}
      </View>
      <Text style={styles.loginText}>Already have an account?</Text>
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Login
      </Text>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  formContainer: {
    width: '80%',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  link: {
    color: '#007bff',
    fontSize: 16,
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
  loginText: {
    marginTop: 20,
    fontSize: 14,
  },
  loader: {
    marginVertical: 20,
  },
});

export default Registration;