import React, { useContext, useState } from "react";
import { TouchableOpacity, Text, View, Image, Alert, ActivityIndicator } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

import { AppContext } from "../AppContext";

const ImageRender = ({ file, onPress }) => {
  if (file.downloadURL.includes('jpg?alt=') || file.downloadURL.includes('png?alt=') || file.downloadURL.includes('jpeg?alt=') || file.downloadURL.includes('gif?alt=') || file.downloadURL.includes('webp?alt=')) {
    return (
      <TouchableOpacity onPress={onPress}>
        <Image source={{ uri: file.downloadURL }} style={{ width: 200, height: 200, borderRadius: 8 }} />
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity onPress={onPress}>
        <MaterialIcons name="insert-drive-file" size={24} color="black" />
      </TouchableOpacity>
    );
  }
};

const RenderMessageItem = ({ item }) => {
  const { userData } = useContext(AppContext);
  const isSender = item.user._id === userData?.userId;
  const isImageFile = item.files.some((file) => typeof file === 'object' && file.downloadURL && (file.downloadURL.includes('jpeg?alt=') || file.downloadURL.includes('png?alt=')));

  const isInProgress = item._id.startsWith('temp_');
  const [downloading, setDownloading] = useState({});

  const messageTime = item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleFileDownload = async (file) => {
    try {
      setDownloading(prev => ({ ...prev, [file.downloadURL]: true }));
      const { uri } = await FileSystem.downloadAsync(file.downloadURL, FileSystem.documentDirectory + file.name);
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Download Complete', 'The file has been saved to your gallery.');
    } catch (error) {
      Alert.alert('Download Error', 'There was an error downloading the file.');
    } finally {
      setDownloading(prev => ({ ...prev, [file.downloadURL]: false }));
    }
  };

  return (
    <View style={{ alignItems: isSender ? 'flex-end' : 'flex-start', marginBottom: 16 }}>
      <View
        style={{
          maxWidth: '80%',
          borderRadius: 7,
          backgroundColor: isSender ? '#DCF8C6' : '#F1F0F0',
          padding: 12,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,
          elevation: 4,
        }}
      >
        {item.files.length > 0 ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            {item.files.map((file, index) => (
              typeof file === 'object' && file.downloadURL ? (
                <View key={index} style={{ marginBottom: 8 }}>
                  <ImageRender file={file} onPress={() => handleFileDownload(file)} />
                  {downloading[file.downloadURL] && (
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                      <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                  )}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                    <Text style={{ color: 'gray', fontSize: 12 }}>{file.name}</Text>
                    <Text style={{ color: 'gray', fontSize: 12 }}>{(file.size / 1024).toFixed(2)} Mb</Text>
                  </View>
                </View>
              ) : (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <AntDesign name="file1" size={24} color="black" style={{ marginRight: 8 }} />
                  <TouchableOpacity onPress={() => handleFileDownload(file)}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: 'gray' }}>{file.name}</Text>
                      <Text style={{ color: 'gray', fontSize: 12 }}>{(file.size / 1024).toFixed(2)} Mb</Text>
                    </View>
                  </TouchableOpacity>
                  {downloading[file.downloadURL] && (
                    <ActivityIndicator size="small" color="#0000ff" style={{ marginLeft: 8 }} />
                  )}
                </View>
              )
            ))}
          </View>
        ) : null}
        {item.text && <Text style={{ color: isSender ? 'black' : 'gray', marginTop: 8 }}>{item.text}</Text>}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 8 }}>
          {isInProgress && <AntDesign name="clockcircleo" size={16} color="orange" />}
          {!isInProgress && isSender && <AntDesign name="checkcircle" size={16} color="green" />}
          <Text style={{ marginLeft: 8, color: 'gray', fontSize: 12 }}>{messageTime}</Text>
        </View>
      </View>
    </View>
  );
};

export default RenderMessageItem;
