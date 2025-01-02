import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import fetchWithAuth from '../../api/fetchWithAuth';

const ProfilePinModal = ({
  visible,
  onClose,
  profileId,
  mode = 'select',
  onPinVerified,
}) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [selectedInput, setSelectedInput] = useState(null);
  const [error, setError] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    if (visible) {
      resetPin();
    }
  }, [visible]);

  const handlePinChange = (index, value) => {
    if (value.length > 1) {
      const digits = value.slice(0, 4).split('');
      const newPin = [...pin];
      digits.forEach((digit, idx) => {
        if (idx < 4) {newPin[idx] = digit;}
      });
      setPin(newPin);

      if (newPin.every(digit => digit.length > 0)) {
        verifyPin(newPin.join(''));
      }
      return;
    }

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }

    if (newPin.every(digit => digit.length > 0)) {
      verifyPin(newPin.join(''));
    }
  };

  const handleKeyPress = (index, e) => {
    if (e.nativeEvent.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const verifyPin = async enteredPin => {
    if (!profileId) {
      setError('프로필 ID가 없습니다. 다시 시도해주세요.');
      return;
    }

    try {
      const response = await fetchWithAuth(
        `/profiles/${profileId}/pin-number/verifications`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pinNumber: enteredPin }),
        },
      );

      const result = await response.json();

      if (result.status === 200 && result.code === 'SUCCESS_VERIFICATION_PIN_NUMBER') {
        if (result.data.valid) {
          if (onPinVerified) {
            onPinVerified(profileId);
          }
          setError('');
          onClose();
        } else {
          setError('PIN 번호가 틀렸습니다. 다시 입력해주세요.');
          resetPin();
        }
      } else {
        setError('PIN 검증에 실패했습니다.');
        resetPin();
      }
    } catch (error) {
      console.error('PIN 검증 중 오류 발생:', error);
      setError('서버 오류로 PIN 검증에 실패했습니다.');
      resetPin();
    }
  };

  const resetPin = () => {
    setPin(['', '', '', '']);
    setError('');
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  };

  const handleModalClose = () => {
    Keyboard.dismiss();
    setPin(['', '', '', '']);
    setError('');
    onClose();
  };

  const getHeaderText = () => {
    if (error) return error;
    return mode === 'edit'
      ? '이 프로필을 관리하려면 PIN 번호를 입력하세요.'
      : '이 프로필을 선택하려면 PIN 번호를 입력하세요.';
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={handleModalClose}
    >
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={handleModalClose}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>

          {!isKeyboardVisible && (
            <Text style={styles.modalHeader}>{getHeaderText()}</Text>
          )}

          <View style={styles.pinContainer}>
            {pin.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => (inputRefs.current[index] = ref)}
                style={[
                  styles.pinInput,
                  selectedInput === index && styles.selectedPinInput,
                ]}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={value => handlePinChange(index, value)}
                onKeyPress={e => handleKeyPress(index, e)}
                onFocus={() => setSelectedInput(index)}
                onBlur={() => setSelectedInput(null)}
                secureTextEntry={true}
                onPaste={e => {
                  const pastedText = e.nativeEvent.text;
                  handlePinChange(index, pastedText);
                }}
              />
            ))}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    height: '91%',
    backgroundColor: '#F8C784',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#393939',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalHeader: {
    fontSize: 35,
    fontWeight: '900',
    color: '#393939',
    marginBottom: 100,
    marginTop: -60,
    textAlign: 'center',
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '75%',
    marginTop: 0,
  },
  pinInput: {
    width: 200,
    height: 200,
    backgroundColor: '#FCAE59',
    borderRadius: 20,
    fontSize: 100,
    textAlign: 'center',
    color: '#393939',
    fontWeight: '900',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  selectedPinInput: {
    transform: [{ scale: 1.1 }],
  },
});

export default ProfilePinModal;
