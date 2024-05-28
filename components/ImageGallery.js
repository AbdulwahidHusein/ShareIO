import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

const ImageGallery = ({ imageUris, initialIndex }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handleNext = () => {
    if (currentIndex < imageUris.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUris[currentIndex] }} style={styles.image} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handlePrev} style={styles.button} disabled={currentIndex === 0}>
          <Text style={[styles.buttonText, currentIndex === 0 && styles.disabledButton]}>Prev</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={styles.button} disabled={currentIndex === imageUris.length - 1}>
          <Text style={[styles.buttonText, currentIndex === imageUris.length - 1 && styles.disabledButton]}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  button: {
    padding: 10,
    backgroundColor: '#1E90FF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  disabledButton: {
    backgroundColor: '#555',
  },
});

export default ImageGallery;
