import React, { Component, useState, useEffect } from 'react';
import { Text, View, Button, TextInput, TouchableOpacity, Image, ScrollView, Dimensions, ActivityIndicator, LogBox } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import firebase from "firebase";
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Video, AVPlaybackStatus } from 'expo-av';
import { ProgressBar, Colors } from 'react-native-paper';


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
    const [description, setdescription] = useState("");

    const getLocations = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

   

    if(!user && !userinfo){
      getLocations()
      firebase.auth().onAuthStateChanged((user) => {
          setisLoaded(true)
          if (user) {
              setuser(user)
              db.collection("users").doc(user.uid).get().then((doc) => {
                if (doc.exists) {
            
                    setuserinfo(doc.data());
                    if(doc.data().isJourney){
                      setjourneyID(doc.data().journeyID);
                      setisJourney(doc.data().isJourney)
                    }
                    
                } else {
                    // doc.data() will be undefined in this case
            
                }
              }).catch((error) => {
          
              });
          }
      });
    }


      function handleLogout() {
        firebase
          .auth()
          .signOut()
          .then(() => {
    
          })
          .catch((error) => {
    
          });
      }

      function handleNewJourney() {
        
        if(name && description && location){
          const timestamp = Date.now();
          var id = timestamp + user.uid
          setjourneyID(id)
          db.collection("journeys").doc(id).set({
            uid: user.uid,
            name: name,
            journeyID: timestamp + user.uid,
            timestamp: timestamp,
            startPoint: [location.coords.latitude,location.coords.longitude],
            endPoint: null,
            posts: [],
          })
          .then(() => {
      
              
          })
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
          }).then(() => {
              setisJourney(true)
          }).catch((err) => {
              // This will be an "population is too big" error.
              console.error(err);
          });
        }
      }

      function handleEndJourney() {
          getLocations()
          const timestamp = Date.now();
          var id = timestamp + user.uid
          setjourneyID(id)
          var docRef = db.collection("journeys").doc(journeyID);

          db.runTransaction((transaction) => {
              return transaction.get(docRef).then((doc) => {
                  if (!doc.exists) {
                      throw "Document does not exist!";
                  }
                  
                  transaction.update(docRef, { endPoint : [location.coords.latitude,location.coords.longitude] });

                  return 

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
          
          setisJourney(false)
          setjourneyID(null)
          
        
      }
  

      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {!isLoaded &&
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#000000" />
            <Text>Loading</Text>
          </View>
        }
        {isLoaded &&
            <ScrollView>
              <View style={{ flex: 1, width: 300, justifyContent: "center", alignItems: "center", minHeight: Dimensions.get('window').height-150 }}>
                  { 
                    !isJourney &&
                    <View>
                      <Text>Create New Journey</Text>
        
                      <TextInput
                      style={{borderColor: "#000000", borderWidth: 1}}
                      onChangeText={(text) => setname(text)}
                      value={name}
                      placeholder={"Location Name"}
                      placeholderTextColor="#555555"
                      />

                      <TextInput
                      style={{borderColor: "#000000", borderWidth: 1}}
                      onChangeText={(text) => setdescription(text)}
                      value={description}
                      placeholder={"Description"}
                      placeholderTextColor="#555555"
                      multiline
                      numberOfLines={3}
                      />
                      <Button onPress={handleNewJourney} title="Add" color="#000000" />
                    </View>
                    
                  }

                  { isJourney &&
                    <View>
                      <Text>Journey</Text>
                          <GetLocations journey={journeyID} user={user} />
                          <Button onPress={handleEndJourney} title="End Journey" color="#000000" />
                    </View>
                  }
                  <Button onPress={handleLogout} title="Log Out" color="#000000" />
              </View>
            </ScrollView>
        }
        </View>

      );
    
  }
  

 function GetLocations({journey, user}) {
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
    const [mainprogress, setmainprogress] = useState(0)
    const [urls, seturls] = useState([]);



    async function uploadFile(uri) {
      const timestamp = Date.now();
      const id = timestamp;
      let split = uri.split('.');
      const response = await fetch(uri);
      const blob = await response.blob();
      var storageRef = firebase.storage().ref();
      storageRef
      .child("files/"+ timestamp )
      .put(blob)
      .then(()=>{


        storageRef.child("files/"+ timestamp).getDownloadURL()
        .then((url) => {
  
          let x = urls
          x.push(url)
          seturls(x)
        })
        .catch((error) => {
  
        });
      })
      
      
    }

    const getLocations = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
    }

    const openVideoPickerAsync = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
        if (permissionResult.granted === false) {
          alert("Permission to access camera roll is required!");
          return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:'Videos',
          });
        setfile(pickerResult.uri);
        setfiletype(pickerResult.type)
    }

    const openImagePickerAsync = async () => {
      let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }
  
      let pickerResult = await ImagePicker.launchImageLibraryAsync();
      setfile(pickerResult.uri);
      setfiletype(pickerResult.type)
    }

    function handleAdd() {
      if(note && file){
        var list = uploads
        list.push({
          note: note,
          file: file,
          type: filetype
        })

        setuploads(list);

        setnote(null)
        setfile(null)
        setfiletype(null)
      }
    }

    function handleShow() {
        setAddLocation(true)
        getLocations()
    }

    async function getUrls(){
      let temp = uploads
      for (let i = 0; i < temp.length; i++) {
        const element = temp[i];
        await uploadFile(element.file)
      }
    }

    async function handleAddLocation() {        
        if(location && name && city && description && uploads.length>0){
          setAddLocation(false)
          await getUrls()
          
          let interval = setInterval(() => {
    
            if(urls.length == uploads.length){
      
              clearInterval(interval);
              let temp = uploads
              let posts = []
              const timestamp = Date.now();
              for (let i = 0; i < temp.length; i++) {
                const element = temp[i];
        
                let entry = {
                  note : element.note,
                  type : element.type,
                  url : urls[i]
                }
                posts.push(entry)

                seturls([])
              }
  
      
  
              db.collection("posts").doc(timestamp.toString()).set({
                uid: users.uid,
                name: name,
                city: city,
                description: description,
                location: [location.coords.latitude,location.coords.longitude],
                posts: posts,
              })
              .then(() => {
          
                  var docRef = db.collection("journeys").doc(journeyID);
                  
                  db.runTransaction((transaction) => {
                      return transaction.get(docRef).then((doc) => {
                          if (!doc.exists) {
                              throw "Document does not exist!";
                          }
  
                          var newposts = doc.data().posts ;
                          newposts.push(timestamp.toString())
                  
                          if (true) {
                              transaction.update(docRef, { posts: newposts });
                              return newposts;
                          }
  
                      });
                  }).then(() => {
                      setmainprogress(0);
                  }).catch((err) => {
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
        
                    <TextInput
                    style={{borderColor: "#000000", borderWidth: 1}}
                    onChangeText={(text) => setname(text)}
                    value={name}
                    placeholder={"Location Name"}
                    placeholderTextColor="#555555"
                    />

                    <TextInput
                    style={{borderColor: "#000000", borderWidth: 1}}
                    onChangeText={(text) => setcity(text)}
                    value={city}
                    placeholder={"City"}
                    placeholderTextColor="#555555"
                    />

                    <TextInput
                    style={{borderColor: "#000000", borderWidth: 1}}
                    onChangeText={(text) => setdescription(text)}
                    value={description}
                    placeholder={"Description"}
                    placeholderTextColor="#555555"
                    multiline
                    numberOfLines={3}
                    />

                    <Text>Add Photos/Videos</Text>    

                    <TextInput
                    style={{borderColor: "#000000", borderWidth: 1}}
                    onChangeText={(text) => setnote(text)}
                    value={note}
                    placeholder={"Note"}
                    placeholderTextColor="#555555"
                    multiline
                    numberOfLines={3}
                    />

                <Text>Pick from Gallery</Text>
                { file && 
                  <View>
                    {filetype=="image" &&
                      <Image
                        style={{width: 200, height: 200}}
                        source={{
                          uri: file,
                        }}
                      />
                    }

                    {
                      filetype=="video" &&
                      <View>
                        <Video
                        ref={video}
                        style={{width: 200, height: 200}}
                        source={{
                          uri: file,
                        }}
                        useNativeControls
                        resizeMode="contain"
                        isLooping
                        onPlaybackStatusUpdate={status => setStatus(() => status)}
                        />
                    </View>
                    }
                  </View>
                }    
                <Button onPress={openImagePickerAsync} title="Photo" color="#000000" />
                <Button onPress={openVideoPickerAsync} title="Video" color="#000000" />
                <Button onPress={handleAdd} title="Add" color="#000000" />

                {uploads.length>0 &&
                  
                  <View>
                    <Text>Uploads</Text>
                    
                    {uploads.map((value, index) => {
                      return(
                        <View key={index}>


                          <Text>{value.note}</Text>

                          {value.type=="image" &&
                            <Image
                              style={{width: 200, height: 200}}
                              source={{
                                uri: value.file,
                              }}
                            />
                          }

                          {
                            value.type=="video" &&
                            <View>
                              <Video
                              style={{width: 200, height: 200}}
                              source={{
                                uri: value.file,
                              }}
                              useNativeControls
                              resizeMode="contain"
                              isLooping
                              />
                          </View>
                          }

                        </View>
                      )
                    })}
                  </View>
                }
                <Button onPress={handleAddLocation} title="Upload" color="#000000" />
            </View>
        }

        {
          mainprogress > 0 && 
            <ProgressBar progress={mainprogress/100} color={"#000000"} style={{borderRadius:20}} />
        }

        {
            (!addLocation && !mainprogress) &&
            <Button onPress={handleShow} title="Add This Location" color="#000000" />
        }
      </View>
    );
}


  