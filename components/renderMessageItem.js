import React, { useContext, useState } from "react";
import { TouchableOpacity, Text, View, Image, Alert, ActivityIndicator, Modal } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import ImageGallery from "./ImageGallery";
import { AppContext } from "../AppContext";
import { deleteMessage, UpdateMessage } from "../screens/utils";

const ImageRender = ({ file, onPress, onLongPress }) => {
  if (file.downloadURL.includes('jpg?alt=') || file.downloadURL.includes('png?alt=') || file.downloadURL.includes('jpeg?alt=') || file.downloadURL.includes('gif?alt=') || file.downloadURL.includes('webp?alt=')) {
    return (
      <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
        <Image source={{ uri: file.downloadURL }} style={{ width: 200, height: 200, borderRadius: 8 }} />
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
        <MaterialIcons name="insert-drive-file" size={24} color="black" />
      </TouchableOpacity>
    );
  }
};

const RenderMessageItem = ({ item }) => {
  const { userData } = useContext(AppContext);
  const isSender = item.user._id === userData?.userId;
  const isInProgress = item._id.startsWith('temp_');
  const [downloading, setDownloading] = useState({});
  const [isDownloaded, setIsDownloaded] = useState({});
  const [showGallery, setShowGallery] = useState(false);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const messageTime = item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleFileDownload = async (file) => {
    if (isDownloaded[file.downloadURL]) {
      // File is already downloaded, do nothing
      return;
    }
    try {
      setDownloading(prev => ({ ...prev, [file.downloadURL]: true }));
      const { uri } = await FileSystem.downloadAsync(file.downloadURL, FileSystem.documentDirectory + file.name);
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Download Complete', 'The file has been saved to your gallery.');
    } catch (error) {
      Alert.alert('Download Error', 'There was an error downloading the file.');
    } finally {
      setDownloading(prev => ({ ...prev, [file.downloadURL]: false }));
      setIsDownloaded(prev => ({ ...prev, [file.downloadURL]: true }));
    }
  };

  const handleFileOpen = (index) => {
    setCurrentGalleryIndex(index);
    setShowGallery(true);
  };

  const handleTextPress = () => {
    setShowOptionsModal(true);
  };

  const handleUpdate = () => {
    setShowOptionsModal(false);
  };

  const handleDelete = async () => {
    try {
      await deleteMessage(item, userData.userId);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  }

  const imageFiles = item.files.filter(file => 
    file.downloadURL && 
    (file.downloadURL.includes('jpg?alt=') || file.downloadURL.includes('png?alt=') || file.downloadURL.includes('jpeg?alt=') || file.downloadURL.includes('gif?alt=') || file.downloadURL.includes('webp?alt='))
  );

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
                  <ImageRender 
                    file={file} 
                    onPress={() => handleFileDownload(file)} 
                    onLongPress={() => isDownloaded[file.downloadURL] ? handleFileOpen(imageFiles.findIndex(imgFile => imgFile.downloadURL === file.downloadURL)) : handleFileDownload(file)} 
                  />
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
                  <TouchableOpacity 
                    onPress={() => handleFileDownload(file)} 
                    onLongPress={() => isDownloaded[file.downloadURL] ? handleFileOpen(imageFiles.findIndex(imgFile => imgFile.downloadURL === file.downloadURL)) : handleFileDownload(file)}
                  >
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
            <Modal visible={showGallery} transparent={true} onRequestClose={() => setShowGallery(false)}>
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' }}>
                <ImageGallery imageUris={imageFiles.map(file => file.downloadURL)} initialIndex={currentGalleryIndex} />
                <TouchableOpacity onPress={() => setShowGallery(false)} style={{ position: 'absolute', top: 40, right: 20 }}>
                  <AntDesign name="closecircle" size={30} color="white" />
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        ) : null}
        {item.text && (
          <TouchableOpacity onPress={handleTextPress}>
            <Text style={{ color: isSender ? 'black' : 'gray', marginTop: 8 }}>{item.text}</Text>
          </TouchableOpacity>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 8 }}>
          {isInProgress && <AntDesign name="clockcircleo" size={16} color="orange" />}
          {!isInProgress && isSender && <AntDesign name="checkcircle" size={16} color="green" />}
          <Text style={{ marginLeft: 8, color: 'gray', fontSize: 12 }}>{messageTime}</Text>
        </View>
      </View>
      <Modal visible={showOptionsModal} transparent={true} onRequestClose={() => setShowOptionsModal(false)}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
            <TouchableOpacity onPress={handleUpdate} style={{ padding: 10 }}>
              <Text style={{ fontSize: 18 }}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={{ padding: 10, marginTop: 10 }}>
              <Text style={{ fontSize: 18 }}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowOptionsModal(false)} style={{ padding: 10, marginTop: 20, alignItems: 'center' }}>
              <Text style={{ fontSize: 18, color: 'red' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RenderMessageItem;
