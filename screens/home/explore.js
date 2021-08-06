import React, { Component } from 'react';
import { Text, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import firebase from "firebase";

export default class ExploreScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Explore</Text>
            </View>
        );
    }
}
