import React, { useState, useEffect, useCallback, useContext } from 'react';
import { TouchableOpacity, Text, View, TextInput, FlatList, Image, Alert, Modal } from 'react-native';
import { collection, addDoc, orderBy, query, where, onSnapshot } from 'firebase/firestore';
import { auth, database } from '../firebaseConfig';
import { AntDesign, MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons
import { AppContext } from '../AppContext';
import FilePickerScreen from '../components/ImagePickerComp';
import { onTextSend, onFileSend, handleDownload } from '../screens/utils';
import RenderMessageItem from '../components/renderMessageItem';

          {() => <ChatPage isAiTab={true} />}
const ChatPage = ({isAiTab}) => {
  const [isFilePickerVisible, setIsFilePickerVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsloading] = useState(false);
  const { chattingWith, setChattingWith, userData } = useContext(AppContext);

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

      onTextSend(inputText, messages, chattingWith?.userId, userData, isAI)
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

  const renderProfileHeader = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
        <Image
          source={{ uri: "https://picsum.photos/200/300" }}
          style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
        />
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{chattingWith?.firstName} {chattingWith?.lastName}</Text>
        <Text style={{marginLeft: 40}} > 5m Ago</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, marginTop: 10 }}>
      {renderProfileHeader()}
      <FlatList
        data={messages.sort((a, b) => b.createdAt - a.createdAt)}
        renderItem={({ item }) => <RenderMessageItem item={item} />}
        keyExtractor={(item) => item._id}
        inverted
      />
      <Modal visible={isFilePickerVisible} animationType="slide">
        <FilePickerScreen onSend={handleFilePickerClose} chattingWith={chattingWith?.userId} userId={userData?.userId} updateMessages={updateMessages} />
      </Modal>
      {renderInputToolbar()}
    </View>
  );
};

export default ChatPage;
