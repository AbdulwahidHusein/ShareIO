import React, { useState, useEffect, useCallback, useContext } from 'react';
import { TouchableOpacity, Text, View, TextInput, FlatList, Image, Alert } from 'react-native';
import { collection, addDoc, orderBy, query, where, onSnapshot } from 'firebase/firestore';
import { auth, database } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { AppContext } from '../AppContext';
import { uploadImage, pickImage } from '../FileUpload';
import MessageItem from '../components/MessageItem';
import PromptCaption from '../components/PromptCaption';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [caption, setCaption] = useState(null);

  const navigation = useNavigation();
  const { chattingWith, userData } = useContext(AppContext);

  useEffect(() => {
    const collectionRef = collection(database, 'chats');
    const unsubscribe = onSnapshot(
      query(
        collectionRef,
        orderBy('createdAt', 'desc'),
        where('receiver._id', 'in', [chattingWith, userData.userId]),
        where('user._id', 'in', [chattingWith, userData.userId])
      ),
      (querySnapshot) => {
        const allMessages = querySnapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(), // Convert Firestore timestamp to JavaScript Date
        }));
        setMessages(allMessages);
      }
    );

    return () => {
      unsubscribe();
    };
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
        avatar: '',
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

  const handleCaptionConfirm = (caption) => {
    setCaption(caption);
  };

  const handlePromptClose = () => {
    setShowPrompt(false);
  };

  const sendImage = async () => {
    try {
      const uri = await pickImage();
      if (uri) {
        setShowPrompt(true);
        const path = `images/${userData?.userId}${new Date().getTime()}.jpg`;
        const url = await uploadImage(uri, path);
        if (url) {
          const message = {
            text: caption,
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
        } else {
          Alert("unsuccessful upload");
        }
      }
    } catch (error) {
      console.error('Error sending image:', error);
    }
  };

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
    return <MessageItem isSender={item.user._id === userData.userId} item={item} />;
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={messages.sort((a, b) => b.createdAt - a.createdAt)}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item._id}
        inverted
      />
      {renderInputToolbar()}
      {showPrompt && <PromptCaption onClose={handlePromptClose} onConfirm={handleCaptionConfirm} />}
    </View>
  );
};

export default ChatPage;
