import React, { useState, useEffect, useCallback } from 'react';
import { Image, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import VoiceInputModal from '../../../components/modals/VoiceInputModal';
import fetchWithAuth from '../../../api/fetchWithAuth';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';
import { styles } from './styles';

const BookShelf = () => {
  const [selected, setSelected] = useState('ALL');
  const [modalVisible, setModalVisible] = useState(false);
  const [books, setBooks] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [imageUrl, setImageUrl] = useState('');

  const { profileId } = useAuth();
  const navigation = useNavigation();

  // 책 목록 가져오기
  const fetchBooks = useCallback(async () => {
    try {
      let endpoint = `/profiles/${profileId}/books`;
      if (selected === 'FAVORITE') {
        endpoint = `/profiles/${profileId}/books/favorites`;
      } else if (selected === 'READING') {
        endpoint = `/profiles/${profileId}/books/reading`;
      }
      const response = await fetchWithAuth(endpoint, { method: 'GET' });
      const result = await response.json();
      if ( result.status === 200 ) {
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
      if ( result.status === 200 ) {
        setImageUrl(result.data.imageUrl);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  }, [profileId]);

  useEffect(() => {
    fetchBooks();
    fetchProfile();
  }, [fetchBooks, fetchProfile, selected, refreshKey]);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleBookPress = bookId => {
    navigation.navigate('BookRead', { profileId, bookId });
  };

  const toggleFavorite = async bookId => {
    try {
      const response = await fetchWithAuth(
        `/profiles/${profileId}/books/${bookId}/favorite`,
        {
          method: 'PUT',
        },
      );
      const result = await response.json();
      if ( result.status === 200 ) {
        setBooks(prevBooks =>
          prevBooks.map(book =>
            book.bookId === bookId
              ? { ...book, isFavorite: !book.isFavorite }
              : book,
          ),
        );
      }
    } catch (error) {
      console.error('Failed to update favorite status:', error);
    }
  };

  const renderShelf = shelfIndex => {
    const booksForShelf = books.slice(shelfIndex * 4, (shelfIndex + 1) * 4);

    return (
      <View key={shelfIndex} style={styles.shelfContainer}>
        <Image
          source={require('../../../../assets/images/shelf.png')}
          style={styles.shelf}
        />
        {booksForShelf.map((book, index) => (
          <View
            key={book.bookId}
            style={[styles.bookButton, { left: 355 + index * 160 }]}
          >
            <TouchableOpacity onPress={() => handleBookPress(book.bookId)}>
              <Image source={{ uri: book.coverImage }} style={styles.bookImage} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => toggleFavorite(book.bookId)}
            >
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
        {Array.from({ length: numberOfShelves }).map((_, index) =>
          renderShelf(index),
        )}
      </View>

      <TouchableOpacity
        style={styles.squareButton}
        onPress={() => {
          console.log('Profile 버튼이 눌렸습니다.');
          navigation.navigate('Profile');
        }}
      >
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.squareButtonImage} />
        ) : (
          <Image
            source={require('../../../../assets/images/temp_profile_pic.png')}
            style={styles.squareButtonImage}
          />
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.roundButton} onPress={toggleModal}>
        <LinearGradient
          colors={['#2170CD', '#8FA0E8']}
          style={styles.roundButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Image
            source={require('../../../../assets/images/drawing.png')}
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

const RadioButton = ({ title, selected, onPress, style, textStyle }) => (
  <TouchableOpacity onPress={onPress} style={[styles.radioButton, style]}>
    {selected ? (
      <LinearGradient
        colors={['#F8C683', '#FF8C43']}
        style={[styles.radioButtonGradient, styles.selected, style]}
      >
        <Text
          style={[
            styles.radioButtonText,
            styles.radioButtonTextSelected,
            textStyle,
          ]}
        >
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

export default BookShelf;
