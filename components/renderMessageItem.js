import React,{ useContext } from "react";
import { TouchableOpacity, Text, View, TextInput, FlatList, Image, Alert, Modal } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons

import { AppContext } from "../AppContext";


const RenderMessageItem = ({ item }) => {
    const { userData } = useContext(AppContext);
    const isSender = item.user._id === userData.userId;
    const isImageFile = item.files.some((file) => {
      return file.includes('jpeg?alt=') || file.includes('png?alt=');
    });

    const isInProgress = item._id.startsWith('temp_');

    const messageTime = item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
          {item.files.length > 0 && isImageFile? (
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {isInProgress && <AntDesign name="clockcircleo" size={16} color="orange" />}
            {!isInProgress && isSender && <AntDesign name="checkcircle" size={16} color="green" />}
            <Text style={{ marginLeft: 5, color: 'gray', fontSize: 12 }}>{messageTime}</Text>
          </View>
        </View>
      </View>
    );
  };

export default RenderMessageItem;