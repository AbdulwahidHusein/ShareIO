import React, { useState, useEffect, useCallback, useContext } from 'react';
import { TouchableOpacity, Text, View, TextInput, FlatList, Image, Alert, Modal } from 'react-native';
import { collection, addDoc, orderBy, query, where, onSnapshot } from 'firebase/firestore';
import { auth, database } from '../firebaseConfig';
import { AntDesign } from '@expo/vector-icons';
import { AppContext } from '../AppContext';
import MessageItem from '../components/MessageItem';
import FilePickerScreen from '../components/ImagePickerComp';

import onTextSend from './utils';


const ChatPage = () => {
  const [isFilePickerVisible, setIsFilePickerVisible] = useState(false); 
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');


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
          createdAt: doc.data().createdAt.toDate(), 
        }));
        setMessages(allMessages);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [chattingWith, userData]);



  const textSendCallback = useCallback(() => {
    if (inputText.trim() !== '') {
      onTextSend(inputText, messages, chattingWith, userData);
      setInputText('');
    }
  }, [inputText, messages, chattingWith, userData]);

  const handleFileUploadButton = () => {
    setIsFilePickerVisible(true);
  };

  const handleFilePickerClose = () => {
    setIsFilePickerVisible(false);
  };

  const renderInputToolbar = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#F6F7FB' }}>
        <TouchableOpacity onPress={handleFileUploadButton}>
          <AntDesign name="upload" size={24} color="#C5C5C7" style={{ marginRight: 10 }} />
        </TouchableOpacity>
        <TextInput
          multiline={true}
          placeholder="Type a message..."
          style={{ flex: 1, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 15 }}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={textSendCallback}
        />
        <TouchableOpacity onPress={textSendCallback}>
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
      <Modal visible={isFilePickerVisible} animationType="slide">
        <FilePickerScreen onSend={handleFilePickerClose} chattingWith={chattingWith} userId={userData.userId} />
      </Modal>
      {renderInputToolbar()}
    </View>
  );
};

export default ChatPage;