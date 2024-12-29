import React, {useRef, useEffect} from 'react';
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

const {height, width} = Dimensions.get('window');

const VoiceInputErrorModal = ({
  visible,
  onClose,
  onKeyboardInput,
  onRetry,
}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;

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

  return (
    <Modal transparent visible={visible} animationType="none">
      <TouchableWithoutFeedback onPress={handleOverlayPress}>
        <View style={styles.overlay}>
          <Animated.View
            style={[
              styles.modalContainer,
              {transform: [{translateY: slideAnim}]},
            ]}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              <View style={styles.textContainer}>
                <Text style={styles.boldText}>음성이 잘 들리지 않아요</Text>
                <Text style={styles.lightText}>
                  키보드로 입력하거나 다시 음성을 들려주세요
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <LinearGradient
                  colors={['#2170CD', '#8FA0E8']}
                  start={{x: 0, y: 0.5}}
                  end={{x: 1, y: 0.5}}
                  style={styles.gradientButton}>
                  <TouchableOpacity
                    onPress={onKeyboardInput}
                    style={styles.roundButton}>
                    <Image
                      source={require('../../../assets/images/keyboard.png')}
                      style={styles.buttonImage}
                    />
                  </TouchableOpacity>
                </LinearGradient>
                <LinearGradient
                  colors={['#2170CD', '#8FA0E8']}
                  start={{x: 0, y: 0.5}}
                  end={{x: 1, y: 0.5}}
                  style={[styles.gradientButton, styles.marginLeft]}>
                  <TouchableOpacity onPress={onRetry} style={styles.roundButton}>
                    <Image
                      source={require('../../../assets/images/microphone.png')}
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
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    padding: 20,
    alignItems: 'center',
  },
  textContainer: {
    marginTop: 50,
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
    marginTop: 70,
  },
  gradientButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  marginLeft: {
    marginLeft: 40,
  },
  roundButton: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});

export default VoiceInputErrorModal;
