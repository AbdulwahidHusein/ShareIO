import { collection, addDoc } from 'firebase/firestore';
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