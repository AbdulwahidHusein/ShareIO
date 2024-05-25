import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, Button, ScrollView } from 'react-native';
import { AppContext } from '../AppContext';
import { Feather } from '@expo/vector-icons'; 
import {auth, database} from "../firebaseConfig";
import { setDoc, collection } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { updateUserInformation } from './utils';

const ProfilePage = () => {
  const { userData, setUserData } = useContext(AppContext);
  const [firstName, setFirstName] = useState(userData?.firstName || '');
  const [lastName, setLastName] = useState(userData?.lastName || '');
  const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber + '00');
  const [email, setEmail] = useState(userData?.email || '');
  const [password, setPassword] = useState(userData?.password || '');
  const [profileDownloadUrl, setProfileDownloadUrl] = useState(userData?.avatar || '');
  const [gender, setGender] = useState(userData?.gender || "");
  const [userId, setUserId] = useState(userData?.userId || "");
  const [profileUri, setProfileUri] = useState("");

  const fallbackImage = 'https://via.placeholder.com/150';
  const handleUpdateProfile = () => {
    updateUserInformation(userId, firstName, lastName, phoneNumber, gender, profileDownloadUrl).then
    (
      (response) =>{
        Alert.alert('Profile Updated.');
      }
    ).catch(
      (err) =>{
        Alert.alert('Error', err.message);
      }
    );
    setUserData({ ...userData, firstName, lastName, phoneNumber, email, password, gender, avatar: profileDownloadUrl });
  };

  const handleLogout = () => {
    Alert.alert("logged out");
    auth.signOut();
    setUserData(null);
  }
  const getAvatar = () => {
    if (Array.isArray(userData?.avatar)) {
      return userData.avatar[0];
    }
    return userData?.avatar || fallbackImage;
  };
  
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.logoutIcon} onPress={handleLogout} >
        <Feather name="log-out" size={25} color="red" />
        <Text>sign out</Text>
      </TouchableOpacity>
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.editIcon} onPress={handleUpdateProfile}>
          <Feather name="edit" size={24} color="#000" />
          <Text>Edit</Text>
        </TouchableOpacity>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: getAvatar() }} style={styles.profileImage} />
        </View>
        
        <Text style={styles.title}>{userData?.firstName} {userData?.lastName}</Text>
        <Text style={styles.subtitle}>{userData?.email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Gender</Text>
          <Text style={styles.value}>{userData?.gender}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Age</Text>
          <Text style={styles.value}>{userData?.age}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Phone Number</Text>
          <Text style={styles.value}>{userData?.phoneNumber}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Password</Text>
          <Text style={styles.value}>{".".repeat(userData?.password.length)}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfilePage;

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    marginBottom: 15,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  editIcon: {
    position: 'absolute',
    top: 30,
    right: 20,
  },
  infoContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#666',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 15,
    marginHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutIcon: {
    paddingTop : 10,
    marginLeft: 10
  },
};
