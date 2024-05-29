import { TextInput, View, Modal, TouchableOpacity, Text } from 'react-native';
import React, { useState } from 'react';

const PromptCaption = ({ onClose, onConfirm }) => {
  const [caption, setCaption] = useState('');

  const handleConfirm = () => {
    onConfirm(caption);
    setCaption('');
    onClose();
  };

  return (
    <Modal visible={true} animationType="slide" transparent={true}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      
        <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' }}>
          <TextInput
            placeholder="Enter a caption"
            value={caption}
            onChangeText={setCaption}
            multiline={true}
            numberOfLines={4}
            style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 20, fontSize: 16, color: '#333' }}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity onPress={onClose} style={{ marginRight: 10 }}>
              <Text style={{ color: '#ff0000', fontSize: 16, fontWeight: 'bold' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm}>
              <Text style={{ color: '#0000ff', fontSize: 16, fontWeight: 'bold' }}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PromptCaption;