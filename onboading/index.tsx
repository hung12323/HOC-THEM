import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [buttonText, setButtonText] = useState('Click me!');

  useEffect(() => {
    loadButtonState();
  }, []);

  const loadButtonState = async () => {
    try {
      const storedButtonText = await AsyncStorage.getItem('buttonText');
      if (storedButtonText !== null) {
        setButtonText(storedButtonText);
      }
    } catch (error) {
      console.log('Error loading button state:', error);
    }
  };

  const saveButtonState = async () => {
    try {
      await AsyncStorage.setItem('buttonText', buttonText);
    } catch (error) {
      console.log('Error saving button state:', error);
    }
  };

  const changeName = () => {
    if (buttonText === 'Click me!') {
      setButtonText('Button clicked!');
    } else {
      setButtonText('Click me!');
    }
  };

  useEffect(() => {
    saveButtonState();
  }, [buttonText]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={changeName}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
