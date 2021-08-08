import React, { Component, useState, useEffect } from "react";
import {
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  LogBox,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import firebase from "firebase";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import { ProgressBar } from "react-native-paper";
import { theme } from "../asset/theme";

// Ignore log notification by message
LogBox.ignoreLogs(["Warning: Each", "Warning: Failed", "Setting"]);

var db = firebase.firestore();

export default function JourneyScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoaded, setisLoaded] = React.useState(false);
  const [user, setuser] = React.useState(null);
  const [userinfo, setuserinfo] = React.useState(null);
  const [isJourney, setisJourney] = React.useState(false);
  const [journeyID, setjourneyID] = React.useState(null);
  const [name, setname] = useState("");
  const [description, setdescription] = useState("abc");

  const getLocations = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  if (!user && !userinfo) {
    getLocations();
    firebase.auth().onAuthStateChanged((user) => {
      setisLoaded(true);
      if (user) {
        setuser(user);
        db.collection("users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              setuserinfo(doc.data());
              if (doc.data().isJourney) {
                setjourneyID(doc.data().journeyID);
                setisJourney(doc.data().isJourney);
              }
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

  function handleNewJourney() {
    if (name && description && location) {
      const timestamp = Date.now();
      var id = timestamp + user.uid;
      setjourneyID(id);
      db.collection("journeys")
        .doc(id)
        .set({
          uid: user.uid,
          name: name,
          journeyID: timestamp + user.uid,
          timestamp: timestamp,
          startPoint: [location.coords.latitude, location.coords.longitude],
          endPoint: null,
          posts: [],
        })
        .then(() => {})
        .catch((error) => {
          console.error("Error writing document: ", error);
        });

      var docRef = db.collection("users").doc(user.uid);

      db.runTransaction((transaction) => {
        return transaction.get(docRef).then((doc) => {
          if (!doc.exists) {
            throw "Document does not exist!";
          }

          var newjourneyID = id;

          transaction.update(docRef, { journeyID: newjourneyID });
          transaction.update(docRef, { isJourney: true });
          return newjourneyID;
        });
      })
        .then(() => {
          setisJourney(true);
        })
        .catch((err) => {
          // This will be an "population is too big" error.
          console.error(err);
        });
    }
  }

  function handleEndJourney() {
    getLocations();
    const timestamp = Date.now();
    var id = timestamp + user.uid;
    setjourneyID(id);
    var docRef = db.collection("journeys").doc(journeyID);

    db.runTransaction((transaction) => {
      return transaction.get(docRef).then((doc) => {
        if (!doc.exists) {
          throw "Document does not exist!";
        }

        transaction.update(docRef, {
          endPoint: [location.coords.latitude, location.coords.longitude],
        });

        return;
      });
    }).catch((err) => {
      // This will be an "population is too big" error.
      console.error(err);
    });

    var docRef2 = db.collection("users").doc(user.uid);

    db.runTransaction((transaction) => {
      return transaction.get(docRef2).then((doc) => {
        if (!doc.exists) {
          throw "Document does not exist!";
        }

        var newjourneyID = "";

        transaction.update(docRef2, { journeyID: newjourneyID });
        transaction.update(docRef2, { isJourney: false });
        return newjourneyID;
      });
    }).catch((err) => {
      // This will be an "population is too big" error.
      console.error(err);
    });

    setisJourney(false);
    setjourneyID(null);
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
      {isLoaded && (
        <ScrollView>
          <View
            style={{
              flex: 1,
              width: Dimensions.get("window").width,
              marginTop: 40,
              minHeight: Dimensions.get("window").height-200,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {!isJourney && (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <Text style={{ fontSize: 30, marginBottom: 50 }}>
                  Create New Journey
                </Text>
                <TextInput
                  style={styles.inputField}
                  onChangeText={(text) => setname(text)}
                  value={name}
                  placeholder={"Journey Title"}
                  placeholderTextColor="#ffffff"
                />
                <TouchableOpacity
                  onPress={handleNewJourney}
                  style={styles.addBtn}
                >
                  <Text style={styles.signIn}>Start New Journey</Text>
                </TouchableOpacity>
              </View>
            )}

            {isJourney && <GetLocations journey={journeyID} user={user} />}
            {isJourney && (
              <TouchableOpacity
                onPress={handleEndJourney}
                style={styles.endJourneyBtn}
              >
                <Text style={styles.signIn}>End Journey</Text>
              </TouchableOpacity>
            )}
            
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function GetLocations({ journey, user }) {
  const [journeyID, setjourneyID] = useState(journey);
  const [users, setusers] = useState(user);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [addLocation, setAddLocation] = useState(false);
  const [name, setname] = useState("");
  const [city, setcity] = useState("");
  const [description, setdescription] = useState("");
  const [file, setfile] = useState(null);
  const [filetype, setfiletype] = useState(null);
  const [uploads, setuploads] = useState([]);
  const [note, setnote] = useState(null);
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [mainprogress, setmainprogress] = useState(0);
  const [urls, seturls] = useState([]);

  async function uploadFile(uri) {
    const timestamp = Date.now();
    const id = timestamp;
    let split = uri.split(".");
    const response = await fetch(uri);
    const blob = await response.blob();
    var storageRef = firebase.storage().ref();
    storageRef
      .child("files/" + timestamp)
      .put(blob)
      .then(() => {
        storageRef
          .child("files/" + timestamp)
          .getDownloadURL()
          .then((url) => {
            let x = urls;
            x.push(url);
            seturls(x);
          })
          .catch((error) => {});
      });
  }

  const getLocations = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  const openVideoPickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Videos",
    });
    setfile(pickerResult.uri);
    setfiletype(pickerResult.type);
  };

  const openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    setfile(pickerResult.uri);
    setfiletype(pickerResult.type);
  };

  function handleAdd() {
    if (note && file) {
      var list = uploads;
      list.push({
        note: note,
        file: file,
        type: filetype,
      });

      setuploads(list);

      setnote(null);
      setfile(null);
      setfiletype(null);
    }
  }

  function handleShow() {
    setAddLocation(true);
    getLocations();
  }

  async function getUrls() {
    let temp = uploads;
    for (let i = 0; i < temp.length; i++) {
      const element = temp[i];
      await uploadFile(element.file);
    }
  }

  async function handleAddLocation() {
    if (location && name && city && description && uploads.length > 0) {
      setAddLocation(false);
      await getUrls();

      let interval = setInterval(() => {
        if (urls.length == uploads.length) {
          clearInterval(interval);
          let temp = uploads;
          let posts = [];
          const timestamp = Date.now();
          for (let i = 0; i < temp.length; i++) {
            const element = temp[i];

            let entry = {
              note: element.note,
              type: element.type,
              url: urls[i],
            };
            posts.push(entry);

            seturls([]);
          }

          db.collection("posts")
            .doc(timestamp.toString())
            .set({
              uid: users.uid,
              name: name,
              city: city,
              description: description,
              posts: posts,
              location: [location.coords.latitude, location.coords.longitude],
            })
            .then(() => {
              var docRef = db.collection("journeys").doc(journeyID);

              db.runTransaction((transaction) => {
                return transaction.get(docRef).then((doc) => {
                  if (!doc.exists) {
                    throw "Document does not exist!";
                  }

                  var newposts = doc.data().posts;
                  newposts.push(timestamp.toString());

                  if (true) {
                    transaction.update(docRef, { posts: newposts });
                    return newposts;
                  }
                });
              })
                .then(() => {
                  setmainprogress(0);
                })
                .catch((err) => {
                  // This will be an "population is too big" error.
                  console.error(err);
                });
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            });
          clearInterval(interval);
        }
      }, 1000);
    }
  }

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View>
      {addLocation && (
        <View style={{ alignItems: "center" }}>
          <Text style = {{fontSize: 36, fontWeight: 'bold', marginVertical: 20}}>Create new Location</Text>

          <TextInput
            style={styles.inputField}
            onChangeText={(text) => setname(text)}
            value={name}
            placeholder={"Location Name"}
            placeholderTextColor="#ffffff"
          />

          <TextInput
            style={styles.inputField}
            onChangeText={(text) => setcity(text)}
            value={city}
            placeholder={"City"}
            placeholderTextColor="#ffffff"
          />

          <TextInput
            style={styles.inputField}
            onChangeText={(text) => setdescription(text)}
            value={description}
            placeholder={"Description"}
            placeholderTextColor="#ffffff"
            multiline
            numberOfLines={3}
          />

          <Text style={{ marginBottom: 5, fontSize: 20 }}>
            Attach some Media
          </Text>
          {file && (
            <View>
              {filetype == "image" && (
                <Image
                  style={{ width: 200, height: 200 }}
                  source={{
                    uri: file,
                  }}
                />
              )}

              {filetype == "video" && (
                <View>
                  <Video
                    ref={video}
                    style={{ width: 200, height: 200 }}
                    source={{
                      uri: file,
                    }}
                    useNativeControls
                    resizeMode="contain"
                    isLooping
                    onPlaybackStatusUpdate={(status) => setStatus(() => status)}
                  />
                </View>
              )}
            </View>
          )}
          {file && (
            <View style={styles.textAreaContainer}>
              <TextInput
                onChangeText={(text) => setnote(text)}
                style={styles.textArea}
                value={note}
                underlineColorAndroid="transparent"
                placeholder="Type something"
                placeholderTextColor="grey"
                numberOfLines={5}
                multiline={true}
              />
            </View>
          )}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              width: 250,
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <TouchableOpacity
              onPress={openImagePickerAsync}
              style={styles.mediaBtn}
            >
              <Ionicons name={"image-outline"} size={25} />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={openVideoPickerAsync}
              style={styles.mediaBtn}
            >
              <Ionicons name={"videocam-outline"} size={25} />
            </TouchableOpacity>
          </View>
            <TouchableOpacity onPress={handleAdd} style={styles.addMediaBtn}>
              <Text>Attach Post</Text>
            </TouchableOpacity>

          {uploads.length > 0 && 
            <View style={{justifyContent: "center", alignItems: "center"}}>
              <Text style = {{fontSize: 28, fontWeight: 'bold', marginTop: 30}}>All Uploads</Text>

              {uploads.map((value, index) => {
                            return (
                              <View key={index} style={styles.posts}>
                                <Text style={styles.captions}>{value.note}</Text>
            
                                {value.type == "image" && (
                                  <Image
                                    style={styles.files}
                                    source={{
                                      uri: value.file,
                                    }}
                                    resizeMode="cover"
                                  />
                                )}
            
                                {value.type == "video" && (
                                  <View>
                                    <Video
                                      style={styles.files}
                                      source={{
                                        uri: value.file,
                                      }}
                                      useNativeControls
                                      resizeMode="cover"
                                      isLooping
                                      automatically
                                    />
                                  </View>
                                )}
                              </View>
                            );
                          })
                    }
             
            </View>
          }
          <TouchableOpacity
            onPress={handleAddLocation}
            style={[styles.addLocationBtn,{marginBottom: 100}]}
          >
            <Text style ={{fontSize:24}}>Upload Location</Text>
          </TouchableOpacity>
        </View>
      )}

      {!addLocation && !mainprogress && (
        <TouchableOpacity onPress={handleShow} style={styles.addLocationBtn}>
          <Text style ={{fontSize:24}} >Add a Location</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  files: {
    width: Dimensions.get('screen').width,
    maxHeight: 600,
    minHeight: Dimensions.get('screen').width,
},
posts:{
    marginVertical: 25,
    backgroundColor: "#dedede",
},
captions:{
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
},
  imageBackground: { flex: 1, justifyContent: "center", alignItems: "center" },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  inputField: {
    fontSize: 18,
    height: 60,
    width: 300,
    borderRadius: 25,
    color: theme.textLight,
    borderColor: theme.textLight,
    backgroundColor: theme.textDark,
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 30,
  },
  mediaBtn: {
    width: 100,
    height: 40,
    textAlign: "center",
    borderWidth: 1,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  addMediaBtn: {
    width: 150,
    height: 50,
    textAlign: "center",
    borderRadius: 25,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.primary,
  },
  addBtn: {
    width: 250,
    height: 60,
    textAlign: "center",
    backgroundColor: theme.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  endJourneyBtn: {
    position: "absolute",
    bottom: 20,
    width: 150,
    height: 50,
    textAlign: "center",
    backgroundColor: theme.primary,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    fontSize: 24,
  },

  logOutBtn: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 150,
    height: 70,
    textAlign: "center",
    backgroundColor: theme.primary,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  addLocationBtn: {
    width: 250,
    height: 60,
    textAlign: "center",
    backgroundColor: theme.primary,
    borderColor: theme.primaryDark,
    borderWidth: 3,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20
  },
  signIn: {
    fontSize: 20,
    color: theme.textDark,
    textAlign: "center",
  },
  createAccount: {
    position: "absolute",
    flexDirection: "row",
    bottom: 60,
  },
  signUp: {
    color: theme.primary,
  },
  textAreaContainer: {
    width: 200,
    borderColor: "#999555",
    borderWidth: 1,
    padding: 5,
  },
  textArea: {
    justifyContent: "flex-start",
  },
});
