import React, { useState, useEffect, useCallback, useContext } from 'react';
import { TouchableOpacity, Text, View, TextInput, FlatList, Image, Alert, Modal } from 'react-native';
import { collection, addDoc, orderBy, query, where, onSnapshot } from 'firebase/firestore';
import { auth, database } from '../firebaseConfig';
import { AntDesign } from '@expo/vector-icons';
import { AppContext } from '../AppContext';
import FilePickerScreen from '../components/ImagePickerComp';
import { onTextSend, onFileSend } from '../screens/utils';


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


  const updateMessages = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }

  const textSendCallback = useCallback(() => {
    if (inputText.trim() !== '') {
      const newMessage = {
        _id: "temp_" + Math.random().toString(),
        text: inputText,
        user: { _id: userData.userId },
        createdAt: new Date(),
        files:[],
      };
      setInputText('');
      updateMessages(newMessage); 
  
      onTextSend(inputText, messages, chattingWith, userData)
        .then(() => {
        })
        .catch(error => {
          console.error('Error sending message:', error);
        });
    }
  }, [inputText, messages, chattingWith, userData, updateMessages]);

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
    const isSender = item.user._id === userData.userId;
    const isImageFile = item.files.some((file) => {
      return file.includes('jpeg?alt=') || file.includes('png?alt=');
    });
  
    // Check if the message is in-progress (not yet sent)
    const isInProgress = item._id.startsWith('temp_');
  
    return (
      <View style={{ alignItems: isSender ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
        <View
          style={{
            maxWidth: '80%',
            borderRadius: 10,
            backgroundColor: isSender ? '#DCF8C6' : '#F1F0F0',
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          {item.files.length > 0 && isImageFile ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {item.files.map((file, index) => (
                <Image key={index} source={{ uri: file }} style={{ width: 80, height: 80, margin: 5 }} />
              ))}
            </View>
          ) : null}
          {item.files.length > 0 && !isImageFile ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AntDesign name="file1" size={24} color="black" style={{ marginRight: 5 }} />
              <Text>{item.files.join(', ')}</Text>
            </View>
          ) : null}
          <Text style={{ color: isSender ? 'black' : 'gray', marginTop: 5 }}>{item.text}</Text>
          {isInProgress && <AntDesign name="clockcircleo" size={16} color="orange" />}
          {!isInProgress && isSender && <AntDesign name="checkcircle" size={16} color="green" />}
        </View>
      </View>
    );
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
        <FilePickerScreen onSend={handleFilePickerClose} chattingWith={chattingWith} userId={userData.userId} updateMessages = {updateMessages} />
      </Modal>
      {renderInputToolbar()}
    </View>
  );
};

export default ChatPage;