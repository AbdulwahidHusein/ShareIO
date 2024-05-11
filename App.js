import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet, PanResponder, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';

import ChatPage from './screens/ChatPage';
import Login from './screens/Login';
import Registration from './screens/Registeration';
import ProfilePage from './screens/Profile';
import ChatList from './screens/ChatList';

import { AppProvider } from './AppContext';

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
      <Tab.Screen name="Profile" component={ProfilePage} />
      <Tab.Screen name="Registration" component={Registration} />
      <Tab.Screen name="Chat" component={ChatPage} />
      <Tab.Screen name="Login" component={Login} />
      
    </Tab.Navigator>
  );
};

const App = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [pan] = useState(new Animated.ValueXY());

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x }]),
    onPanResponderRelease: (e, gesture) => {
      if (gesture.moveX < 100) {
        if (gesture.dx < -50) {
          toggleSidebar();
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false,
          }).start();
        }
      } else {
        if (gesture.dx > 50) {
          toggleSidebar();
        } else {
          Animated.spring(pan, {
            toValue: { x: -200, y: 0 },
            friction: 4,
            useNativeDriver: false,
          }).start();
        }
      }
    },
  });

  const sidebarStyle = {
    transform: [
      {
        translateX: pan.x.interpolate({
          inputRange: [-200, 0],
          outputRange: [-200, 0],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  return (
    <AppProvider>
      <NavigationContainer>
        <View style={styles.container}>
          <Animated.View style={[styles.sidebar, sidebarStyle]}>
            {/* Add your sidebar content here */}
          </Animated.View>
          <TouchableOpacity style={styles.sidebarButton} onPress={toggleSidebar}>
            <Feather name={sidebarVisible ? 'chevron-left' : 'menu'} size={24} color="black" />
          </TouchableOpacity>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={MainTabs} />
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
