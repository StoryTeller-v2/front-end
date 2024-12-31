import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Modal,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import StoryCreationModal from './StoryCreationModal';

const { height, width } = Dimensions.get('window');

const StoryGeneratorModal = ({
  visible,
  onClose,
  prompt,
  fetchWithAuth,
  profileId,
  refreshBooks,
}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage1, setSuccessMessage1] = useState('');
  const [successMessage2, setSuccessMessage2] = useState('');

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleOverlayPress = () => {
    // 모달 창 외부를 터치했을 때 아무 작업도 하지 않도록 빈 함수로 처리
  };

  const createStory = async () => {
    try {
      // 진행 상태 모달을 띄웁니다.
      setSuccessMessage1('동화를 만들고 있어요');
      setSuccessMessage2('잠시만 기다려주세요');
      setShowSuccessModal(true);

      const response = await fetchWithAuth(
        `/profiles/${profileId}/books`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        },
      );

      if ( response.status === 200 ) {
        console.log('Story created successfully');
        // 성공 상태로 모달 메시지 업데이트
        setSuccessMessage1('동화가 만들어졌어요');
        setSuccessMessage2('책을 클릭하여 이야기를 들어주세요');
        // 새로고침 및 모달 닫기
        refreshBooks();
        setTimeout(() => {
          onClose();
          setShowSuccessModal(false);
        }, 3000);
      } else {
        console.error('Error creating story:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating story:', error);
    }
  };

  return (
    <>
      <Modal transparent visible={visible} animationType="none">
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
          <View style={styles.overlay}>
            <Animated.View
              style={[
                styles.modalContainer,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <View style={styles.modalContent}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
                <View style={styles.textContainer}>
                  <Text style={styles.boldText}>{prompt}</Text>
                  <Text style={styles.lightText}>
                    해당 주제로 동화를 만들까요?
                  </Text>
                </View>
                <View style={styles.buttonContainer}>
                  <LinearGradient
                    colors={['#2170CD', '#8FA0E8']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientButton}
                  >
                    <TouchableOpacity
                      onPress={createStory}
                      style={styles.roundButton}
                    >
                      <Image
                        source={require('../../../assets/images/polygon.png')}
                        style={styles.buttonImage}
                      />
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <StoryCreationModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message1={successMessage1}
        message2={successMessage2}
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    width: width,
    height: '51%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    height: '115%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    padding: 20,
    alignItems: 'center',
  },
  textContainer: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  boldText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    fontFamily: 'TAEBAEKfont',
  },
  lightText: {
    fontSize: 30,
    fontWeight: '300',
    textAlign: 'center',
    lineHeight: 40,
    fontFamily: 'TAEBAEKmilkyway',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 60,
  },
  gradientButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundButton: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonImage: {
    width: 30,
    height: 40,
    resizeMode: 'contain',
  },
});

export default StoryGeneratorModal;
