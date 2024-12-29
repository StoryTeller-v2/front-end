import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import fetchWithAuth from '../../api/fetchWithAuth.js';

const SizeFilter = ({ handleSizeFilter, profileId, bookId, initialSize }) => {
  let buttons = ['작게', '기본', '크게'];
  const [btnActive, setBtnActive] = useState('');

  useEffect(() => {
    const activeButton = getButtonLabel(initialSize);
    setBtnActive(activeButton);
  }, [initialSize]);

  const getButtonLabel = size => {
    switch (size) {
      case 'SMALL':
        return '작게';
      case 'MEDIUM':
        return '기본';
      case 'LARGE':
        return '크게';
      default:
        return '기본';
    }
  };

  const getFontSizeValue = label => {
    switch (label) {
      case '작게':
        return 'SMALL';
      case '기본':
        return 'MEDIUM';
      case '크게':
        return 'LARGE';
      default:
        return 'MEDIUM';
    }
  };
  const toggleActive = async label => {
    const fontSizeValue = getFontSizeValue(label);
    setBtnActive(label);
    handleSizeFilter(fontSizeValue);

    try {
      const response = await fetchWithAuth(
        `/settings/update?profileId=${profileId}&bookId=${bookId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fontSize: fontSizeValue,
          }),
        },
      );

      if (response.status !== 200) {
        Alert.alert('Error', '글씨 크기 업데이트 실패');
        const result = await response.json();
        console.log(result);
      } else {
        const result = await response.json();
        console.log(result);
      }
    } catch (error) {
      Alert.alert('Error', '글씨 크기 업데이트 실패');
      console.error(error);
    }
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
    paddingVertical: 6,
    paddingHorizontal: 16,
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

export default SizeFilter;
