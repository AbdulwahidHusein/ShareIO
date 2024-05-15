import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { AppContext } from '../AppContext';
import { Feather } from '@expo/vector-icons'; // Assuming you have Feather icons installed

const ProfilePage = () => {
  const { userData, setUserData } = useContext(AppContext);
  const [name, setName] = useState(userData?.firstName || '');
  const [email, setEmail] = useState(userData?.email || '');
  
  // Fallback profile image URL
  const fallbackImage = 'https://via.placeholder.com/150';

  const handleUpdateProfile = () => {
    // Perform validation and update user data logic here
    // For simplicity, let's assume the validation passes

    // Update the user data in the context
    setUserData({ ...userData, firstName: name, email });

    // Show success message
    Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.editIcon} onPress={() => {}}>
          <Feather name="edit" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: userData?.avatar || fallbackImage }} style={styles.profileImage} />
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
          <Text style={styles.value}>{userData?.password}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

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
};

export default ProfilePage;
