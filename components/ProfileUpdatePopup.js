import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Image } from 'react-native';
import handleImagePick from '../screens/Registeration';

const ProfileUpdatePopup = ({
  setFirstName,
  setLastName,
  setPhoneNumber,
  setGender,
  gender,
  firstName,
  lastName,
  phoneNumber,
  age,
  setAge,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectGender = (gender) => {
    setGender(gender);
    setModalVisible(false);
  };
  const genders = ['Male', 'Female'];

  return (
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
        value={lastName}
        onChangeText={(text) => setLastName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        keyboardType='numeric' 
        onChangeText={(text) => setPhoneNumber(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        keyboardType='numeric' 
        onChangeText={(text) => setAge(text)}
      />
      
      {/* Gender selection */}
      <TouchableOpacity style={styles.dropdownButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.dropdownButtonText}>
          {gender ? "Gender " + gender : 'Select Gender'}
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
      <TouchableOpacity>
        <Text>Change Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileUpdatePopup;

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
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
    backgroundColor: '#f9f9f9',
  },
  dropdownButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#ebebeb',
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalOption: {
    paddingVertical: 10,
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
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
