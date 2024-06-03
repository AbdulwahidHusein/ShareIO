import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo icons
import AntDesign from '@expo/vector-icons/AntDesign';

const ImageGallery = ({ imageUris, initialIndex }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handleNext = () => {
    if (currentIndex < imageUris.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.prevButton} onPress={handlePrev}>
        <AntDesign name="caretright" size={54} color="black"  style= {styles.prevButton}/>
      </TouchableOpacity>
      <Image 
  source={require("../assets/appicon.jpg")} 
  style={styles.images} 
  onLoad={() => console.log("Image loaded")}
  onError={(error) => console.error("Error loading image:", error)}
/>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
      <AntDesign name="caretleft" size={54} color="black" style={styles.nextButton} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1b1c1b',
    width : "100vw",
    height: "100vh",
  },
  images: {
    width: '800',
    height: '800',
    resizeMode: 'contain',
  },
  prevButton: {
    position: 'absolute',
    right: -80,
    top: '50%',
    transform: [{ translateY: -15 }], 
    color : "white"
  },
  nextButton: {
    position: 'absolute',
    right: 50,
    top: '50%',
    transform: [{ translateY: -15 }],
    color: "white",
  },
});

export default ImageGallery;
