import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef();

  const handleMessageSend = () => {
    if (inputText.trim() === '') {
      return;
    }

    const newMessage = {
      id: Math.random().toString(),
      text: inputText,
      isOutgoing: true,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText('');
  };

  useEffect(() => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, [messages]);

  const renderItem = ({ item }) => {
    const messageContainerStyle = item.isOutgoing ? styles.outgoingMessageContainer : styles.incomingMessageContainer;
    const messageTextStyle = item.isOutgoing ? styles.outgoingMessageText : styles.incomingMessageText;

    return (
      <View style={messageContainerStyle}>
        <Text style={messageTextStyle}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContentContainer}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      >
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.fileUploadButton}>
          <MaterialIcons name="attach-file" size={24} color="#007bff" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={inputText}
          onChangeText={(text) => setInputText(text)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleMessageSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContentContainer: {
    paddingVertical: 10,
  },
  outgoingMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  incomingMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  outgoingMessageText: {
    fontSize: 16,
    color: '#fff',
  },
  incomingMessageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  fileUploadButton: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007bff',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatPage;