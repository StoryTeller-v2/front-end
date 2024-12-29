import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  ImageBackground,
  View,
  TouchableOpacity,
  Alert,
  Animated,
  Modal,
  AppState,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import Ionic from 'react-native-vector-icons/Ionicons';
import ProgressBar from '../components/ProgressBar';
import SettingModal from '../components/SettingModal';
import YesNoModal from '../components/YesNoModal';
import NextStep from '../components/NextStep';
import BookBg from '../../assets/images/bookBg.png';
import fetchWithAuth from '../api/fetchWithAuth.js';
import Tts from 'react-native-tts';
import {WebView} from 'react-native-webview';

const BookRead = ({navigation}) => {
  const route = useRoute();
  const {profileId, bookId} = route.params; // 파라미터 받기

  const [title, setTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [bookText, setBookText] = useState('');
  const [pageImage, setPageImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isTtsFinished, setIsTtsFinished] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [initialSpeed, setInitialSpeed] = useState('1.0배속');
  const [initialSize, setInitialSize] = useState('MEDIUM');

  // 모달창
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);
  const [isYesNoModalVisible, setIsYesNoModalVisible] = useState(false);

  const openSettingModal = () => {
    setIsSettingModalVisible(true);
  };

  const closeSettingModal = () => {
    setIsSettingModalVisible(false);
  };

  const openYesNoModal = () => {
    setIsYesNoModalVisible(true);
  };

  const closeYesNoModal = () => {
    setIsYesNoModalVisible(false);
  };

  // nextStep 버튼
  const [nextStepVisible, setNextStepVisible] = useState(false);

  // 모르는 단어 조회
  const [wordUrl, setWordUrl] = useState('');
  const [isWordModalVisible, setIsWordModalVisible] = useState(false);

  const handleWordClick = async word => {
    if (!isTtsFinished) return;
    const cleanedWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').trim();
    const url = `https://en.dict.naver.com/#/search?query=${cleanedWord}`;
    setWordUrl(url);
    setIsWordModalVisible(true);
  };

  const closeWordModal = () => {
    setIsWordModalVisible(false);
    setWordUrl('');
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchBookDetails();
      await fetchSettings();
      setIsLoading(false);
    };
    loadData();
  }, [profileId, bookId]);

  // 페이지 세부정보 조회
  const fetchPageDetails = async pageNumber => {
    try {
      const response = await fetchWithAuth(
        `/pages/detail?profileId=${profileId}&bookId=${bookId}&pageNum=${pageNumber}`,
      );
      const result = await response.json();

      console.log('페이지 세부정보:', result);

      if (response.status === 200) {
        const pageData = result.data;
        setBookText(pageData.content);
        setPageImage(pageData.image);
        setHighlightedWords(
          (pageData.unknownWords || []).map(word => ({
            word: word.unknownWord,
            id: word.unknownWordId,
          })),
        ); // 페이지에 포함된 모르는 단어들을 하이라이트 표시
        setCurrentPage(pageNumber);
      } else {
        Alert.alert('Error', '페이지 세부정보 불러오기 실패');
      }
    } catch (error) {
      console.error('페이지 세부정보 불러오기 실패', error);
      Alert.alert('Error', '페이지 세부정보 불러오기 실패');
    }
  };

  // 책 세부정보 조회
  const fetchBookDetails = async () => {
    try {
      const response = await fetchWithAuth(
        `/books/detail?profileId=${profileId}&bookId=${bookId}`,
      );
      const result = await response.json();
      console.log('책 세부정보 응답', result);

      if (response.status === 200) {
        setTitle(result.data.title);
        setTotalPageCount(result.data.totalPageCount);
        const initialPage = result.data.currentPage + 1;
        setCurrentPage(initialPage);
        await fetchPageDetails(initialPage);
        setIsLoading(false); // 로딩 완료
      } else {
        Alert.alert('Error', '책 세부정보 불러오기 실패');
      }
    } catch (error) {
      console.error('책 세부정보 불러오기 실패', error);
      Alert.alert('Error', '책 세부정보 불러오기 실패');
    }
  };

  // 설정 세부정보 조회
  const fetchSettings = async () => {
    try {
      const response = await fetchWithAuth(
        `/settings/detail?profileId=${profileId}&bookId=${bookId}`,
      );
      const result = await response.json();
      console.log('설정 세부정보 응답', result);

      if (response.status === 200) {
        const {fontSize, readingSpeed} = result.data;
        setInitialSpeed(
          readingSpeed === 'SLOW'
            ? '0.5배속'
            : readingSpeed === 'SLIGHTLY_SLOW'
            ? '0.75배속'
            : readingSpeed === 'NORMAL'
            ? '1.0배속'
            : readingSpeed === 'SLIGHTLY_FAST'
            ? '1.25배속'
            : '1.5배속',
        );
        setInitialSize(fontSize);
        setFontSize(
          fontSize === 'SMALL' ? 14 : fontSize === 'MEDIUM' ? 18 : 22,
        );
      } else {
        console.log('설정 세부정보 불러오기 실패:', result);
        Alert.alert('Error', '설정 세부정보 불러오기 실패');
      }
    } catch (error) {
      console.error('설정 세부정보 불러오기 실패', error);
      Alert.alert('Error', '설정 세부정보 불러오기 실패');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchBookDetails();
      await fetchSettings();
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleSpeedFilter = speed => {
    setNextStepVisible(false);
    setIsTtsFinished(false);
    Tts.stop();
    setInitialSpeed(speed);
  };

  useEffect(() => {
    const setTtsRate = speed => {
      let ttsRate;
      switch (speed) {
        case '0.5배속':
          ttsRate = 0.15;
          break;
        case '0.75배속':
          ttsRate = 0.3;
          break;
        case '1.0배속':
          ttsRate = 0.55;
          break;
        case '1.25배속':
          ttsRate = 0.8;
          break;
        case '1.5배속':
          ttsRate = 1.05;
          break;
        default:
          ttsRate = 0.55;
      }
      Tts.setDefaultRate(ttsRate);
    };

    Tts.setDefaultLanguage('en-US');
    setTtsRate(initialSpeed); // initialSpeed를 기반으로 속도 설정
    Tts.setDefaultPitch(1.0);

    Tts.voices().then(voices => {
      const voice = voices.find(
        v => v.language === 'en-US' && v.name.includes('female'),
      );
      if (voice) {
        Tts.setDefaultVoice(voice.id);
      }
    });

    // 음성이 끝났을 때 이벤트 리스너 추가
    const handleFinish = () => {
      setIsTtsFinished(true);
      setNextStepVisible(true);
      startBlinking();
    };

    const finishListener = Tts.addListener('tts-finish', handleFinish);

    setNextStepVisible(false);
    setIsTtsFinished(false);


    return () => {
      finishListener.remove();
    };
  }, [initialSpeed]);

  useEffect(() => {
    setIsTtsFinished(false);
    setNextStepVisible(false);
    if (bookText) {
      Tts.speak(bookText);
    }
  }, [bookText]);

  useEffect(() => {
    setNextStepVisible(false);
    if (bookText) {
      Tts.stop();
      Tts.speak(bookText);
    }
  }, [initialSpeed]);

  // 다른 페이지 이동시 TTS 멈춤
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        Tts.stop();
        setNextStepVisible(false);

      };
    }, []),
  );

  // 백그라운드 이동시 TTS 멈춤
  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (nextAppState.match(/inactive|background/)) {
        Tts.stop();
        setNextStepVisible(false);
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const blinkAnim = useRef(new Animated.Value(1)).current;

  const startBlinking = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const goNextStep = () => {
    const nextPage = currentPage + 1;
    setNextStepVisible(false);
    if (nextPage <= totalPageCount) {
      fetchPageDetails(nextPage);
    } else {
      navigation.navigate('Quiz', {
        profileId: profileId,
        bookId: bookId,
      });
    }
  };

  // 하이라이트 기능
  const [highlightedWord, setHighlightedWord] = useState(null);
  const [highlightModalVisible, setHighlightModalVisible] = useState(false);
  const [highlightedWords, setHighlightedWords] = useState([]);
  const [highlightModalPosition, setHighlightModalPosition] = useState({
    top: 0,
    left: 0,
  });

  const handleLongPress = (word, event) => {
    if (!isTtsFinished) return;
    const cleanedWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').trim();
    const {pageY, pageX} = event.nativeEvent;
    setHighlightedWord(cleanedWord);
    setHighlightModalPosition({top: pageY - 57, left: pageX - 75}); // 단어 위치 위로 모달 배치
    setHighlightModalVisible(true);
  };

  const confirmHighlight = async () => {
    try {
      const response = await fetchWithAuth(
        `/unknownwords/create?profileId=${profileId}&bookId=${bookId}&pageNum=${currentPage}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            unknownWord: highlightedWord,
            position: highlightedWords.length + 1,
          }),
        },
      );

      if (response.status !== 200) {
        Alert.alert('Error', '단어 저장 실패');
      } else {
        const result = await response.json();
        console.log(result); // 저장된 단어 결과 확인
        const newHighlightedWord = {
          word: highlightedWord,
          id: result.data.unknownwordId,
        };
        setHighlightedWords(prev => [...prev, newHighlightedWord]);
        setHighlightModalVisible(false);
      }
    } catch (error) {
      Alert.alert('Error', '단어 저장 실패');
    }
  };

  const cancelHighlight = async () => {
    const highlightedWordObj = highlightedWords.find(
      item => item.word === highlightedWord,
    );

    if (highlightedWordObj) {
      try {
        const response = await fetchWithAuth(
          `/unknownwords/delete/${highlightedWordObj.id}`,
          {
            method: 'DELETE',
          },
        );

        if (response.status !== 200) {
          const result = await response.json();
          console.log('단어 삭제 실패:', result);
          Alert.alert('Error', '단어 삭제 실패');
        } else {
          console.log(await response.json());
          setHighlightedWords(prev =>
            prev.filter(item => item.word !== highlightedWord),
          );
          setHighlightedWord(null);
          setHighlightModalVisible(false);
        }
      } catch (error) {
        console.error('단어 삭제 실패', error);
        Alert.alert('Error', '단어 삭제 실패');
      }
    } else {
      setHighlightedWord(null);
      setHighlightModalVisible(false);
    }
  };

  const renderWord = (word, index) => {
    const cleanedWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').trim();
    const highlightedWordObj = highlightedWords.find(
      item => item.word === cleanedWord,
    );
    const isHighlighted = !!highlightedWordObj;

    if (cleanedWord === '') {
      return (
        <Text key={index} style={[styles.bookText, {fontSize}]}>
          {word}
        </Text>
      );
    }
    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleWordClick(cleanedWord)}
        onLongPress={event => handleLongPress(cleanedWord, event)}>
        <Text
          style={[
            styles.bookText,
            {fontSize},
            isHighlighted && styles.highlightedText,
          ]}>
          {word}
        </Text>
      </TouchableOpacity>
    );
  };

  const closeHighlightModal = () => {
    setHighlightModalVisible(false);
    setHighlightedWord(null);
  };

  const handleModalBackgroundPress = () => {
    closeHighlightModal();
  };

  const words = bookText.split(/(\s+)/);

  const handleSizeFilter = fontSizeValue => {
    switch (fontSizeValue) {
      case 'SMALL':
        setFontSize(14);
        break;
      case 'MEDIUM':
        setFontSize(18);
        break;
      case 'LARGE':
        setFontSize(22);
        break;
      default:
        setFontSize(18);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={BookBg}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <>
            <ImageBackground source={{uri: pageImage}} style={styles.page}>
              <View style={styles.iconBox}>
                <TouchableOpacity style={styles.icon} onPress={openYesNoModal}>
                  <Ionic name="home-outline" size={35} color="black" />
                </TouchableOpacity>
                <YesNoModal
                  isVisible={isYesNoModalVisible}
                  onClose={closeYesNoModal}
                  title={'정말 중단하시겠습니까?'}
                  subtitle={`다시 동화를 읽을 때 \n 현재 페이지부터 읽으실 수 있습니다.`}
                  buttonText1={'중단하기'}
                  linkTo={'BookShelf'}
                  buttonText2={'취소'}
                  profileId={profileId}
                  bookId={bookId}
                  currentPage={currentPage - 1}
                />
                <TouchableOpacity
                  style={styles.icon}
                  onPress={openSettingModal}>
                  <Ionic name="settings-outline" size={35} color="black" />
                </TouchableOpacity>
                <SettingModal
                  isVisible={isSettingModalVisible}
                  onClose={closeSettingModal}
                  handleSizeFilter={handleSizeFilter}
                  handleSpeedFilter={handleSpeedFilter}
                  profileId={profileId}
                  bookId={bookId}
                  initialSize={initialSize}
                  initialSpeed={initialSpeed}
                  currentText={bookText}
                />
              </View>
            </ImageBackground>

            <View style={styles.textBox}>
              <View style={styles.titleBox}>
                <Text style={styles.bookTitle}>{title}</Text>
              </View>
              <View style={styles.bookTextContainer}>
                {words.map((word, index) => renderWord(word, index))}
              </View>
            </View>

            {nextStepVisible && (
              <>
                <Animated.View style={[styles.wordBox, {opacity: blinkAnim}]}>
                  <Text style={styles.wordText}>
                    Click on a word {'\n'} you don't know
                  </Text>
                </Animated.View>
                <NextStep goNextStep={goNextStep} />
              </>
            )}
            {totalPageCount > 0 && currentPage >= 0 && (
              <ProgressBar
                pages={totalPageCount.toString()}
                now={(currentPage - 1).toString()}
              />
            )}
          </>
        )}
        <Modal
          visible={highlightModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={cancelHighlight}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleModalBackgroundPress}
            style={styles.modalBackground}>
            <View style={[styles.highlightModal, highlightModalPosition]}>
              <View style={styles.highlightModalButtons}>
                <TouchableOpacity onPress={confirmHighlight}>
                  <Text style={styles.highlightModalText}>하이라이트</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={cancelHighlight}>
                  <Text style={styles.highlightModalText}>취소</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          visible={isWordModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeWordModal}>
          <View style={styles.modalContainer}>
            <View style={styles.webviewContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeWordModal}>
                <Ionic name="close" size={23} color="black" />
              </TouchableOpacity>
              <WebView source={{uri: wordUrl}} />
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF7EC',
  },
  page: {
    width: '70.5%',
    height: '100%',
  },

  titleBox: {
    marginBottom: 20,
  },
  textBox: {
    width: '35%',
    justifyContent: 'center',
    position: 'absolute',
    top: '3%',
    left: '57%',
    borderRadius: 10,
    padding: 10,
  },
  bookTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 38,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    fontFamily: 'TAEBAEKfont',
  },
  iconBox: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'baseline',
    margin: 20,
  },
  icon: {
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  bookText: {
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 30,
    fontFamily: 'TAEBAEKfont',
  },
  wordBox: {
    width: 150,
    height: 70,
    position: 'absolute',
    bottom: '10%',
    left: '80%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(78,90,140,0.8)',
    borderStyle: 'solid',
    justifyContent: 'center',
  },
  wordText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'rgba(78,90,140,0.8)',
    fontFamily: 'TAEBAEKmilkyway',
  },
  highlightedText: {
    backgroundColor: 'yellow',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightModal: {
    position: 'absolute',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  highlightModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  highlightModalText: {
    paddingHorizontal: 10,
    fontFamily: 'TAEBAEKmilkyway',
  },
  emptyContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webviewContainer: {
    width: '80%',
    height: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  closeButton: {
    padding: 5,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    alignItems: 'flex-end',
  },
});
export default BookRead;
