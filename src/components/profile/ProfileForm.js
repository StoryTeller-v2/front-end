import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const ProfileForm = ({
  name,
  birthdate,
  pin,
  onNameChange,
  onBirthdateChange,
  onPinChange,
  showDatePicker,
  onDatePickerPress,
  date,
}) => {
  const handlePinChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');

    if (numericValue.length <= 4) {
      onPinChange(numericValue);
    }
  };

  return (
    <>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={name}
          placeholder="이름"
          placeholderTextColor="#FF8B42"
          onChangeText={onNameChange}
        />
      </View>

      <TouchableOpacity onPress={onDatePickerPress} style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={birthdate}
          placeholder="생년월일"
          placeholderTextColor="#FF8B42"
          editable={false}
        />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onBirthdateChange}
        />
      )}

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={pin}
          placeholder="PIN (숫자 4자리)"
          placeholderTextColor="#FF8B42"
          secureTextEntry={true}
          onChangeText={handlePinChange}
          keyboardType="numeric"
          maxLength={4}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    width: '25%',
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    fontWeight: '900',
    fontSize: 17,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    color: '#FF8B42',
    height: '125%',
  },
});

export default ProfileForm;
