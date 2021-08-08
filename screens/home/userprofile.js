import React, { Component, useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import firebase from "firebase";
import { theme } from "../asset/theme";

var db = firebase.firestore();

export default function ViewProfile({ navigation}) {
  const [data, setdata] = React.useState([]);
  const [isLoaded, setisLoaded] = useState(false);
  const [users, setusers] = useState();
  const [userinfo, setuserinfo] = useState(null);


  function handleView(journey) {
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
    return date;
  };

  console.log(users)
  if (data.length === 0) {
      
    db.collection("journeys")
      .where("endPoint", "!=", null)
      .get()
      .then((querySnapshot) => {
        let temp = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
            if(doc.data()["uid"] === users.uid)
                temp.push(doc.data());
            
        });
        setdata(temp);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }

  if ( !users && !userinfo) {
    firebase.auth().onAuthStateChanged((user) => {
      setisLoaded(true);
      if (user) {
          console.log(user)
        setusers(user);
        db.collection("users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              setuserinfo(doc.data());
            } else {
              // doc.data() will be undefined in this case
            }
          })
          .catch((error) => {});
      }
    });
  }

  function handleLogout() {
    firebase
      .auth()
      .signOut()
      .then(() => {})
      .catch((error) => {});
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {!isLoaded && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#000000" />
          <Text>Loading</Text>
        </View>
      )}
      {isLoaded && userinfo && (
        <ScrollView>
          <View
            style={{
              flex: 1,
              width: Dimensions.get("window").width,
              marginTop: 0,
              minHeight: Dimensions.get("window").height-200,
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
              <View style={styles.info}>
                <Text style={{fontSize: 32}}>{userinfo.name} </Text>
                <Text style={{fontStyle: 'italic'}}>{userinfo.email} </Text>
                <TouchableOpacity onPress={handleLogout} style={styles.logOutBtn}>
                    <Text style={styles.signIn}>Log Out</Text>
                </TouchableOpacity>
              </View>
              <View>
                <View style={{backgroundColor: theme.primary, justifyContent: "center", alignItems: "center", padding: 20}}>
                    <Text style={{fontSize: 20}}>My Journeys</Text>
                </View>
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
              
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    info: {
        height: 200,
        backgroundColor: "#dedede",
        width: Dimensions.get("window").width,
        justifyContent: "center",
        alignItems: "center"
    },
    logOutBtn: {        
        width: 150,
        height: 50,
        marginTop: 20,
        textAlign: "center",
        backgroundColor: theme.primary,
        borderRadius: 35,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
    },
    signIn: {
        fontSize: 20,
        color: theme.textDark,
        textAlign: "center",
    },
})