import React, { useState, useEffect, useContext } from 'react';
import { Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import firebase, { database } from '../firebaseConfig';
import { AppContext } from '../AppContext';
import {
  collection,
  query,
  where,
  onSnapshot,
  getDoc
} from 'firebase/firestore';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUserData } = useContext(AppContext);

  const handleLogin = async () => {
    setLoading(true);
    const auth = getAuth(firebase);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      const collectionRef = collection(database, 'users');
      const q = query(collectionRef, where('email', '==', email)); // Only query by email

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (querySnapshot.empty) {
          console.error('User not found in Firestore'); // Handle case where user exists in auth but not Firestore
          return;
        }

        const userData = querySnapshot.docs.map((doc) => doc.data());
        setUserData(userData[0]); // Assuming only one document for the user (update if needed)
      });

      setLoading(false);
      Alert.alert('Login Successful');
    } catch (error) {
      setLoading(false);
      Alert.alert('Login Error', error.message);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.formContainer}>
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
        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
        <Text style={styles.registerText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
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
  button: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loader: {
    marginVertical: 20,
  },
  registerText: {
    marginTop: 20,
    color: '#007bff',
    fontSize: 14,
  },
};

export default Login;