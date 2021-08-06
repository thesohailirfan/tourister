import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from 'firebase';


function ExploreScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Explore</Text>
    </View>
  );
}

function JourneyScreen() {

    function handleLogout() {
        firebase.auth().signOut().then(() => {
            console.log(' Sign-out successful.')
        }).catch((error) => {
            console.log(error);
        });
    }
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Journey</Text>
        <Button
                onPress={handleLogout}
                title="Log Out"
                color="#000000"
            />
      </View>
    );
}
const Tab = createBottomTabNavigator();

export default function HomeScreen() {
    return (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
  
              if (route.name === 'Journey') {
                iconName = focused ? 'journal' : 'journal-outline';
              } else if (route.name === 'Explore') {
                iconName = focused ? 'search-circle' : 'search-circle-outline';
              }
  
              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
          })}
        >
            <Tab.Screen name="Journey" component={JourneyScreen} />
            <Tab.Screen name="Explore" component={ExploreScreen} />
        </Tab.Navigator>
    );
  }