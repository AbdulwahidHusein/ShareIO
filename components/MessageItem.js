import React from 'react';
import { View, Text, Image } from 'react-native';

const MessageItem = ({ item }) => {
  return (
    <View style={{ flexDirection: 'row', marginVertical: 5 }}>
      {item.image && (
        <Image source={{ uri: item.image }} style={{ width: 100, height: 100, borderRadius: 10, marginRight: 10 }} />
      )}
      <View style={{ backgroundColor: '#FAFAFA', borderRadius: 10, padding: 10 }}>
        <Text>{item.text}</Text>
      </View>
    </View>
  );
};

export default MessageItem;