import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const MessageItem = ({ item, isSender }) => {
  const sentTime = item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={[styles.container, isSender ? styles.sentContainer : styles.receivedContainer]}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.image} />
      )}
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.sentTime}>{sentTime}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 5,
    maxWidth: '100%', 
  },
  sentContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end', // Align to the most right border
  },
  receivedContainer: {
    justifyContent: 'flex-start',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  messageContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 10,
    maxWidth: '70%',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  sentTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    textAlign: 'right',
  },
});

export default MessageItem;
