import React, { useState, useEffect, useCallback } from 'react';
import { TouchableOpacity, Text, View, Platform, TextInput, FlatList, Image } from 'react-native';
import { collection, addDoc, orderBy, query, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, database, storage } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const colors = {
  primary: '#f57c00',
  gray: '#C5C5C7',
  mediumGray: '#F6F7FB',
  lightGray: '#FAFAFA'
};

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const collectionRef = collection(database, 'chats');
    const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, querySnapshot => {
      setMessages(
        querySnapshot.docs.map(doc => ({
          _id: doc.id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user
        }))
      );
    });
    return unsubscribe;
  }, []);

  const onSend = useCallback(async () => {
    if (inputText.trim() === '') return;

    const message = {
      _id: Math.random().toString(),
      createdAt: new Date(),
      text: inputText,
      user: {
        _id: auth?.currentUser?.email,
        avatar: 'https://i.pravatar.cc/300',
      },
    };

    await addDoc(collection(database, 'chats'), message);
    setInputText('');
  }, [inputText]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const imageUrl = await uploadImage(result.uri);
      const message = {
        _id: Math.random().toString(),
        createdAt: new Date(),
        user: {
          _id: auth?.currentUser?.email,
          avatar: 'https://i.pravatar.cc/300',
        },
        image: imageUrl,
      };
      await addDoc(collection(database, 'chats'), message);
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const imageName = Math.random().toString(36).substring(7);
    const ref = storage.ref().child(`images/${imageName}`);
    await ref.put(blob);
    return ref.getDownloadURL();
  };

  const renderMessageItem = ({ item }) => {
    return (
      <View style={{ flexDirection: 'row', marginVertical: 5 }}>
        {item.image && (
          <Image source={{ uri: item.image }} style={{ width: 100, height: 100, borderRadius: 10, marginRight: 10 }} />
        )}
        <View style={{ backgroundColor: colors.lightGray, borderRadius: 10, padding: 10 }}>
          <Text>{item.text}</Text>
        </View>
      </View>
    );
  };

  const renderInputToolbar = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: colors.mediumGray }}>
        <TouchableOpacity onPress={pickImage}>
          <AntDesign name="upload" size={24} color={colors.gray} style={{ marginRight: 10 }} />
        </TouchableOpacity>
        <TextInput
          placeholder="Type a message..."
          style={{ flex: 1, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 15 }}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={onSend}
        />
        <TouchableOpacity onPress={onSend}>
          <AntDesign name="arrowup" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={item => item._id}
        inverted
      />
      {renderInputToolbar()}
    </View>
  );
}
