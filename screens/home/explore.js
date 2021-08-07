import React, { Component } from 'react';
import { Text, View, Button, ScrollView } from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import firebase from "firebase";

var db = firebase.firestore();



export default function ExploreScreen({ navigation}) {
    const[data, setdata] = React.useState([])

    function handleView(journey){
      console.log(journey["journeyID"]);
      navigation.navigate('ViewJourney', {
        doc : journey,
      });
    }

    const dateFormat = (timestamp)=>{
      var dateNow = new Date(timestamp);
        var day = dateNow.toLocaleString("en", {day: "2-digit",})
        var month = dateNow.toLocaleString("en", {month: "short",})
        var time = dateNow.toLocaleString("ru", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
        var date = day
        console.log(date)
        return date;
    }

    if(data.length === 0){
      db.collection("journeys").where("endPoint", "!=", null)
      .get()
      .then((querySnapshot) => {
          let temp = []
          querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              
              temp.push(
                doc.data(),
              )

              console.log(doc.data()["uid"])

              
          });
          setdata(temp)
          
      })
      .catch((error) => {
          console.log("Error getting documents: ", error);
      });
    }

    console.log(data)

  return (
    <ScrollView style={{ flex: 1}}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View>
            <Text>A trip to the Mysore</Text>
            <Text> by Sohail Irfan </Text>
            <Button onPress={()=>handleView("Abc")} title="View More" color="#000000" />
          </View>
          {
            data.map((doc,index) => {
              return(
                <View>
                  <Text>{doc["name"]}</Text>
                  <Text>{dateFormat(doc["timestamp"])}</Text>
                  <Button onPress={()=>handleView(doc)} title="View More" color="#000000" />
                </View>
              )
            })
          }
      </View>
    </ScrollView>
  )
}
