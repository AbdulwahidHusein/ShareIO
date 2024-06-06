import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Welcome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ShareIO!</Text>
      {/* <Button
        title="Get Started"
        onPress={() => navigation.navigate('Login')}
      /> */}
    </View>

    
  );
};

const styles = StyleSheet.create({
  container: {
    width : "100%",
    height: "100%",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#476596',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Welcome;
