import {View, Text, StyleSheet, Modal, Alert} from 'react-native';
import React from 'react';
import YesNoButton from './YesNoButton.js';
import {useNavigation} from '@react-navigation/native';
import fetchWithAuth from '../../api/fetchWithAuth.js';

const YesNoModal = ({
  isVisible,
  onClose,
  linkTo,
  title,
  subtitle,
  buttonText1,
  buttonText2,
  profileId,
  bookId,
  currentPage,
  onConfirm,
  closeEditor,
  onProfileUpdate,
}) => {
  const navigation = useNavigation();

  const handleButtonClick = async () => {
    if (buttonText1 === '중단하기') {
      try {
        const response = await fetchWithAuth(
          `/books/current?profileId=${profileId}&bookId=${bookId}&currentPage=${currentPage}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        const responseData = await response.json();
        console.log('Response data:', responseData);
        console.log('Response status:', response.status);

        if (response.status === 200) {
          // 페이지 저장이 성공적으로 완료되었을 때 BookShelf 페이지로 이동
          navigation.reset({
            index: 0,
            routes: [{name: linkTo}],
          });
        } else {
          Alert.alert(
            'Error',
            `현재 페이지 저장 실패1 ${responseData.message || 'Unknown error'}`,
          );
        }
      } catch (error) {
        Alert.alert('Error', `현재 페이지 저장 실패2: ${error.message}`);
      }
    } else if (buttonText1 === '삭제') {
      try {
        if (!profileId) {
          Alert.alert('Error', '프로필 ID가 제공되지 않았습니다.');
          return;
        }

        const response = await fetchWithAuth(`/profiles/${profileId}`, {
          method: 'DELETE',
        });
        const result = await response.json();

        if (response.ok && result.code === 'SUCCESS_DELETE_PROFILE') {
          Alert.alert('Success', '프로필이 성공적으로 삭제되었습니다.1');
          // Close YesNoModal and EditProfileModal
          onClose(); // Close YesNoModal
          closeEditor();
          onProfileUpdate();
          // onConfirm();
          // Additional logic if needed for EditProfileModal
          // You might want to ensure EditProfileModal is also closed if necessary
        } else {
          Alert.alert('Error', result.message || '프로필 삭제에 실패했습니다.');
        }
      } catch (error) {
        Alert.alert(
          'Error',
          `프로필 삭제 중 오류가 발생했습니다: ${error.message}`,
        );
      }
    } else if (buttonText1 === '확인') {
      if (onConfirm) {
        onConfirm();
      }
      closeEditor();
    }
  };

  return (
    <Modal animationType="slide" visible={isVisible} transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <View style={styles.modalTitle}>
            <Text style={styles.modalTextStyle}>{title}</Text>
          </View>
          <View style={styles.subtitle}>
            <Text style={styles.subtitleText}>{subtitle}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <YesNoButton text={buttonText1} onPress={handleButtonClick} />
            <YesNoButton text={buttonText2} onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '40%',
    height: '43%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    position: 'absolute',
    top: '28%',
    left: '30%',
    elevation: 10, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 13,
    width: '100%',
    fontFamily: 'TAEBAEKfont',
  },
  modalTextStyle: {
    top: 20,
    fontSize: 32,
    fontWeight: '900',
    color: '#393939',
    marginBottom: 30,
  },
  subtitle: {
    margin: 6,
  },
  subtitleText: {
    bottom: 25,
    fontWeight: '100',
    textAlign: 'center',
    fontSize: 23,
    color: 'black',
    fontFamily: 'TAEBAEKmilkyway',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    fontWeight: '900',
  },
});

export default YesNoModal;
