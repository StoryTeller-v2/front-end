import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation, useRoute} from '@react-navigation/native';
import QuestionInputModal from '../../../components/modals/QuestionInputModal';
import fetchWithAuth from '../../../api/fetchWithAuth';
import { styles } from './styles';

const Question = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showGoodJobImage, setShowGoodJobImage] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState('');
  const navigation = useNavigation();
  const route = useRoute();

  const {profileId, bookId} = route.params || {};

  useEffect(() => {
    if (profileId && bookId) {
      fetchQuiz(profileId, bookId);
    } else {
      console.error('profileId 또는 bookId가 정의되지 않았습니다.');
    }
  }, [profileId, bookId]);

  const fetchQuiz = async (profileId, bookId) => {
    try {
      const response = await fetchWithAuth(
        `/books/create/quiz?profileId=${profileId}&bookId=${bookId}`,
        {
          method: 'POST',
        },
      );
      const result = await response.json();
      if (result.status === 201 && result.code === 'SUCCESS_CREATE_QUIZ') {
        setQuizQuestion(result.data.question);
      } else {
        console.error('퀴즈를 가져오는 데 실패했습니다:', result.message);
      }
    } catch (error) {
      console.error('퀴즈를 가져오는 데 실패했습니다:', error);
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleModalClose = () => {
    setTimeout(() => {
      setShowGoodJobImage(true);
      setTimeout(() => {
        setShowGoodJobImage(false);
        navigation.navigate('QuizEnd');
      }, 3000);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.quizBox}>
        <Text style={styles.quizText}>
          {quizQuestion || '퀴즈를 가져오는 중입니다...'}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={openModal} style={styles.button}>
          <LinearGradient
            colors={['#FF8C43', '#F8C683']}
            style={styles.gradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <Image
              source={require('../../../../assets/images/microphone.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <QuestionInputModal
        visible={modalVisible}
        onClose={() => {
          closeModal();
          handleModalClose();
        }}
        onSpeechEnd={() => {}}
      />
      {showGoodJobImage && (
        <View style={styles.goodJobContainer}>
          <Image
            source={require('../../../../assets/images/goodjob.png')}
            style={styles.goodJobImage}
            resizeMode="contain"
          />
        </View>
      )}
    </View>
  );
};

export default Question;
