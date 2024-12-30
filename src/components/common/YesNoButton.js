import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const YesNoButton = ({ text, onPress }) => {
  return (
    <View>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <LinearGradient colors={['#F8C683', '#FF8C43']} style={styles.gradient}>
          <Text style={styles.buttonText}>{text}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 120,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
    marginHorizontal: 25,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 25,
    fontWeight: '900',
    color: '#393939',
  },
});

export default YesNoButton;
