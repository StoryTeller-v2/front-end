import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Keyboard,
} from 'react-native';
import fetchWithAuth from '../../api/fetchWithAuth';
import EditProfileModal from './EditProfileModal';

const EditPinInputModal = ({ visible, onClose, profileId, onProfileUpdate }) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [isEditProfileModalVisible, setIsEditProfileModalVisible] =
    useState(false);
  const [selectedInput, setSelectedInput] = useState(null);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // profileId가 제대로 전달되는지 확인하는 로그
  useEffect(() => {
    console.log('Received profileId:', profileId); // profileId가 잘 전달되는지 확인
  }, [profileId]);

  // 모달이 열릴 때 PIN을 초기화
  useEffect(() => {
    if (visible) {
      resetPin();
    }
  }, [visible]);

  // PIN 변경 핸들러
  const handlePinChange = (index, value) => {
    let newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < pin.length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // 모든 입력이 완료된 경우 PIN을 확인
    if (newPin.every(digit => digit.length > 0)) {
      verifyPin(newPin.join('')); // PIN 검증 호출
    }
  };

  // PIN 검증 API 호출 함수
  const verifyPin = async enteredPin => {
    if (!profileId) {
      console.error('profileId가 전달되지 않았습니다.');
      setError('프로필 ID가 없습니다. 다시 시도해주세요.');
      return;
    }

    try {
      console.log(
        'Fetching with URL:',
        `/profiles/${profileId}/pin-number/verifications`,
      );
      console.log('Request body:', JSON.stringify({ pinNumber: enteredPin }));

      const response = await fetchWithAuth(
        `/profiles/${profileId}/pin-number/verifications`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pinNumber: enteredPin }),
        },
      );

      const result = await response.json();
      console.log('Response from API:', result);

      if (
        result.status === 200 &&
        result.code === 'SUCCESS_VERIFICATION_PIN_NUMBER'
      ) {
        if (result.data.valid) {
          setIsEditProfileModalVisible(true);
          setError('');
          onClose();
        } else {
          setError('PIN 번호가 틀렸습니다. 다시 입력해주세요.');
          resetPin();
        }
      } else {
        console.error('PIN 검증 실패:', result.message);
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
    setPin(['', '', '', '']); // PIN 초기화
    inputRefs.current[0].focus(); // 첫 번째 입력으로 포커스 이동
  };

  // 모달 닫기 핸들러
  const handleClose = useCallback(() => {
    resetPin(); // PIN 초기화
    setError(''); // 오류 메시지 초기화
    onClose(); // 부모 컴포넌트의 onClose 호출
  }, [onClose]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <>
      <Modal
        transparent={true}
        animationType="slide"
        visible={visible}
        onRequestClose={handleClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            {!isKeyboardVisible && (
              <Text style={styles.modalHeader}>
                {error || '이 프로필을 관리하려면 PIN 번호를 입력하세요.'}
              </Text>
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
                  onFocus={() => setSelectedInput(index)}
                  onBlur={() => setSelectedInput(null)}
                />
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* EditProfileModal should be conditionally rendered */}
      {isEditProfileModalVisible && (
        <EditProfileModal
          visible={isEditProfileModalVisible}
          onClose={() => setIsEditProfileModalVisible(false)}
          profileId={profileId}
          onProfileUpdate={onProfileUpdate}
        />
      )}
    </>
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

export default EditPinInputModal;
