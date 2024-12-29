import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './styles';

const Quiz = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { profileId, bookId } = route.params || {};

  const startQuiz = () => {
    navigation.navigate('Question', {
      profileId: profileId,
      bookId: bookId,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../../../assets/images/QuestionMark.png')}
        style={styles.questionMark}
      />
      <View style={styles.quizBox}>
        <Text style={styles.quizText}>
          잘 읽었나요?{'\n'}퀴즈를 풀어봅시다!
        </Text>
        <LinearGradient
          colors={['#FF8C43', '#F8C683']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}>
          <TouchableOpacity style={styles.buttonContent} onPress={startQuiz}>
            <Text style={styles.buttonText}>→</Text>
          </TouchableOpacity>
        </LinearGradient>
        <View style={styles.ovalContainer}>
          <View
            style={[
              styles.oval,
              { backgroundColor: '#DCDFE3', width: 60, borderRadius: 5 },
            ]}></View>
          <View
            style={[
              styles.oval,
              {
                backgroundColor: '#F8C784',
                width: 60,
                borderRadius: 5,
                marginLeft: 25,
              },
            ]}></View>
          <View
            style={[
              styles.oval,
              {
                backgroundColor: '#DCDFE3',
                width: 60,
                borderRadius: 5,
                marginLeft: 25,
              },
            ]}></View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Quiz;
