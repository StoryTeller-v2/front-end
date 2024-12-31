import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddProfileModal from '../../../components/modals/AddProfileModal';
import SelectPinInputModal from '../../../components/modals/SelectPinInputModal';
import EditPinInputModal from '../../../components/modals/EditPinInputModal';
import { useAuth } from '../../../context/AuthContext';
import fetchWithAuth from '../../../api/fetchWithAuth';
import { styles } from './styles';

const Profile = ({ navigation, route }) => {
  const { userId } = route.params || {};
  console.log(`프로필 페이지의 유저 id: ${userId}`);
  const { isLoggedIn, selectProfile } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [isChangingProfile, setIsChangingProfile] = useState(false);
  const [isAddProfileModalVisible, setIsAddProfileModalVisible] = useState(false);
  const [isPinInputModalVisible, setIsPinInputModalVisible] = useState(false);
  const [isEditPinInputModalVisible, setIsEditPinInputModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedProfileId, selectProfileId] = useState(null);

  const fetchProfiles = useCallback(async () => {
    try {
      const response = await fetchWithAuth(`/users/${userId}/profiles`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();
      if (response.status === 200) {
        setProfiles(result.data);
      } else {
        console.error('프로필을 가져오는 데 실패했습니다:', result.message);
      }
    } catch (error) {
      console.error('프로필을 가져오는 데 실패했습니다:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleAddProfileModalClose = () => {
    setIsAddProfileModalVisible(false);
    fetchProfiles();
  };

  const handlePinCorrect = () => {
    navigation.navigate('BookShelf', {
      profileId: selectedProfileId,
      userId: userId,
    });
  };

  const handleProfilePress = profile => {
    if (isChangingProfile) {
      setModalType('edit');
      selectProfile(profile.id);
      selectProfileId(profile.id);
      setIsEditPinInputModalVisible(true);
    } else {
      setModalType('select');
      selectProfile(profile.id);
      selectProfileId(profile.id);
      setIsPinInputModalVisible(true);
    }
  };

  const handleProfileUpdate = () => {
    fetchProfiles();
  };

  const renderProfiles = () => {
    return profiles.map((profile, index) => (
      <View key={index} style={styles.profileContainer}>
        <TouchableOpacity
          style={[
            styles.profileButton,
            isChangingProfile && styles.profileButtonActive,
          ]}
          onPress={() => handleProfilePress(profile)}
        >
          <Image source={{ uri: profile.imageUrl }} style={styles.profileImage} />
          {isChangingProfile && (
            <View style={styles.overlay}>
              <Image
                source={require('../../../../assets/images/pen.png')}
                style={styles.profilepenIcon}
              />
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.profileText}>{profile.name}</Text>
      </View>
    ));
  };

  const changeProfileText = () => {
    setIsChangingProfile(!isChangingProfile);
    selectProfile(null);
  };

  const handleBackPress = useCallback(() => {
    navigation.navigate('BookShelf');
    return true;
  }, [navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
    return () => backHandler.remove();
  }, [handleBackPress]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigation.navigate('Login');
    }
  }, [isLoggedIn, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>
        {isChangingProfile
          ? '관리할 프로필을 골라주세요'
          : '프로필을 선택해주세요'}
      </Text>
      <View style={styles.profilesContainer}>
        {renderProfiles()}
        {!isChangingProfile && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsAddProfileModalVisible(true)}
          >
            <Text style={styles.plus}>+</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={[
          styles.changeProfileButton,
          { borderColor: '#393939', borderWidth: 2 },
        ]}
        onPress={changeProfileText}
      >
        <Image
          source={require('../../../../assets/images/pen.png')}
          style={styles.penIcon}
        />
        <Text
          style={[
            styles.changeProfileButtonText,
            { color: '#393939', marginLeft: 10 },
          ]}
        >
          프로필 관리
        </Text>
      </TouchableOpacity>
      <AddProfileModal
        visible={isAddProfileModalVisible}
        onClose={handleAddProfileModalClose}
        userId={userId}
      />

      <SelectPinInputModal
        visible={isPinInputModalVisible && modalType === 'select'}
        onClose={() => setIsPinInputModalVisible(false)}
        onPinCorrect={handlePinCorrect}
        profileId={selectedProfileId}
        onProfileUpdate={handleProfileUpdate}
      />
      <EditPinInputModal
        visible={isEditPinInputModalVisible}
        onClose={() => setIsEditPinInputModalVisible(false)}
        onPinCorrect={handlePinCorrect}
        profileId={selectedProfileId}
        onProfileUpdate={handleProfileUpdate}
      />
    </SafeAreaView>
  );
};

export default Profile;
