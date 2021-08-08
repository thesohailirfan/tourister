import React, { Component } from "react";
import {
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import firebase from "firebase";

var db = firebase.firestore();

export default function ExploreScreen({ navigation }) {
  const [data, setdata] = React.useState([]);

  function handleView(journey) {
    console.log(journey["journeyID"]);
    navigation.navigate("ViewJourney", {
      doc: journey,
    });
  }

  const dateFormat = (timestamp) => {
    var dateNow = new Date(timestamp);
    var day = dateNow.toLocaleString("en", { day: "2-digit" });
    var month = dateNow.toLocaleString("en", { month: "short" });
    var time = dateNow.toLocaleString("ru", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    var date = day;
    console.log(date);
    return date;
  };

  if (data.length === 0) {
    db.collection("journeys")
      .where("endPoint", "!=", null)
      .get()
      .then((querySnapshot) => {
        let temp = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots

          temp.push(doc.data());

          console.log(doc.data()["uid"]);
        });
        setdata(temp);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }

  console.log(data);

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {data.map((doc) => {
          return (
            <View style={{ width: Dimensions.get("window").width }}>
              <TouchableOpacity
                onPress={() => handleView(doc)}
                style={{
                  height: 90,
                  borderBottom: 2,
                  borderBottomColor: "#555",
                  borderBottomWidth: 0.2,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 10,
                    height: 90,
                    alignItems: "center",
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 20 }}>{doc["name"]}</Text>
                    <Text style={{ fontSize: 12 }}>
                      {dateFormat(doc["timestamp"])}
                    </Text>
                  </View>
                  <Ionicons name={"chevron-forward-outline"} size={25} />
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
