import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import YesNoModal from '../common/YesNoModal';
import OkModal from '../common/OkModal';
import fetchWithAuth from '../../api/fetchWithAuth';
import ProfileForm from './ProfileForm';
import ProfileImageSelector from './ProfileImageSelector';

const EditProfileModal = ({ visible, onClose, profileId, onProfileUpdate }) => {
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
  const [yesNoModalType, setYesNoModalType] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const fetchProfileData = useCallback(async () => {
    try {
      const response = await fetchWithAuth(`/profiles/${profileId}`, 'GET');
      const result = await response.json();

      if (result.status === 200) {
        setName(result.data.name);
        setBirthdate(result.data.birthDate);
        setSelectedProfilePic(result.data.imageUrl);
        setDate(new Date(result.data.birthDate));
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  }, [profileId]);

  const fetchProfilePictures = async () => {
    try {
      const response = await fetchWithAuth('/profiles/photos', 'GET');
      const result = await response.json();

      if (result.status === 200) {
        setProfilePictures(result.data.map((pic, index) => ({
          id: index.toString(),
          uri: pic.imageUrl
        })));
      }
    } catch (error) {
      console.error('Error fetching profile pictures:', error);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchProfileData();
      fetchProfilePictures();
    }
  }, [visible, fetchProfileData]);

  const handleSaveProfile = async () => {
    if (!name || !birthdate || !pin || !confirmPin) {
      showErrorModal('알림', '모든 필드를 입력해주세요.');
      return;
    }

    if (pin.length !== 4) {
      showErrorModal('알림', 'PIN은 4자리 숫자여야 합니다.');
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      showErrorModal('알림', 'PIN은 숫자만 입력 가능합니다.');
      return;
    }

    if (pin !== confirmPin) {
      showErrorModal('알림', 'PIN 번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetchWithAuth(`/profiles/${profileId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          birthDate: birthdate,
          imageUrl: selectedProfilePic,
          pinNumber: pin,
        }),
      });

      const result = await response.json();

      if (result.status === 200) {
        onProfileUpdate();
        onClose();
      } else {
        showErrorModal('프로필 저장 실패', '프로필 저장에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showErrorModal('프로필 저장 실패', '프로필 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const showErrorModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleDeleteProfile = () => {
    setYesNoModalType('delete');
    setShowYesNoModal(true);
  };

  const handleCloseButtonPress = () => {
    setYesNoModalType('close');
    setShowYesNoModal(true);
  };

  return (
    <>
      <Modal
        transparent={true}
        animationType="slide"
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseButtonPress}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            <Text style={styles.modalHeader}>프로필 변경하기</Text>

            <ProfileImageSelector
              showModal={showProfilePicModal}
              onCloseModal={() => setShowProfilePicModal(true)}
              images={profilePictures}
              onSelectImage={(uri) => {
                setSelectedProfilePic(uri);
                setShowProfilePicModal(false);
              }}
              selectedImage={selectedProfilePic}
              defaultImage={require('../../../assets/images/temp_profile_pic.png')}
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

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={handleSaveProfile}>
                <Image
                  source={require('../../../assets/images/save.png')}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>프로필 저장</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={handleDeleteProfile}>
                <Image
                  source={require('../../../assets/images/delete.png')}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>프로필 삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <OkModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalTitle}
        message={modalMessage}
      />

      <YesNoModal
        isVisible={showYesNoModal}
        onClose={() => setShowYesNoModal(false)}
        title={yesNoModalType === 'delete' ? '정말 삭제하시겠습니까?' : '정말 나가시겠습니까?'}
        subtitle={
          yesNoModalType === 'delete'
            ? '프로필의 모든 정보가 완전히 삭제되고 \n 다시 복구하실 수 없습니다.'
            : '나가시면 수정하신 프로필의 정보는 \n 저장되지 않습니다.'
        }
        buttonText1={yesNoModalType === 'delete' ? '삭제' : '확인'}
        buttonText2="취소"
        profileId={yesNoModalType === 'delete' ? profileId : null}
        closeEditor={onClose}
        onProfileUpdate={onProfileUpdate}
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '28%',
    marginTop: 30,
  },
  actionButton: {
    backgroundColor: '#F8C784',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#393939',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonText: {
    color: '#393939',
    fontWeight: 'bold',
  },
});

export default EditProfileModal;
