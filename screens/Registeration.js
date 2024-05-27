import React, { useState, useContext } from 'react';
import { View, TextInput,Modal, Text, StyleSheet, TouchableOpacity, Alert,Image, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { addDoc, collection } from 'firebase/firestore';
import { auth, database } from '../firebaseConfig';
import { AppContext } from '../AppContext';
import { uploadFiles } from '../FileUpload';

const Registration = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileUri, setProfileUri] = useState(''); // Added profileUri state
  const [isLoading, setIsLoading] = useState(false);
  const [profileDownloadUrl, setProfileDownloadUrl] = useState("");
  const [gender, setGender] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const { setUserData } = useContext(AppContext);


  const genders = ['Male', 'Female'];
  const selectGender = (selectedGender) => {
    setGender(selectedGender);
    setModalVisible(false);
  };



  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Image Picker Permission Denied', 'Please allow access to the photo library in your device settings.');
      return;
    }

    const imageResult = await ImagePicker.launchImageLibraryAsync();

    if (!imageResult.cancelled) {
      setProfileUri(imageResult.assets[0].uri);
    }
  };

 const handleRegister = async () => {
    if (
      firstName === '' ||
      lastName === '' ||
      phoneNumber === '' ||
      email === '' ||
      password === '' ||
      confirmPassword === '' ||
      gender === '' // Added gender validation
    ) {
      Alert.alert('Registration Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Registration Error', 'Passwords do not match');
      return;
    }
    setIsLoading(true);
    const downloadUrl = await uploadFiles([profileUri], "profile-picture");
    setProfileDownloadUrl(downloadUrl);

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // Save additional user data to the database
        saveUserInformation(user.uid, firstName, lastName, phoneNumber);
        setIsLoading(false);
        Alert.alert('Registration Successful');
        navigation.navigate('ChatPage');
      })
      .catch((error) => {
        setIsLoading(false);
        Alert.alert('Registration Error', error.message);
      });
  };

  const saveUserInformation = (userId, firstName, lastName, phoneNumber) => {
    addDoc(collection(database, 'users'), {
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      gender, // Save gender to the database
      userId,
      avatar : profileDownloadUrl
    });
    setUserData({ firstName, lastName, phoneNumber, email, password, gender, userId , avatar:profileDownloadUrl[0]}); // Update user data
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
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
        {/* Gender selection */}
        <TouchableOpacity style={styles.dropdownButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.dropdownButtonText}>
           {gender ?"Gender " + gender : 'Select Gender'}
        </Text>
      </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {genders.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => selectGender(option)}
              >
                <Text style={styles.modalOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
        
        {/* Profile picture selection */}
        <TouchableOpacity style={styles.ProfileButton} onPress={handleImagePick}>
          <Text style={styles.buttonText}>Select Profile Picture</Text>
        </TouchableOpacity>
        {/* Display selected profile picture */}
        {profileUri !== '' && (
          <Image source={{ uri: profileUri }} style={styles.profileImage}/>
        )}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
            Log in
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3897f0',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#666',
  },
  link: {
    color: '#3897f0',
    textDecorationLine: 'underline',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 70,
  },
  
  dropdownButton: {
    width: 200,
    height: 40,
    backgroundColor: '#ebebeb',
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
  },
  modalOption: {
    paddingVertical: 10,
  },
  modalOptionText: {
    fontSize: 16,
  },
  ProfileButton: {
    margin: 20,
    backgroundColor: '#0f456e',
    width : 150, 
    height:30,
    borderRadius: 5,
    marginLeft: 40,
  
  }
});

export default Registration;