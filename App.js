import React, { useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AppProvider } from './AppContext';
import ChatPage from './screens/ChatPage';
import Login from './screens/Login';
import Registration from './screens/Registeration';
import ProfilePage from './screens/Profile';
import ChatList from './screens/ChatList';
import { auth, database } from './firebaseConfig';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'ChatList') {
            iconName = 'message-square';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          } else if (route.name === 'Registration') {
            iconName = 'edit';
          } else if (route.name === 'Chat') {
            iconName = 'message-circle';
          } else if (route.name === 'Login') {
            iconName = 'log-in';
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
        headerShown: false,
      })}
      tabBarOptions={{
        activeTintColor: '#007AFF',
        inactiveTintColor: '#8E8E93',
        showLabel: false,
        style: {
          backgroundColor: '#F9F9F9',
          borderTopWidth: 0,
          elevation: 0,
        },
      }}>
      <Tab.Screen name="ChatList" component={ChatList} />
      <Tab.Screen name="Chat" component={ChatPage } options={{
        headerRight: () => (
          <TouchableOpacity>
            <Feather name="more-vertical" size={24} color="#007AFF" />
          </TouchableOpacity>
        ),
      }} />
      <Tab.Screen name="Profile" component={ProfilePage} options={{
        headerRight: () => (
          <TouchableOpacity>
            <Feather name="edit" size={24} color="#007AFF" />
          </TouchableOpacity>
        ),
      }} />
    </Tab.Navigator>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  auth.onAuthStateChanged((user) => {
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  });

  return (
    <AppProvider>
      <NavigationContainer>
        <View style={styles.container}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isLoggedIn && <Stack.Screen name="MainTabs" component={MainTabs} />}
            {!isLoggedIn && (
              <>
                <Tab.Screen name="Login" component={Login} />
                <Tab.Screen name="Registration" component={Registration} />
              </>
            )}
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </AppProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 200,
    backgroundColor: '#F9F9F9',
    padding: 10,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
  },
  sidebarButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 2,
  },
});

export default App;
s