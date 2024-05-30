import React, { useState, useContext } from 'react';
import { View, TextInput, Modal, Text, StyleSheet, TouchableOpacity, Alert, Image, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
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
  const [profileUri, setProfileUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profileDownloadUrl, setProfileDownloadUrl] = useState('');
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
      gender === ''
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
        saveUserInformation(user.uid, firstName, lastName, phoneNumber);
        setIsLoading(false);
        Alert.alert('Registration Successful');
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
      gender,
      userId,
      avatar: profileDownloadUrl,
    });
    setUserData({ firstName, lastName, phoneNumber, email, password, gender, userId, avatar: profileDownloadUrl[0] });
  };

  return (
    <ScrollView>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              source={require('../assets/appicon.jpg')}
              style={styles.headerImg}
              resizeMode="contain"
            />
            <Text style={styles.title}>
              Create an Account
            </Text>
            <Text style={styles.subtitle}>
              Join us and get started
            </Text>
          </View>
          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(text) => setFirstName(text)}
                placeholder="First Name"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={firstName}
              />
            </View>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(text) => setLastName(text)}
                placeholder="Last Name"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={lastName}
              />
            </View>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                keyboardType="phone-pad"
                onChangeText={(text) => setPhoneNumber(text)}
                placeholder="Phone Number"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={phoneNumber}
              />
            </View>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                keyboardType="email-address"
                onChangeText={(text) => setEmail(text)}
                placeholder="Email"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={email}
              />
            </View>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(text) => setPassword(text)}
                placeholder="Password"
                placeholderTextColor="#6b7280"
                secureTextEntry={true}
                style={styles.inputControl}
                value={password}
              />
            </View>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(text) => setConfirmPassword(text)}
                placeholder="Confirm Password"
                placeholderTextColor="#6b7280"
                secureTextEntry={true}
                style={styles.inputControl}
                value={confirmPassword}
              />
            </View>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Gender</Text>
              <TouchableOpacity style={styles.dropdownButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.dropdownButtonText}>
                  {gender ? "Gender: " + gender : 'Select Gender'}
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
            </View>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Profile Picture</Text>
              <TouchableOpacity style={styles.profileButton} onPress={handleImagePick}>
                <Text style={styles.buttonText}>Select Profile Picture</Text>
              </TouchableOpacity>
              {profileUri !== '' && (
                <Image source={{ uri: profileUri }} style={styles.profileImage} />
              )}
            </View>
            <View style={styles.formAction}>
              <TouchableOpacity style={styles.btn} onPress={handleRegister}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Register</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Login');
            }}
            style={{ marginTop: 'auto' }}
          >
            <Text style={styles.formFooter}>
              Already have an account?{' '}
              <Text style={{ textDecorationLine: 'underline' }}>Log in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Registration;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  title: {
    fontSize: 31,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36,
  },
  headerImg: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 36,
  },
  form: {
    marginBottom: 24,
    paddingHorizontal: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#075eec',
    textAlign: 'center',
  },
  formFooter: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  inputControl: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#C9D3DB',
    borderStyle: 'solid',
  },
  dropdownButton: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#C9D3DB',
    borderStyle: 'solid',
    justifyContent: 'center',
  },
  dropdownButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  profileButton: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#C9D3DB',
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 16,
    alignSelf: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#075eec',
    borderColor: '#075eec',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
});
