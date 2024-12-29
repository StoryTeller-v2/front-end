import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FBF7EC', // Quiz와 동일한 배경색
  },
  quizBox: {
    width: 1000,
    height: 400, // 버튼 아래로 내리기 위해 높이 조정
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginBottom: 10, // 버튼 아래 여백 추가
  },
  quizText: {
    fontSize: 33, // 기존보다 크게
    fontWeight: 'bold', // 굵게
    marginBottom: 20,
    textAlign: 'center',
    color: '#393939',
    fontFamily: 'TAEBAEKfont',
  },
  buttonContainer: {
    flexDirection: 'row', // 가로로 정렬
    justifyContent: 'center', // 가운데 정렬
    alignItems: 'center', // 중앙 정렬
    marginTop: 20, // 버튼과 quizBox 사이 간격 추가
  },
  button: {
    width: 120, // 버튼 너비
    height: 120, // 버튼 높이
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60, // 원 모양의 버튼을 위해 반지름을 넓게 설정
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60, // 그라데이션도 반지름을 넓게 설정하여 원형 유지
  },
  icon: {
    width: 60, // 아이콘의 너비
    height: 60, // 아이콘의 높이
  },
  goodJobContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  goodJobImage: {
    width: 800, // 이미지 크기 조정
    height: 800,
  },
});