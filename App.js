import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { AuthProvider } from './src/context/AuthContext';
import { getAccessToken, getUserId } from './src/utils/storage';
import { decode as atob } from 'base-64';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  '`new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method',
  '`new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method',
]);

import Login from './src/screens/auth/Login';
import Signin from './src/screens/auth/Signin';
import BookShelf from './src/screens/book/BookShelf';
import BookRead from './src/screens/book/BookRead';
import Quiz from './src/screens/book/Quiz';
import Profile from './src/screens/profile/Profile';
import Question from './src/screens/question/Question';
import QuizEnd from './src/screens/book/QuizEnd';
import SplashScreen from 'react-native-splash-screen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const [initialRoute, setInitialRoute] = useState('Login');
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = await getAccessToken();
        const storedUserId = await getUserId();
        
        if (accessToken && storedUserId) {
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          console.log('토큰 payload:', payload);
          
          if (payload.exp > Date.now() / 1000) {
            setUserId(storedUserId);
            setInitialRoute('Profile');
            console.log('저장된 userId:', storedUserId);
          } else {
            console.log('토큰이 만료됨');
            setInitialRoute('Login');
          }
        } else {
          console.log('토큰이나 userId가 없음');
          setInitialRoute('Login');
        }
      } catch (error) {
        console.error('토큰 확인 중 에러:', error);
        setInitialRoute('Login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading || !initialRoute) {
    return null;
  }

  return (
    <Stack.Navigator 
      initialRouteName={initialRoute}
      screenOptions={{headerShown: false}}
    >
      {initialRoute === 'Profile' && userId ? (
        <>
          <Stack.Screen 
            name="Profile" 
            component={Profile}
            initialParams={{ userId: userId }}
          />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signin" component={Signin} />
          <Stack.Screen name="BookShelf" component={BookShelf} />
          <Stack.Screen name="BookRead" component={BookRead} />
          <Stack.Screen name="Quiz" component={Quiz} />
          <Stack.Screen name="Question" component={Question} />
          <Stack.Screen name="QuizEnd" component={QuizEnd} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signin" component={Signin} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="BookShelf" component={BookShelf} />
          <Stack.Screen name="BookRead" component={BookRead} />
          <Stack.Screen name="Quiz" component={Quiz} />
          <Stack.Screen name="Question" component={Question} />
          <Stack.Screen name="QuizEnd" component={QuizEnd} />
        </>
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 300);
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;