import React, { useState, useEffect, useContext } from 'react';
import { TouchableOpacity, Text, View, FlatList, Image, StyleSheet, TextInput } from 'react-native';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { database } from '../firebaseConfig';
import { AppContext } from '../AppContext';
import { useNavigation } from '@react-navigation/native';

const ChatList = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { setChattingWith } = useContext(AppContext);
  const navigation = useNavigation();
  const chatBotId = "WyJen7wgwwXU8FvdHaKWyJen7wgwwXU8FvdHaKrdvs7N2Z2";

  useEffect(() => {
    const collectionRef = collection(database, 'users');
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedUsers = querySnapshot.docs.map((doc) => ({
        _id: doc.id,
        firstName: doc.data().firstName,
        lastName: doc.data().lastName,
        userId: doc.data().userId,
        avatar: doc.data().avatar,
        phoneNumber: doc.data().phoneNumber,
      }));

      const sortedUsers = fetchedUsers.sort((a, b) => {
        if (a.userId === chatBotId) return -1;
        if (b.userId === chatBotId) return 1;
        return 0;
      });

      setUsers(sortedUsers);
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
      return { uri: item.avatar[0] };
    }
    return { uri: item.avatar };
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.userContainer} onPress={() => handleUserClick(item)}>
      <Image source={getAvatar(item)} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{`${item.firstName} ${item.lastName}`}</Text>
        <Text style={styles.userId}>{item.phoneNumber}</Text>
      </View>
    </TouchableOpacity>
  );

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phoneNumber.includes(searchQuery)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chats</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search"
        value={searchQuery}
        onChangeText={()=>{}}
      />
      <FlatList
        data={filteredUsers}
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
  searchBar: {
    height: 40,
    borderColor: '#dddddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#ffffff',
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
