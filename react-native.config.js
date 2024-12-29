module.exports = {
  assets: ['./assets/fonts'], // 커스텀 폰트 경로
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        android: null, // 자동 폰트 복사를 비활성화
      },
    },
  },
};