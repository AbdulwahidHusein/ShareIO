import React, { useState, useEffect, useCallback, useContext } from 'react';
import { TouchableOpacity, Text, View, TextInput, FlatList, Image } from 'react-native';
import { collection, addDoc, orderBy, query, where, onSnapshot } from 'firebase/firestore';
import { auth, database } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { AppContext } from '../AppContext';
import { uploadImage, pickImage } from '../FileUpload';
import MessageItem  from '../components/MessageItem';


const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const navigation = useNavigation();
  const { chattingWith, userData } = useContext(AppContext);

  useEffect(() => {
    if (!chattingWith || !userData) return;

    const collectionRef = collection(database, 'chats');
    const q = query(
      collectionRef,
      orderBy('createdAt', 'desc'),
      where('receiver._id', '==', chattingWith),
      where('user._id', '==', userData.userId)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newMessages = querySnapshot.docs.map((doc) => ({
        _id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(), // Convert Firestore timestamp to JavaScript Date
      }));
      setMessages(newMessages);
    });

    return unsubscribe;
  }, [chattingWith, userData]);

  const onSend = useCallback(async () => {
    if (!inputText.trim() || !chattingWith || !userData) return;
  
    const message = {
      text: inputText,
      user: {
        _id: userData.userId,
        avatar: userData.avatar || 'https://i.pravatar.cc/300',
      },
      receiver: {
        _id: chattingWith,
        avatar: '', // Add receiver's avatar if available
      },
      createdAt: new Date(),
    };
  
    try {
      setInputText('');
      await addDoc(collection(database, 'chats'), message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [inputText, chattingWith, userData]);
  

 
  
  const sendImage = async () => {
    try{
      uri = await pickImage();
      if(uri){
        const path = `images/${userData?.userId}${new Date().getTime()}.jpg`;
        const url = await uploadImage(uri, path);
        if(url){
          const message = {
            text: '',
            image: url,
            user: {
              _id: userData.userId,
              avatar: userData.avatar || 'https://i.pravatar.cc/300',
            },
            receiver: {
              _id: chattingWith,
              avatar: '', // Add receiver's avatar if available
            },
            createdAt: new Date(),
          };
          await addDoc(collection(database, 'images'), message);
        }
      }
    }
    catch (error) {
      console.error('Error sending image:', error);
    }
    
  }

  const renderInputToolbar = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#F6F7FB' }}>
        <TouchableOpacity onPress={sendImage}>
          <AntDesign name="upload" size={24} color="#C5C5C7" style={{ marginRight: 10 }} />
        </TouchableOpacity>
        <TextInput
          placeholder="Type a message..."
          style={{ flex: 1, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 15 }}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={onSend}
        />
        <TouchableOpacity onPress={onSend}>
          <AntDesign name="arrowup" size={24} color="#f57c00" />
        </TouchableOpacity>
      </View>
    );
  };
  const renderMessageItem = ({ item }) => {
    return <MessageItem item={item} />;
  };


  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item._id}
        inverted
      />
      {renderInputToolbar()}
    </View>
  );
};

export default ChatPage;
