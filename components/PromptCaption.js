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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
          <TextInput
            placeholder="Enter a caption"
            value={caption}
            onChangeText={setCaption}
            style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 20 }}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity onPress={onClose} style={{ marginRight: 10 }}>
              <Text style={{ color: 'red' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm}>
              <Text style={{ color: 'blue' }}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PromptCaption;