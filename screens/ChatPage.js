import React, { useState, useEffect, useCallback, useContext } from 'react';
import { TouchableOpacity, Text, View, TextInput, FlatList, Image, Alert, Modal } from 'react-native';
import { collection, addDoc, orderBy, query, where, onSnapshot } from 'firebase/firestore';
import { auth, database } from '../firebaseConfig';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { AppContext } from '../AppContext';
import FilePickerScreen from '../components/ImagePickerComp';
import { onTextSend, onFileSend, handleDownload } from '../screens/utils';
import RenderMessageItem from '../components/renderMessageItem';

const ChatPage = ({ isAiTab }) => {
  const [isFilePickerVisible, setIsFilePickerVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsloading] = useState(false);
  const { chattingWith, setChattingWith, userData } = useContext(AppContext);
  const [chatBotTyping, setChatBotTyping] = useState(false);

  const isAI = chattingWith.userId === "WyJen7wgwwXU8FvdHaKWyJen7wgwwXU8FvdHaKrdvs7N2Z2";

  useEffect(() => {
    const collectionRef = collection(database, 'chats');
    setIsloading(true);
    const unsubscribe = onSnapshot(
      query(
        collectionRef,
        orderBy('createdAt', 'desc'),
        where('receiver._id', 'in', [chattingWith?.userId || "none", userData?.userId || "none"]),
        where('user._id', 'in', [chattingWith?.userId || "none", userData?.userId || "none"])
      ),
      (querySnapshot) => {
        const allMessages = querySnapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
        }));
        setMessages(allMessages);
        setIsloading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [chattingWith, userData]);

  const updateMessages = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const textSendCallback = useCallback(() => {
    if (inputText.trim() !== '') {
      const newMessage = {
        _id: 'temp_' + Math.random().toString(),
        text: inputText,
        user: { _id: userData?.userId },
        createdAt: new Date(),
        files: [],
      };
      setInputText('');
      updateMessages(newMessage);

      onTextSend(inputText, messages, chattingWith?.userId, userData, setChatBotTyping)
        .then(() => {})
        .catch((error) => {
          console.error('Error sending message:', error);
        });
    }
  }, [inputText, messages, chattingWith?.userId, userData, updateMessages]);

  const handleFileUploadButton = () => {
    setIsFilePickerVisible(true);
  };

  const handleFilePickerClose = () => {
    setIsFilePickerVisible(false);
  };

  const getAvatar = (item) => {
    if (!item.avatar) {
      return require('../assets/icon.png');
    }
    if (Array.isArray(item.avatar)) {
      return { uri: item.avatar[0] };
    }
    return { uri: item.avatar };
  };

  const renderInputToolbar = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#f6f6f6' }}>
        <TouchableOpacity onPress={handleFileUploadButton}>
          <AntDesign name="upload" size={24} color="#8c8c8c" style={{ marginRight: 10 }} />
        </TouchableOpacity>
        <TextInput
          multiline={true}
          placeholder="Type a message..."
          style={{
            flex: 1,
            backgroundColor: '#fff',
            borderRadius: 20,
            paddingHorizontal: 15,
            fontSize: 16,
            color: '#333',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
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

  const renderProfileHeader = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: '#f0f0f0',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Image
          source={getAvatar(chattingWith)}
          style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
        />
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>
            {chattingWith?.firstName} {chattingWith?.lastName}
          </Text>
          <Text style={{ color: '#8c8c8c', fontSize: 14 }}>5m Ago</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f6f6f6' }}>
      {renderProfileHeader()}
      <FlatList
        data={messages.sort((a, b) => b.createdAt - a.createdAt)}
        renderItem={({ item }) => <RenderMessageItem item={item} />}
        keyExtractor={(item) => item._id}
        inverted
        contentContainerStyle={{ paddingVertical: 10 }}
      />
      {chatBotTyping && (
        <View style={{ marginLeft: 10, marginBottom: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#8c8c8c' }}>Typing...</Text>
        </View>
      )}
      <Modal visible={isFilePickerVisible} animationType="slide">
        <FilePickerScreen
          onSend={handleFilePickerClose}
          chattingWith={chattingWith?.userId}
          userId={userData?.userId}
          updateMessages={updateMessages}
        />
      </Modal>
      {renderInputToolbar()}
    </View>
  );
};

export default ChatPage;