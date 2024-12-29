import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FBF7EC',
  },
  quizBox: {
    width: 710,
    height: 440,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 'auto', // SafeAreaView의 하단으로 이동
    marginBottom: 120, // 하단 여백 추가
    position: 'relative', // 상대 위치 지정
  },
  quizText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#4E5A8C',
    marginBottom: 20,
    textAlign: 'center',
    bottom: 40,
  },
  button: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 90,
    position: 'absolute',
    bottom: -50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questionMark: {
    position: 'absolute',
    top: 40,
    width: 400,
    height: 250,
  },
  ovalContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // 중앙 정렬
    marginTop: 30, // 간격을 조정하여 타원들이 위로 올라가도록
    width: '100%',
  },
  oval: {
    height: 10, // 타원의 높이
  },
});
