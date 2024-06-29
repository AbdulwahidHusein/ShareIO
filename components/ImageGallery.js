import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
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

  const { width, height } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.prevButton} onPress={handlePrev}>
        <AntDesign name="caretleft" size={32} color="white" />
      </TouchableOpacity>
      
      <Image 
        source={{ uri: imageUris[currentIndex] }} 
        style={[styles.image, { width: width * 0.8, height: height * 0.6 }]} 
        onLoad={() => console.log("Image loaded")}
        onError={(error) => console.error("Error loading image:", error)}
      />
      
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <AntDesign name="caretright" size={32} color="white" />
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
    padding: 16,
  },
  image: {
    resizeMode: 'contain',
    marginVertical: 20,
    borderRadius: 12,
  },
  prevButton: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -16 }],
    zIndex: 1,
  },
  nextButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -16 }],
    zIndex: 1,
  },
});

export default ImageGallery;
