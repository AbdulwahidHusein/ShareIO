import React, { useState, useEffect, useContext } from 'react';
import { TouchableOpacity, Text, View, FlatList, Image, StyleSheet, TextInput, Alert } from 'react-native';
import { collection, query, onSnapshot, where, getDocs } from 'firebase/firestore';
import { database } from '../firebaseConfig';
import { AppContext } from '../AppContext';
import { useNavigation } from '@react-navigation/native';

const ChatList = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { setChattingWith, userData } = useContext(AppContext);
  const [currentPriority, setCurrentPriority] = useState(0);
  const navigation = useNavigation();
  const chatBotId = "WyJen7wgwwXU8FvdHaKWyJen7wgwwXU8FvdHaKrdvs7N2Z2";


  const getUserByEmail = async (email) => {
    const userCollectionRef = collection(database, 'users');
    const querySnapshot = await getDocs(query(userCollectionRef, where('email', '==', email)));
    if (querySnapshot.empty) {
      return null; 
    } else {
      const doc =  querySnapshot.docs[0];
      setCurrentPriority(currentPriority + 1);
      return (
        {
          _id: doc.id,
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          userId: doc.data().userId,
          avatar: doc.data().avatar,
          phoneNumber: doc.data().phoneNumber,
          email : doc.data().email,
          priprity: doc.data().userId == chatBotId ? 100 : currentPriority
        }
      )
    }
  };
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // const chatCollectionRef = collection(database, 'chats');
        // const chatSnapshot = await getDocs(chatCollectionRef);

        // const chatUserIds = new Set();
        // chatSnapshot.forEach((doc) => {
        //   const data = doc.data();
        //   chatUserIds.add(data.user._id);
        //   chatUserIds.add(data.receiver._id);
         
        // });

        // const userCollectionRef = collection(database, 'users');
        // const userQueries = [...chatUserIds].map(userId => query(userCollectionRef, where('userId', '==', userId)));
        
        const fetchedUsers = [];

        const userCollection = collection(database, 'users');
        const snapshot = await getDocs(userCollection);

        snapshot.forEach(
          (doc) =>{
            fetchedUsers.push({
              _id: doc.id,
              firstName: doc.data().firstName,
              lastName: doc.data().lastName,
              userId: doc.data().userId,
              avatar: doc.data().avatar,
              phoneNumber: doc.data().phoneNumber,
              email : doc.data().email,
              priprity: doc.data().userId == chatBotId ? 100 : currentPriority
            });
          }
        )


        // for (const userQuery of userQueries) {
        //   const userSnapshot = await getDocs(userQuery);
        //   userSnapshot.forEach((doc) => {
        //     fetchedUsers.push({
        //       _id: doc.id,
        //       firstName: doc.data().firstName,
        //       lastName: doc.data().lastName,
        //       userId: doc.data().userId,
        //       avatar: doc.data().avatar,
        //       phoneNumber: doc.data().phoneNumber,
        //       email : doc.data().email,
        //       priprity: doc.data().userId == chatBotId ? 100 : currentPriority
        //     });
        //   });
        // }

        const sortedUsers = fetchedUsers.sort((a, b) => {
          return  - a.priprity + b.priprity;
        });

        setUsers(sortedUsers);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
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

   const searchByEmail = async () => {
    if (!searchQuery) {
      Alert.alert("Email is required for search.");
      return;
    }
    const user = await getUserByEmail(searchQuery);
    if (user) {
      if (user && !users.filter(u => u._id === user._id).length) {
        setUsers([...users, user]);
      }
    } else {
      Alert.alert("User with this email not found.");
    }
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
    user.phoneNumber.includes(searchQuery) || user.email.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chats</Text>
      <View style={styles.searchBarContainer}>
        <TextInput
        style={styles.searchBar}
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity 
      onPress={searchByEmail}
      style={styles.searchButton}>
      <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
      </View>
     
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
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: '#dddddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 16,
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
