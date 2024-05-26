import { collection,getFirestore, addDoc ,doc, setDoc, updateDoc} from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import { auth, database } from '../firebaseConfig';
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
  const userRef = doc(db, 'users', userId);

  try {
    await updateDoc(userRef, {
      firstName,
      lastName,
      phoneNumber,
      gender,
      avatar,
    });
  } catch (err) {
    console.log("Error updating user information:", err.message);
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