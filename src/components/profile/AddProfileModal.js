import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, Alert, Platform } from 'react-native';
import YesNoModal from '../common/YesNoModal';
import fetchWithAuth from '../../api/fetchWithAuth';
import ProfileForm from './ProfileForm';
import ProfileImageSelector from './ProfileImageSelector';

const AddProfileModal = ({ visible, onClose, userId }) => {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showProfilePicModal, setShowProfilePicModal] = useState(false);
  const [selectedProfilePic, setSelectedProfilePic] = useState(null);
  const [profilePictures, setProfilePictures] = useState([]);
  const [showYesNoModal, setShowYesNoModal] = useState(false);
  const [defaultProfilePic, setDefaultProfilePic] = useState(
    require('../../../assets/images/temp_profile_pic.png')
  );

  useEffect(() => {
    if (visible) {
      fetchProfilePictures();
    }
  }, [visible]);

  const fetchProfilePictures = async () => {
    try {
      const response = await fetchWithAuth('/profiles/photos');
      const result = await response.json();

      if (result.status === 200) {
        const fetchedPictures = result.data.map((item, index) => ({
          id: index.toString(),
          uri: item.imageUrl,
        }));
        setProfilePictures(fetchedPictures);
        if (fetchedPictures.length > 0) {
          setDefaultProfilePic({ uri: fetchedPictures[0].uri });
        }
      }
    } catch (error) {
      console.error('Error fetching profile pictures:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!name || !birthdate || !pin || !confirmPin) {
      Alert.alert('알림', '모든 필드를 입력해주세요.');
      return;
    }

    if (pin.length !== 4) {
      Alert.alert('알림', 'PIN은 4자리 숫자여야 합니다.');
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      Alert.alert('알림', 'PIN은 숫자만 입력 가능합니다.');
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert('알림', 'PIN 번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetchWithAuth('/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          imageUrl: selectedProfilePic,
          userId,
          birthDate: birthdate,
          pinNumber: pin,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        resetForm();
        onClose();
      } else if (result.status === 404) {
        Alert.alert('프로필 생성 실패', '유저 정보를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('프로필 생성 중 오류 발생:', error);
    }
  };

  const resetForm = () => {
    setName('');
    setBirthdate('');
    setPin('');
    setConfirmPin('');
    setSelectedProfilePic(null);
    setDate(new Date());
  };

  return (
    <>
      <Modal
        transparent={true}
        animationType="slide"
        visible={visible}
        onRequestClose={() => setShowYesNoModal(true)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowYesNoModal(true)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            <Text style={styles.modalHeader}>프로필 만들기</Text>

            <ProfileImageSelector
              showModal={showProfilePicModal}
              onCloseModal={() => setShowProfilePicModal(true)}
              images={profilePictures}
              onSelectImage={(uri) => {
                setSelectedProfilePic(uri);
                setShowProfilePicModal(false);
              }}
              selectedImage={selectedProfilePic}
              defaultImage={defaultProfilePic}
            />

            <ProfileForm
              name={name}
              birthdate={birthdate}
              pin={pin}
              confirmPin={confirmPin}
              onNameChange={setName}
              onPinChange={setPin}
              onConfirmPinChange={setConfirmPin}
              showDatePicker={showDatePicker}
              onDatePickerPress={() => setShowDatePicker(true)}
              date={date}
              onBirthdateChange={(event, selectedDate) => {
                const currentDate = selectedDate || date;
                setShowDatePicker(Platform.OS === 'ios');
                setDate(currentDate);
                setBirthdate(currentDate.toISOString().split('T')[0]);
              }}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <Image
                source={require('../../../assets/images/save.png')}
                style={styles.saveIcon}
              />
              <Text style={styles.saveButtonText}>프로필 저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <YesNoModal
        isVisible={showYesNoModal}
        onClose={() => setShowYesNoModal(false)}
        title="정말 나가시겠습니까?"
        subtitle={'나가시면 작성하신 프로필의 정보는 \n 저장되지 않습니다.'}
        buttonText1="확인"
        buttonText2="취소"
        onConfirm={() => {
          setShowYesNoModal(false);
          onClose();
        }}
      />
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
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#F8C784',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#393939',
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  saveButtonText: {
    color: '#393939',
    fontWeight: 'bold',
  },
});

export default AddProfileModal;
