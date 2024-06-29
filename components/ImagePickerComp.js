import React, { useEffect, useState } from 'react';
import { Button, View, Image, Platform, StyleSheet, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import {uploadFiles, uploadFiles2} from '../FileUpload';
import { onTextSend, onFileSend2 } from '../screens/utils';

const FilePickerScreen = ({ onSend, userId, chattingWith, updateMessages }) => {
  const [caption, setCaption] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (libraryStatus.status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }

        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus.status !== 'granted') {
          alert('Sorry, we need camera permissions to make this work!');
        }
      }
    })();
  }, []);

  const SendFile = () => {
    const fileDataArray = selectedFiles.map(file => [file.uri, file.name, file.uri.length]);
  
    uploadFiles2(fileDataArray, userId)
      .then(fileData => {
        onFileSend2(fileData, chattingWith, userId, caption);
      })
      .catch(error => {
        console.error('Error uploading files:', error);
      });
  
    const message = {
      _id: "temp_" + Math.random().toString(),
      text: caption,
      user: {
        _id: userId,
      },
      receiver: {
        _id: chattingWith,
      },
      createdAt: new Date(),
      files: selectedFiles.map(file => file.uri),
      createdAt: new Date(),
    };
  
    updateMessages(message);
    onSend();
  };

  const pickFile = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({});
      if (!result.cancelled) {
        setSelectedFiles([...selectedFiles, { uri: result.assets[0].uri, name: result.assets[0].name }]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const removeFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  return (
    <View style={styles.container}>
    <TouchableOpacity style={styles.cancelButton} onPress={() => onSend()}><Text>Cancel</Text></TouchableOpacity>

      <Button title="+ Pick a file" onPress={pickFile} />

      {selectedFiles.length > 0 ? (
        selectedFiles.map((file, index) => (
          <View key={index} style={styles.fileContainer}>
            {file.uri && (file.uri.endsWith('.jpg') || file.uri.endsWith('.jpeg') || file.uri.endsWith('.png')) ? (
              <Image source={{ uri: file.uri }} style={styles.fileIcon} />
            ) : (
              <Image source={require('../assets/file-icon.png')} style={styles.fileIcon} />
            )}
            <Text style={styles.fileName}>{file.name}</Text>
            <TouchableOpacity onPress={() => removeFile(index)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noFileText}>No files selected</Text>
      )}

      {selectedFiles.length > 0 && (
        <View style={styles.captionContainer}>
          <TextInput
            style={styles.captionInput}
            placeholder="Enter caption"
            onChangeText={(text) => setCaption(text)}
            value={caption}
          />
          <TouchableOpacity onPress={SendFile} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default FilePickerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  fileIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  fileName: {
    fontSize: 16,
    flex: 1,
  },
  removeButton: {
    marginRight: 10,
    fontSize: 25,
  },
  removeButtonText: {
    fontSize: 18,
    color: 'red',
  },
  captionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  captionInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noFileText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
  cancelButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    marginTop: 10,
    backgroundColor: '#b32610',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  }
});