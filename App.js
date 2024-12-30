import { LogBox } from 'react-native';

// 특정 경고 메시지를 무시하도록 설정
LogBox.ignoreLogs([
  '`new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method',
  '`new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method',
]);

import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { AuthProvider } from './src/context/AuthContext';

import Login from './src/screens/auth/Login';
import Signin from './src/screens/auth/Signin';
import BookShelf from './src/screens/book/BookShelf';
import BookRead from './src/screens/book/BookRead';
import Quiz from './src/screens/book/Quiz';
import Profile from './src/screens/profile/Profile';
import Question from './src/screens/question/Question';
import QuizEnd from './src/screens/book/QuizEnd';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 300); // 0.5초 후에 스플래시 화면을 숨깁니다.
  }, []);

  return (
    <AuthProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signin" component={Signin} />
        <Stack.Screen name="BookShelf" component={BookShelf} />
        <Stack.Screen name="BookRead" component={BookRead} />
        <Stack.Screen name="Quiz" component={Quiz} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Question" component={Question} />
        <Stack.Screen name="QuizEnd" component={QuizEnd} />
      </Stack.Navigator>
    </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
