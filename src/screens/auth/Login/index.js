import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../context/AuthContext.js';
import Logo from '../../../../assets/images/logo.png';
import Kakao from '../../../../assets/images/kakao.png';
import Google from '../../../../assets/images/google.png';
import {
  login as kakaoLogin,
  logout as kakaoLogout,
  getProfile as kakaoGetProfile,
  getKakaoKeyHash,
} from '@react-native-seoul/kakao-login';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Config from '../../../config.js';
import {
  storeTokens,
  storeUser,
  getAccessToken,
  getRefreshToken,
} from '../../../utils/storage.js';
import { styles } from './styles';

const Login = ({ navigation }) => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '743052355294-uf3lfukm8q5t7ko63aisv46laioqi539.apps.googleusercontent.com',
      offlineAccess: true,
      // forceCodeForRefreshToken: true,
    });
  }, []);

  const handleLogin = async () => {
    try {
      const formData = new FormData();
      formData.append('username', user);
      formData.append('password', password);

      console.log('Login URL:', `${Config.API_BASE_URL}/login`);
      const response = await fetch(`${Config.API_BASE_URL}/login`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      console.log('Server response:', response.status, data);

      if (response.ok) {
        const accessToken = response.headers.get('access');
        const refreshToken = response.headers.get('refresh');

        if (accessToken && refreshToken) {
          await storeTokens(accessToken, refreshToken);
          await storeUser(user);

          // 로그인 상태 업데이트
          login();

          const storedAccessToken = await getAccessToken();
          const storedRefreshToken = await getRefreshToken();
          console.log('Stored access token:', storedAccessToken);
          console.log('Stored refresh token:', storedRefreshToken);

          // Profile 화면으로 이동하면서 id값을 전달
          navigation.navigate('Profile', { userId: data.data.id });
          console.log('전달할 데이터:', data.data.id);
        } else {
          console.error('Invalid tokens:', data);
          Alert.alert('로그인 실패', '유효한 토큰이 제공되지 않았습니다.');
        }
      } else {
        console.error('Login failed:', data);
        Alert.alert('로그인 실패', data.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('로그인 에러', '로그인 중 오류가 발생했습니다.');
    }
  };

  const handleKakaoLogin = async () => {
    try {
      const token = await kakaoLogin();
      const profile = await kakaoGetProfile();

      if (token && profile) {
        const { id, nickname, email } = profile;

        const response = await fetch(`${Config.API_BASE_URL}/kakao-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: id,
            role: 'ROLE_USER',
            nickname: nickname,
            email: email,
          }),
        });

        const accessToken = response.headers.get('access');
        const refreshToken = response.headers.get('refresh');

        const data = await response.json();
        console.log('Server response data:', data);

        if (response.ok) {
          if (accessToken && refreshToken) {
            await storeTokens(accessToken, refreshToken);
            await storeUser(nickname);
            Alert.alert(
              '카카오 로그인 성공',
              `${nickname}님, StoryTeller에 오신것을 환영합니다`,
            );

            const storedAccessToken = await getAccessToken();
            const storedRefreshToken = await getRefreshToken();
            console.log('Stored access token:', storedAccessToken);
            console.log('Stored refresh token:', storedRefreshToken);

            // Profile 화면으로 이동하면서 id값을 전달
            navigation.navigate('Profile', { userId: data.data.id });
          } else {
            console.error('유효하지 않은 토큰:', data);
            Alert.alert('로그인 실패', '유효한 토큰이 제공되지 않았습니다.');
          }
        } else {
          console.error('로그인 실패:', data);
          Alert.alert('로그인 실패', data.message || '로그인에 실패했습니다.');
        }
      } else {
        Alert.alert('카카오 로그인 실패', '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('카카오 로그인 중 오류:', error);
      Alert.alert('카카오 로그인 에러', '로그인 중 오류가 발생했습니다.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();

      const { idToken } = userInfo.data;
      console.log('Google Signin userInfo:', userInfo);

      if (!idToken) {
        console.error('No idToken received', userInfo);
        throw new Error('No idToken received');
      }

      const role = 'ROLE_USER';

      const response = await fetch(`${Config.API_BASE_URL}/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: idToken,
          role: role,
        }),
      });

      const accessToken = response.headers.get('access');
      const refreshToken = response.headers.get('refresh');

      console.log(accessToken);
      console.log(refreshToken);
      const data = await response.json();
      console.log('Server response data:', data);

      if (response.ok && accessToken && refreshToken) {
        const { nickname } = data.data;

        await storeTokens(accessToken, refreshToken);
        await storeUser(nickname);

        Alert.alert(
          '구글 로그인 성공',
          `${nickname}님, StoryTeller에 오신것을 환영합니다`,
        );
        console.log('Stored Access Token:', accessToken);
        console.log('Stored Refresh Token:', refreshToken);

        // Profile 화면으로 이동하면서 id값을 전달
        navigation.navigate('Profile', { userId: data.data.id });
      } else {
        Alert.alert('구글 로그인 실패', '액세스 토큰을 받지 못했습니다.');
      }
    } catch (error) {
      console.error('Error during Google Signin:', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('로그인 취소', '로그인을 취소하셨습니다.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('로그인 진행 중', '로그인이 진행 중입니다.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert(
          'Google Play 서비스 오류',
          'Google Play 서비스가 설치되어 있지 않습니다.',
        );
      } else {
        Alert.alert(
          '로그인 에러',
          `로그인 중 오류가 발생했습니다: ${error.message}`,
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentWrapper}>
            <Image source={Logo} style={styles.logo} />

            <View style={styles.bigBox}>
              <View style={styles.textBox}>
                <Text style={[styles.titleText, styles.titleApp]}>
                  <Text style={styles.titleApp}>StoryTeller</Text>에
                </Text>
                <Text style={styles.titleText}>오신것을 환영합니다</Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.subTitle}>아이디</Text>
                <TextInput
                  placeholder="아이디를 입력해주세요"
                  value={user}
                  onChangeText={text => setUser(text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.subTitle}>비밀번호</Text>
                <TextInput
                  placeholder="비밀번호를 입력해주세요"
                  value={password}
                  onChangeText={text => setPassword(text)}
                  style={styles.input}
                  secureTextEntry={true}
                />
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                  <Text style={styles.buttonText}>로그인</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.orContainer}>
                <View style={styles.orHorizontal} />
                <View>
                  <Text style={styles.orText}>OR</Text>
                </View>
                <View style={styles.orHorizontal} />
              </View>
              <View style={styles.socialButtonContainer}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={handleKakaoLogin}
                >
                  <Image source={Kakao} style={styles.icon} />
                  <Text style={styles.socialButtonText}>
                    카카오로 로그인하기
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={handleGoogleLogin}
                >
                  <Image source={Google} style={styles.icon} />
                  <Text style={styles.socialButtonText}>구글로 로그인하기</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.signInContainer}>
                <Text style={styles.signIn}>계정이 없다면? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
                  <Text style={styles.signInBold}>회원가입</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
