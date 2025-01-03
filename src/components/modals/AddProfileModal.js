import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Platform,
  FlatList,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import YesNoModal from '../common/YesNoModal';
import fetchWithAuth from '../../api/fetchWithAuth';

const AddProfileModal = ({ visible, onClose, userId }) => {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [pin, setPin] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showProfilePicModal, setShowProfilePicModal] = useState(false);
  const [selectedProfilePic, setSelectedProfilePic] = useState(null);
  const [profilePictures, setProfilePictures] = useState([]);
  const [showYesNoModal, setShowYesNoModal] = useState(false);
  const [defaultProfilePic, setDefaultProfilePic] = useState(
    require('../../../assets/images/temp_profile_pic.png')
  );

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let day = `0${tempDate.getDate()}`.slice(-2);
    let month = `0${tempDate.getMonth() + 1}`.slice(-2);
    let year = tempDate.getFullYear();

    let formattedDate = `${year}-${month}-${day}`;
    setBirthdate(formattedDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleProfilePicSelect = pic => {
    setSelectedProfilePic({ uri: pic });
    setShowProfilePicModal(false);
  };

  const fetchProfilePictures = async () => {
    try {
      const response = await fetchWithAuth('/profiles/photos', {
        method: 'GET',
      });
      const result = await response.json();

      if (result.status === 200) {
        const fetchedPictures = result.data.map((item, index) => ({
          id: index.toString(),
          uri: item.imageUrl,
        }));
        setProfilePictures(fetchedPictures);

        if (fetchedPictures.length > 0) {
          setDefaultProfilePic({ uri: fetchedPictures[0].uri });
        } else {
          setDefaultProfilePic(
            require('../../../assets/images/temp_profile_pic.png')
          );
        }
      } else {
        console.error('Failed to fetch profile pictures:', result.message);
      }
    } catch (error) {
      console.error('Error fetching profile pictures:', error);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchProfilePictures();
    }
  }, [visible]);

  const handleSaveProfile = async () => {
    if (!name || !birthdate || !pin || !selectedProfilePic) {
      alert('모든 필드를 입력하고 프로필 사진을 선택해주세요.');
      return;
    }

    const profileData = {
      name: name,
      imageUrl: selectedProfilePic.uri,
      userId: userId,
      birthDate: birthdate,
      pinNumber: pin,
    };

    console.log(`프로필 추가 유저 id: ${userId}`);

    try {
      const response = await fetchWithAuth('/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();

      if (response.ok) {
        setName('');
        setBirthdate('');
        setPin('');
        setSelectedProfilePic(null);
        setDate(new Date());
        onClose();
      } else if (result.status === 404) {
        Alert.alert('프로필 생성 실패', '유저 정보를 찾을 수 없습니다.');
      } else {
        console.error('프로필 생성 실패:', result.message);
      }
    } catch (error) {
      console.error('프로필 생성 중 오류 발생:', error);
    }
  };

  const handleConfirm = () => {
    setShowYesNoModal(false);
    onClose();
  };

  const handleCloseButtonPress = () => {
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
            <Text style={styles.modalHeader}>프로필 만들기</Text>
            <Image
            source={
              selectedProfilePic
                ? selectedProfilePic
                : typeof defaultProfilePic === 'string'
                  ? { uri: defaultProfilePic }
                  : defaultProfilePic
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
              style={styles.inputWrapper}
            >
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
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProfile}
            >
              <Image
                source={require('../../../assets/images/save.png')}
                style={styles.saveIcon}
              />
              <Text style={styles.saveButtonText}>프로필 저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        animationType="slide"
        visible={showProfilePicModal}
        onRequestClose={() => setShowProfilePicModal(false)}
      >
        <View style={styles.profilePicModalContainer}>
          <View style={styles.profilePicModalContent}>
            <Text style={styles.profilePicModalHeader}>
              프로필을 골라주세요
            </Text>
            <FlatList
              data={profilePictures}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.profilePicItem}
                  onPress={() => handleProfilePicSelect(item.uri)}
                >
                  <Image source={{ uri: item.uri }} style={styles.profilePic} />
                </TouchableOpacity>
              )}
              numColumns={4}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.profilePicListContainer}
            />
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
        onConfirm={handleConfirm}
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

export default AddProfileModal;
