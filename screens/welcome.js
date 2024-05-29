import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

const WelcomePage = ({ navigation }) => {
  const [greeting, setGreeting] = useState('Welcome to our App!');

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>{greeting}</Text>
      <Button title="Go to login Page" onPress={() => navigation.navigate('login')} />
    </View>
  );
};

export default Welcome;
