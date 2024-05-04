import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatPage from './screens/ChatPage';
import Login from './screens/Login';
import Registration from './screens/Registeration';
import ProfilePage from './screens/Profile';

import { AppProvider } from './AppContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Profile" component={ProfilePage} />
      <Tab.Screen name="Registration" component={Registration} />
      <Tab.Screen name="Chat" component={ChatPage} />
      <Tab.Screen name="Login" component={Login} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
};

export default App;