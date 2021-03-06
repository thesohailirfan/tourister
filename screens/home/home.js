import * as React from "react";
import { Text, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import firebase from "firebase";
import JourneyScreen from "./journey";
import ExploreScreen from "./explore"
import { theme } from "../asset/theme";
import ViewProfile from "./userprofile";


const Tab = createBottomTabNavigator();



export default function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Journey") {
            iconName = focused ? "journal" : "journal-outline";
          } else if (route.name === "Explore") {
            iconName = focused ? "search-circle" : "search-circle-outline";
          }else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primaryDark,
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Journey" component={JourneyScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Profile" component={ViewProfile} />
    </Tab.Navigator>
  );
}
