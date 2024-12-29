import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import YesNoModal from '../common/YesNoModal.js';
import fetchWithAuth from '../../api/fetchWithAuth.js';
import OkModal from '../common/OkModal.js';

const EditProfileModal = ({visible, onClose, profileId, onProfileUpdate}) => {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [pin, setPin] = useState('');
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

  const [profileData, setProfileData] = useState({
    name: '',
    birthDate: '',
    imageUrl: '',
  });

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate = `${tempDate.getFullYear()}-${
      tempDate.getMonth() + 1
    }-${tempDate.getDate()}`;
    setBirthdate(fDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleProfilePicSelect = pic => {
    setSelectedProfilePic(pic);
    setShowProfilePicModal(false);
  };

  const fetchProfileData = async () => {
    try {
      const response = await fetchWithAuth(`/profiles/${profileId}`, 'GET');
      const result = await response.json();
      if (result.status === 200 && result.code === 'SUCCESS_GET_PROFILE') {
        setProfileData(result.data);
        setName(result.data.name);
        setBirthdate(result.data.birthDate);
        setSelectedProfilePic(result.data.imageUrl);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const fetchProfilePictures = async () => {
    try {
      const response = await fetchWithAuth(`/profiles/photos`, 'GET');
      const result = await response.json();
      if (result.status === 200 && result.code === 'SUCCESS_PROFILE_PHOTOS') {
        setProfilePictures(result.data.map(pic => ({uri: pic.imageUrl})));
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
  }, [visible]);

  const handleSaveProfile = async () => {
    if (!name || !birthdate || !pin) {
      setModalTitle('모든 필드를 입력해 주세요');
      setModalMessage('빠트린 것이 없는지 다시 확인해주세요.');
      setModalVisible(true);
      return;
    }

    if (!selectedProfilePic) {
      setModalTitle('프로필 사진을 선택해 주세요');
      setModalMessage('빠트린 것이 없는지 다시 확인해주세요.');
      setModalVisible(true);
      return;
    }

    try {
      console.log('Saving profile...');

      const response = await fetchWithAuth(`/profiles/${profileId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          birthDate: birthdate,
          imageUrl: selectedProfilePic,
          pinNumber: pin,
        }),
      });

      const result = await response.json();

      if (result.status === 200 && result.code === 'SUCCESS_UPDATE_PROFILE') {
        onProfileUpdate();
        onClose();
      } else {
        setModalTitle('프로필 저장 실패');
        setModalMessage('프로필 저장에 실패했습니다. 다시 시도해주세요.');
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setModalTitle('프로필 저장 실패');
      setModalMessage('프로필 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
      setModalVisible(true);
    }
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
      {/* EditProfileModal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={visible}
        onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseButtonPress}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalHeader}>프로필 변경하기</Text>
            <Image
              source={
                selectedProfilePic
                  ? {uri: selectedProfilePic}
                  : require('../../../assets/images/temp_profile_pic.png') // 기본 이미지를 사용하지 않음
              }
              style={styles.profileImage}
            />
            <TouchableOpacity onPress={() => setShowProfilePicModal(true)}>
              <Text style={styles.changeText}>변경</Text>
            </TouchableOpacity>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={name}
                placeholder="이름"
                placeholderTextColor="#FF8B42"
                onChangeText={text => setName(text)}
              />
            </View>
            <TouchableOpacity
              onPress={showDatepicker}
              style={styles.inputWrapper}>
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
                onChange={onChange}
              />
            )}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={pin}
                placeholder="PIN"
                placeholderTextColor="#FF8B42"
                secureTextEntry={true}
                onChangeText={text => setPin(text)}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProfile}>
                <Image
                  source={require('../../../assets/images/save.png')}
                  style={styles.saveIcon}
                />
                <Text style={styles.saveButtonText}>프로필 저장</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleDeleteProfile}>
                <Image
                  source={require('../../../assets/images/delete.png')}
                  style={styles.saveIcon}
                />
                <Text style={styles.saveButtonText}>프로필 삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ProfilePicModal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={showProfilePicModal}
        onRequestClose={() => setShowProfilePicModal(false)}>
        <View style={styles.profilePicModalContainer}>
          <View style={styles.profilePicModalContent}>
            <Text style={styles.profilePicModalHeader}>
              프로필을 골라주세요
            </Text>
            <FlatList
              data={profilePictures}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.profilePicItem}
                  onPress={() => handleProfilePicSelect(item.uri)}>
                  <Image source={item} style={styles.profilePic} />
                </TouchableOpacity>
              )}
              numColumns={4}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.profilePicListContainer}
            />
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
        title={
          yesNoModalType === 'delete'
            ? '정말 삭제하시겠습니까?'
            : '정말 나가시겠습니까?'
        }
        subtitle={
          yesNoModalType === 'delete'
            ? '프로필의 모든 정보가 완전히 삭제되고 \n 다시 복구하실 수 없습니다.'
            : '나가시면 수정하신 프로필의 정보는 \n 저장되지 않습니다.'
        }
        buttonText1={yesNoModalType === 'delete' ? '삭제' : '확인'}
        buttonText2="취소"
        profileId={yesNoModalType === 'delete' ? profileId : null} // 프로필 ID 전달
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
  profileImage: {
    width: 160,
    height: 160,
    marginBottom: 10,
  },
  changeText: {
    color: '#FF8B42',
    marginTop: -10,
    marginBottom: 20,
    fontWeight: '900',
    fontSize: 24,
  },
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '28%',
    marginTop: 30,
  },

  saveButton: {
    backgroundColor: '#F8C784',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#393939',
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
  profilePicModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  profilePicModalContent: {
    width: '90%',
    backgroundColor: '#FBF7EC',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  profilePicModalHeader: {
    top: 60,
    fontSize: 35,
    fontWeight: '900',
    color: '#393939',
    marginBottom: 20,
  },
  profilePicItem: {
    left: 85,
    top: 80,
    width: '20%',
    aspectRatio: 1,
    padding: 5,
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default EditProfileModal;
