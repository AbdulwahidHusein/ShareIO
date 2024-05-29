import { collection,getFirestore, addDoc ,doc, setDoc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { auth, database } from '../firebaseConfig';
import { uploadFiles } from '../FileUpload';
import { Alert } from 'react-native';

export const onTextSend = async (inputText, messages, chattingWith, userData) => {
  const message = {
    text: inputText,
    user: {
      _id: userData.userId,
    },
    receiver: {
      _id: chattingWith,
    },
    createdAt: new Date(),
    files: [], // Array to store file paths or references
  };

  try {
    await addDoc(collection(database, 'chats'), message);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

export const onFileSend = async (fileUris, chattingWith, userId, caption) => {
  const message = {
    text: caption,
    user: {
      _id: userId,
    },
    receiver: {
      _id: chattingWith,
    },
    createdAt: new Date(),
    files: fileUris, 
  };

  try {
    await addDoc(collection(database, 'chats'), message);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};


export async function updateUserInformation(
  userId,
  firstName,
  lastName,
  phoneNumber,
  gender,
  avatar
) {
  const db = getFirestore();
  const usersCollectionRef = collection(database, 'users');

  try {
    // Query to find the document with the matching userId field
    const q = query(usersCollectionRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No matching documents found.');
      return;
    }

    // Assuming userId is unique, get the first matching document
    const userDoc = querySnapshot.docs[0];
    const userDocumentRef = doc(db, 'users', userDoc.id);

    // Update the document
    await updateDoc(userDocumentRef, {
      firstName,
      lastName,
      phoneNumber,
      gender,
      avatar,
    });

    console.log('User information updated successfully');
  } catch (err) {
    console.log('Error updating user information:', err.message);
  }
}


export const onFileSend2 = async (fileData, chattingWith, userId, caption) => {
  const message = {
    text: caption,
    user: {
      _id: userId,
    },
    receiver: {
      _id: chattingWith,
    },
    createdAt: new Date(),
    files: fileData, 
  };

  try {
    await addDoc(collection(database, 'chats'), message);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};


export const handleDownload = async (uri) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const fileName = uri.split('/').pop();
  return { blob, fileName };
}


export const handleImagePick = async (setProfileDownloadUrl) => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (permissionResult.granted === false) {
    Alert.alert('Image Picker Permission Denied', 'Please allow access to the photo library in your device settings.');
    return;
  }

  ImagePicker.launchImageLibraryAsync().then(
    (result) => {
      uploadFiles([result.assets[0].uri], "profile-picture").then((result) =>{

        if (!result.cancelled) {
          setProfileDownloadUrl(result[0]);
        }
      }

      )
    }
  )

};
