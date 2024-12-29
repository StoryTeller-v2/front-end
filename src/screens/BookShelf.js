import React, {useState, useEffect, useCallback} from 'react';
import {Image, View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import VoiceInputModal from '../components/VoiceInputModal';
import fetchWithAuth from '../api/fetchWithAuth';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../context/AuthContext';

const BookShelf = () => {
  const [selected, setSelected] = useState('ALL');
  const [modalVisible, setModalVisible] = useState(false);
  const [books, setBooks] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [imageUrl, setImageUrl] = useState(''); // 프로필 이미지 URL 상태

  const {profileId} = useAuth(); // useAuth 훅을 통해 profileId 받아오기
  console.log(`메인 페이지의 프로필 id: ${profileId}`);
  const navigation = useNavigation();

  // 책 목록 가져오기
  const fetchBooks = useCallback(async () => {
    try {
      let endpoint = `/books/booklist?profileId=${profileId}`;
      if (selected === 'FAVORITE') {
        endpoint = `/books/favorites?profileId=${profileId}`;
      } else if (selected === 'READING') {
        endpoint = `/books/reading?profileId=${profileId}`;
      }
      const response = await fetchWithAuth(endpoint, {method: 'GET'});
      const result = await response.json();
      if (
        result.status === 200 &&
        (result.code === 'SUCCESS_RETRIEVE_BOOKS' ||
          result.code === 'SUCCESS_RETRIEVE_FAVORITE_BOOKS' ||
          result.code === 'SUCCESS_RETRIEVE_READING_BOOKS')
      ) {
        setBooks(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch books:', error);
    }
  }, [selected, profileId]);

  // 프로필 정보 가져오기
  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetchWithAuth(`/profiles/${profileId}`, {
        method: 'GET',
      });
      const result = await response.json();
      if (result.status === 200 && result.code === 'SUCCESS_GET_PROFILE') {
        setImageUrl(result.data.imageUrl); // 프로필 이미지 설정
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  }, [profileId]);

  useEffect(() => {
    fetchBooks();
    fetchProfile(); // 프로필 정보 가져오기
  }, [fetchBooks, fetchProfile, selected, refreshKey]);

  // 모달 토글
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  // 책 클릭 시
  const handleBookPress = bookId => {
    navigation.navigate('BookRead', {profileId, bookId});
  };

  // 즐겨찾기 토글
  const toggleFavorite = async bookId => {
    try {
      const response = await fetchWithAuth(
        `/books/favorite?profileId=${profileId}&bookId=${bookId}`,
        {
          method: 'PUT',
        },
      );
      const result = await response.json();
      if (result.status === 200 && result.code === 'SUCCESS_UPDATE_FAVORITE') {
        setBooks(prevBooks =>
          prevBooks.map(book =>
            book.bookId === bookId
              ? {...book, isFavorite: !book.isFavorite}
              : book,
          ),
        );
      }
    } catch (error) {
      console.error('Failed to update favorite status:', error);
    }
  };

  // 책장 렌더링
  const renderShelf = shelfIndex => {
    const booksForShelf = books.slice(shelfIndex * 4, (shelfIndex + 1) * 4);

    return (
      <View key={shelfIndex} style={styles.shelfContainer}>
        <Image
          source={require('../../assets/images/shelf.png')}
          style={styles.shelf}
        />
        {booksForShelf.map((book, index) => (
          <View
            key={book.bookId}
            style={[styles.bookButton, {left: 355 + index * 160}]}>
            <TouchableOpacity onPress={() => handleBookPress(book.bookId)}>
              <Image source={{uri: book.coverImage}} style={styles.bookImage} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => toggleFavorite(book.bookId)}>
              <Icon
                name={book.isFavorite ? 'star' : 'star-o'}
                size={24}
                color={book.isFavorite ? 'gold' : 'gray'}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  const numberOfShelves = Math.max(Math.ceil(books.length / 4), 3);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.radioContainer}>
        <RadioButton
          title="ALL"
          selected={selected === 'ALL'}
          onPress={() => setSelected('ALL')}
          style={styles.radioButtonAll}
          textStyle={styles.radioButtonTextAll}
        />
        <RadioButton
          title="FAVORITE"
          selected={selected === 'FAVORITE'}
          onPress={() => setSelected('FAVORITE')}
          style={styles.radioButtonFavorite}
          textStyle={styles.radioButtonTextFavorite}
        />
        <RadioButton
          title="READING"
          selected={selected === 'READING'}
          onPress={() => setSelected('READING')}
          style={styles.radioButtonReading}
          textStyle={styles.radioButtonTextReading}
        />
      </View>
      <View style={styles.shelfWrapper}>
        {Array.from({length: numberOfShelves}).map((_, index) =>
          renderShelf(index),
        )}
      </View>

      <TouchableOpacity
        style={styles.squareButton}
        onPress={() => {
          console.log('Profile 버튼이 눌렸습니다.');
          navigation.navigate('Profile');
        }}>
        {imageUrl ? ( // imageUrl이 있으면 해당 이미지 사용
          <Image source={{uri: imageUrl}} style={styles.squareButtonImage} />
        ) : (
          <Image
            source={require('../../assets/images/temp_profile_pic.png')} // 기본 이미지
            style={styles.squareButtonImage}
          />
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.roundButton} onPress={toggleModal}>
        <LinearGradient
          colors={['#2170CD', '#8FA0E8']}
          style={styles.roundButtonGradient}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <Image
            source={require('../../assets/images/drawing.png')}
            style={styles.roundButtonImage}
          />
        </LinearGradient>
      </TouchableOpacity>
      <VoiceInputModal
        visible={modalVisible}
        onClose={toggleModal}
        message="동화를 만들고 싶은 주제를 말해주세요"
        profileId={profileId}
        fetchWithAuth={fetchWithAuth}
        refreshBooks={() => setRefreshKey(prevKey => prevKey + 1)}
      />
    </SafeAreaView>
  );
};

const RadioButton = ({title, selected, onPress, style, textStyle}) => (
  <TouchableOpacity onPress={onPress} style={[styles.radioButton, style]}>
    {selected ? (
      <LinearGradient
        colors={['#F8C683', '#FF8C43']}
        style={[styles.radioButtonGradient, styles.selected, style]}>
        <Text
          style={[
            styles.radioButtonText,
            styles.radioButtonTextSelected,
            textStyle,
          ]}>
          {title}
        </Text>
      </LinearGradient>
    ) : (
      <View style={[styles.radioButtonGradient, style]}>
        <Text style={[styles.radioButtonText, textStyle]}>{title}</Text>
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 30,
    backgroundColor: '#FBF7EC',
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    marginBottom: 25,
    paddingTop: 10,
  },
  radioButton: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  radioButtonAll: {
    marginRight: -35,
    paddingHorizontal: 15,
    width: 90,
    height: 45,
  },
  radioButtonFavorite: {
    marginLeft: -25,
    paddingHorizontal: 15,
    width: 180,
    height: 45,
  },
  radioButtonReading: {
    marginLeft: -65,
    paddingHorizontal: 15,
    width: 170,
    height: 45,
  },
  radioButtonGradient: {
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    borderWidth: 0,
    borderColor: '#FF8C43',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  radioButtonText: {
    color: '#C3C3C3',
    fontWeight: 'bold',
    fontSize: 30,
  },
  radioButtonTextAll: {},
  radioButtonTextFavorite: {},
  radioButtonTextReading: {},
  radioButtonTextSelected: {
    color: '#000',
  },
  shelfWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: 100,
  },
  shelfContainer: {
    width: '100%',
    marginBottom: 70,
    position: 'relative',
  },
  shelf: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    top: 20,
  },
  bookButton: {
    position: 'absolute',
    top: -68,
  },
  bookImage: {
    width: 140,
    height: 130,
    resizeMode: 'contain',
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: 'transparent',
  },
  squareButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 110,
    height: 110,
    borderRadius: 30,
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  squareButtonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 30,
  },
  roundButton: {
    position: 'absolute',
    bottom: 5,
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundButtonImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

export default BookShelf;
