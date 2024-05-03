import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatPage from './screens/ChatPage';
import Login from './screens/Login';
import Registration from './screens/Registeration';



const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="ChatPage" component={ChatPage} />
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen name="Login" component={Login} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;