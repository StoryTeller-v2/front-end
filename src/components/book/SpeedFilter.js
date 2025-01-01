import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import fetchWithAuth from '../../api/fetchWithAuth.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Tts from 'react-native-tts';

const SpeedFilter = ({
  handleSpeedFilter,
  profileId,
  bookId,
  currentText,
  initialSpeed,
}) => {
  const buttons = ['0.5배속', '0.75배속', '1.0배속', '1.25배속', '1.5배속'];
  const [btnActive, setBtnActive] = useState(initialSpeed);

  const updateTtsRate = speed => {
    let ttsRate;
    switch (speed) {
      case '0.5배속':
        ttsRate = 0.15;
        break;
      case '0.75배속':
        ttsRate = 0.3;
        break;
      case '1.0배속':
        ttsRate = 0.55;
        break;
      case '1.25배속':
        ttsRate = 0.8;
        break;
      case '1.5배속':
        ttsRate = 1.05;
        break;
      default:
        ttsRate = 0.55;
    }
    Tts.setDefaultRate(ttsRate);
  };

  useEffect(() => {
    const loadSpeedSetting = async () => {
      try {
        const savedSpeed = await AsyncStorage.getItem('selectedSpeed');
        if (savedSpeed) {
          setBtnActive(savedSpeed);
          updateTtsRate(savedSpeed);
        } else {
          setBtnActive('1.0배속');
          Tts.setDefaultRate(0.55);
        }
      } catch (error) {
        console.log('속도 불러오기 실패:', error);
      }
    };

    loadSpeedSetting();
  }, [initialSpeed]);

  useEffect(() => {
    updateTtsRate(btnActive);
    console.log(`Active button: ${btnActive}`);
  }, [btnActive]);

  const toggleActive = async speed => {
    setBtnActive(speed);
    handleSpeedFilter(speed);

    console.log(`Button pressed: ${speed}`);

    let readingSpeedValue;

    switch (speed) {
      case '0.5배속':
        readingSpeedValue = 'SLOW';
        break;
      case '0.75배속':
        readingSpeedValue = 'SLIGHTLY_SLOW';
        break;
      case '1.0배속':
        readingSpeedValue = 'NORMAL';
        break;
      case '1.25배속':
        readingSpeedValue = 'SLIGHTLY_FAST';
        break;
      case '1.5배속':
        readingSpeedValue = 'FAST';
        break;
      default:
        readingSpeedValue = 'NORMAL';
    }

    try {
      await AsyncStorage.setItem('selectedSpeed', speed);

      const response = await fetchWithAuth(
        `/profiles/${profileId}/books/${bookId}/settings`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            readingSpeed: readingSpeedValue,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('속도 설정 저장 실패');
      }

      const responseData = await response.json();
      console.log('Response data:', responseData);
    } catch (error) {
      console.error('속도 설정 저장 중 오류 발생:', error);
      Alert.alert('Error', '속도 설정 저장 중 오류 발생');
    }

    // 속도 설정 후 다시 시작
    Tts.stop();
    setTimeout(() => {
      Tts.speak(currentText);
    }, 300);
  };

  return (
    <View style={styles.container}>
      {buttons.map((item, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={() => toggleActive(item)}
          style={[styles.button, btnActive === item && styles.activeButton]}
        >
          <Text
            style={[
              styles.buttonText,
              btnActive === item && styles.activeButtonText,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: 7,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#000',
    fontFamily: 'TAEBAEKmilkyway',
  },
  activeButton: {
    backgroundColor: '#F8BD66',
  },
  activeButtonText: {
    color: '#000',
  },
});

export default SpeedFilter;
