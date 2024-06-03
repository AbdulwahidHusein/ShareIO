import { collection,getFirestore, addDoc ,doc, setDoc, updateDoc,deleteDoc, getDocs, query, where } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { auth, database } from '../firebaseConfig';
import { uploadFiles } from '../FileUpload';
import { Alert } from 'react-native';

import { generate } from '../api';
// const {OpenAI} = require("openai");



export const onTextSend = async (inputText, messages, chattingWith, userData, setChatBotTyping) => {
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
    if (chattingWith === "WyJen7wgwwXU8FvdHaKWyJen7wgwwXU8FvdHaKrdvs7N2Z2") {
      setChatBotTyping(true);
      const response = await generate(inputText);
      const message = {
        user : {
          _id :  chattingWith
        },
        receiver : {
          _id : userData.userId
        },
        createdAt: new Date(),
        files: [], // Array to store file paths or references
        text: response

      }
      addDoc(collection(database, 'chats'), message).then (
        () => {
          setChatBotTyping(false);
        }
      )
    }
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

export const deleteMessage = async (messageItem, userId) => {
  if (messageItem.user._id != userId) {
    return;
  }
  const db = getFirestore();
  const chatsCollectionRef = collection(db, 'chats');

  const docReference = doc(chatsCollectionRef, messageItem._id);
 
  try {
    await deleteDoc(docReference);
    console.log('Message deleted successfully');
  } catch (error) {
    console.error('Error deleting message:', error);
  }

}

export const UpdateMessage = async (messageItem, userId, text) => {
  if (messageItem.user._id != userId) {
    return;
  }
  const db = getFirestore();
  const chatsCollectionRef = collection(db, 'chats');

  const docReference = doc(chatsCollectionRef, messageItem._id);
 
  try {
    await updateDoc(docReference,
      text
    );
    console.log('Message deleted successfully');
  } catch (error) {
    console.error('Error deleting message:', error);
  }
}


export async function get_next_response(history){

  await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: history
  }).then((completion) => {
      return completion.choices[0].message.content;
  })
}