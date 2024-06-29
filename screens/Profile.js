import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Image, ScrollView, ActivityIndicator } from 'react-native';
import { AppContext } from '../AppContext';
import { Feather } from '@expo/vector-icons'; 
import { auth } from "../firebaseConfig";
import { updateUserInformation } from './utils';
import ProfileUpdatePopup from '../components/ProfileUpdatePopup';
import { styles } from '../styles/profileStyle';
import { handleImagePick } from './utils';

const ProfilePage = () => {
  const { userData, setUserData } = useContext(AppContext);
  const [firstName, setFirstName] = useState(userData?.firstName || '');
  const [lastName, setLastName] = useState(userData?.lastName || '');
  const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber );
  const [email, setEmail] = useState(userData?.email || '');
  const [password, setPassword] = useState(userData?.password || '');
  const [profileDownloadUrl, setProfileDownloadUrl] = useState(userData?.avatar || '');
  const [gender, setGender] = useState(userData?.gender || "");
  const [userId, setUserId] = useState(userData?.userId || "");
  const [modalVisible, setModalVisible] = useState(false); // State for the modal visibility
  const [editenabled, setEditEnabled] = useState(false);
  const [age, setAge] = useState(userData?.age||0);
  const [loading, setLoading] = useState(false); // State for loading indicator

  const fallbackImage = 'https://via.placeholder.com/150';

  const handleUpdateProfile = () => {
    setLoading(true); // Show loading indicator
    updateUserInformation(userId, firstName, lastName, phoneNumber, gender, profileDownloadUrl)
      .then(() => {
        setLoading(false); // Hide loading indicator
        Alert.alert('Profile Updated.');
        setUserData({ ...userData, firstName, lastName, phoneNumber, email, password, gender, avatar: profileDownloadUrl });
      })
      .catch((err) => {
        setLoading(false); // Hide loading indicator
        Alert.alert('Error', err.message);
      });
  };

  const handleEditProfile = () => {
    editenabled ? setEditEnabled(false) : setEditEnabled(true)
  }

  const handleLogout = () => {
    Alert.alert("Logged out");
    auth.signOut();
    setUserData(null);
  }

  const getAvatar = () => {
    if (Array.isArray(profileDownloadUrl)) {
      return profileDownloadUrl[0];
    }
    return profileDownloadUrl;
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.logoutIcon} onPress={handleLogout} >
        <Feather name="log-out" size={25} color="red" />
        <Text>Sign out</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <TouchableOpacity style={styles.editIcon} onPress={handleEditProfile}>
          <Feather name="edit" size={24} color="#000" />
          <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleImagePick(setProfileDownloadUrl)}>
          <View style={styles.profileImageContainer}>
            <Image  source={{ uri: getAvatar() }} style={styles.profileImage} />
          </View>
        </TouchableOpacity>
        
        <Text style={styles.title}>{userData?.firstName} {userData?.lastName}</Text>
        <Text style={styles.subtitle}>{userData?.email}</Text>
      </View>

      {
        !editenabled &&
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
      }

      {editenabled &&
        <ProfileUpdatePopup
          setFirstName={setFirstName}
          setLastName={setLastName}
          setPhoneNumber={setPhoneNumber}
          setGender={setGender}
          setProfileDownloadUrl={setProfileDownloadUrl}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          isLoading={false} 
          gender={gender} 
          firstName={firstName}
          lastName={lastName}
          phoneNumber={phoneNumber}
          age={age}
          setAge={setAge}    
        />
      }

      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Update Profile</Text>
        )}
      </TouchableOpacity>
    
    </ScrollView>
  );
};

export default ProfilePage;
