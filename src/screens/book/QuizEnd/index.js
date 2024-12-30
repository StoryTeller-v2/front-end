import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Ionic from 'react-native-vector-icons/Ionicons';
import { styles } from './styles';

const QuizEnd = () => {
  const navigation = useNavigation();

  const startQuiz = () => {
    navigation.navigate('BookShelf');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.quizBox}>
        <Text style={styles.quizText}>
          퀴즈가 완료되었습니다. 축하합니다!{'\n'}더 많은 이야기를 탐험해
          보세요!
        </Text>
        <LinearGradient
          colors={['#FF8C43', '#F8C683']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <TouchableOpacity style={styles.buttonContent} onPress={startQuiz}>
            <Text style={styles.buttonText}>
              <Ionic name="home" size={45} color="white" />
            </Text>
          </TouchableOpacity>
        </LinearGradient>
        <View style={styles.ovalContainer}>
          <View
            style={[
              styles.oval,
              { backgroundColor: '#DCDFE3', width: 60, borderRadius: 5 },
            ]}
          ></View>
          <View
            style={[
              styles.oval,
              {
                backgroundColor: '#F8C784',
                width: 60,
                borderRadius: 5,
                marginLeft: 25,
              },
            ]}
          ></View>
          <View
            style={[
              styles.oval,
              {
                backgroundColor: '#DCDFE3',
                width: 60,
                borderRadius: 5,
                marginLeft: 25,
              },
            ]}
          ></View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default QuizEnd;
