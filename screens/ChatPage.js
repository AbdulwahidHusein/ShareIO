import React, { useState, useEffect, useCallback, useContext } from 'react';
import { TouchableOpacity, Text, View, TextInput, FlatList, Image } from 'react-native';
import { collection, addDoc, orderBy, query, where, onSnapshot } from 'firebase/firestore';
import { auth, database, storage } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { AppContext } from '../AppContext';

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
      await addDoc(collection(database, 'chats'), message);
      setInputText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [inputText, chattingWith, userData]);
  

  const renderMessageItem = ({ item }) => {
    return (
      <View style={{ flexDirection: 'row', marginVertical: 5 }}>
        {item.image && (
          <Image source={{ uri: item.image }} style={{ width: 100, height: 100, borderRadius: 10, marginRight: 10 }} />
        )}
        <View style={{ backgroundColor: '#FAFAFA', borderRadius: 10, padding: 10 }}>
          <Text>{item.text}</Text>
        </View>
      </View>
    );
  };
  const pickImage = () =>{
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    }).then((result) => {
      if (!result.cancelled) {
        const imageUrl = result.uri;
        const message = {
          _id: Math.random().toString(),
          createdAt: new Date(),
          user: {
            _id: userData.userId,
            avatar: userData.avatar || 'https://i.pravatar.cc/300',
          },
          image: imageUrl,
        };
        addDoc(collection(database, 'chats'), message);
      }
    });
  }

  const renderInputToolbar = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#F6F7FB' }}>
        <TouchableOpacity onPress={pickImage}>
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
