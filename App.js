import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import "./screens/components/firebase"

import HomeScreen from './screens/home/home'
import LoginScreen from './screens/auth/userLogin'
import SignUpScreen from './screens/auth/userSignUp'
import firebase from 'firebase';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const Stack = createNativeStackNavigator();


function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#000000" />
      <Text>Loading</Text>
    </View>
  );
}

export default function App() {

  const [isSignedin, setisSignedin] = React.useState(false);
  const [isLoaded, setisLoaded] = React.useState(false);

  firebase.auth().onAuthStateChanged((user) => {
    setisLoaded(true);
    if (user) {
      setisSignedin(true);
    } else {
      setisSignedin(false);
    }
  });
  return (
    <NavigationContainer>
      {isLoaded &&
      <Stack.Navigator screenOptions={{headerShown: false}}>
        
        {!isSignedin &&

          <React.Fragment>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />  
          </React.Fragment>
        }
         
        {isSignedin &&
          <React.Fragment>
            <Stack.Screen name="Home" component={HomeScreen} />
          </React.Fragment>
        }   
           
      </Stack.Navigator>
      }

      {!isLoaded &&
        <LoadingScreen/>
      }
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
