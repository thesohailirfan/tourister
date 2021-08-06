import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
      <Tab.Navigator>
            <Tab.Screen name="journey" component={JourneyScreen} />
            <Tab.Screen name="explore" component={ExploreScreen} />
      </Tab.Navigator>
  );
}