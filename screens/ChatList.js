import React, { useState, useEffect, useContext } from 'react';
import { TouchableOpacity, Text, View, FlatList, Image, StyleSheet } from 'react-native';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { database } from '../firebaseConfig';
import { AppContext } from '../AppContext';
import { useNavigation } from '@react-navigation/native';

const ChatList = () => {
  const [users, setUsers] = useState([]);
  const { setChattingWith } = useContext(AppContext);
  const navigation = useNavigation();


  useEffect(() => {
    const collectionRef = collection(database, 'users');
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setUsers(
        querySnapshot.docs.map((doc) => ({
          _id: doc.id,
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          userId: doc.data().userId,
          avatar: doc.data().avatar,
          phoneNumber: doc.data().phoneNumber,
        }))
      );
    });

    return unsubscribe;
  }, []);

  const handleUserClick = (user) => {
    setChattingWith(user);
    navigation.navigate('Chat');
  };

  const getRandomAvatar = () => {
    const avatars = [
      require('../assets/icon.png'),
    ];
    const randomIndex = Math.floor(Math.random() * avatars.length);
    return avatars[randomIndex];
  };

  const getAvatar = (item) => {
    if (!item.avatar) {
      return getRandomAvatar();
    }
    if (Array.isArray(item.avatar)) {
      return getRandomAvatar();;
    }
    return getRandomAvatar();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.userContainer} onPress={() => handleUserClick(item)}>
      <Image source={getRandomAvatar()} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{`${item.firstName} ${item.lastName}`}</Text>
        <Text style={styles.userId}>{item.phoneNumber}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
    <Text style={styles.header}>Chats</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#dddddd',
    paddingBottom: 10,
  },
  listContainer: {
    paddingTop: 8,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
  },
  userId: {
    fontSize: 14,
    color: '#888888',
  },
});

export default ChatList;


