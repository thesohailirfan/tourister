import React, { Component, useState, useEffect } from 'react';
import { Text, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import firebase from "firebase";
import * as Location from 'expo-location';
  
export default class JourneyScreen extends Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }

    componentDidMount(){
        
    }

    handleLogout() {
        firebase
          .auth()
          .signOut()
          .then(() => {
            console.log(" Sign-out successful.");
          })
          .catch((error) => {
            console.log(error);
          });
      }
  
    render() {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Journey</Text>
                    <GetLocations/>
                <Button onPress={this.handleLogout} title="Log Out" color="#000000" />
            </View>
        );
    }
  }
  

 function GetLocations() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [addLocation, setAddLocation] = useState(false);
  

    const getLocations = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
    }

    function handleShow() {
        setAddLocation(true)
    }

    function handleAddLocation() {
        getLocations()
        setAddLocation(false)
    }

    useEffect(() => {
      
    }, []);
  
    let text = 'Waiting..';
    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = JSON.stringify(location);
    }
  
    return (
      <View >
        <Text >{text}</Text>

        {
            addLocation &&

            <View>
                <Text>Create New Location</Text>
                
                <Button onPress={handleAddLocation} title="Upload" color="#000000" />
            </View>
        }

        {
            !addLocation &&
            <Button onPress={handleShow} title="Add Location" color="#000000" />
        }
      </View>
    );
}


  