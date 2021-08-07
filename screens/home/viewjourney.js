import React, {useState, useEffect} from 'react'
import { Text, View, Button, ScrollView, Dimensions, StyleSheet} from "react-native";
import MapView from 'react-native-maps';
import { Marker,  Polyline, Callout } from 'react-native-maps';
import firebase from "firebase";


var db = firebase.firestore();

function ViewJourney({ route, navigation }) {
    const { doc } = route.params;
    const [data, setdata] = useState([])
    const [tags, settags] = useState([])
    const [coordinates, setcoordinates,] = useState([])
    let coords = []

    console.log("Start")

    
    function handleView(post){
        console.log(post)
        navigation.navigate('ViewPosts', {
            doc : post,
        });
    }
   
    if(data.length === 0){
        db.collection("posts").get().then((querySnapshot) => {
            let tempdata = [];
            let temptags = [];
            querySnapshot.forEach((docs) => {
                // docs.data() is never undefined for query docs snapshots
                if(doc["posts"].includes(docs.id)){
                    console.log(docs.id, " => ", docs.data());
                    tempdata.push(docs.data()["location"])
                    temptags.push(docs.data()["name"])
                }
            });
            setdata(tempdata)
            settags(temptags)
        });
    }

    if(false){
        for (let i = 0; i < doc["posts"].length; i++) {
            const element = doc["posts"][i];
            db.collection("posts").doc(element).get().then((doc) => {
                console.log("half");
                let temp = data
                temp.push(doc.data()["location"])
                setdata(temp)
                let temp2 = tags
                temp2.push(doc.data()["name"])
                settags(temp2)

            }).catch((error) => {
                
            });
        }
    }

    


   
    

    if(data.length == doc["posts"].length){
        let temp = data
        temp.unshift(doc["startPoint"])
        temp.push(doc["endPoint"])
        setdata(temp)
        coords = []
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            coords.push({
                latitude : element[0],
                longitude : element[1],
            })    
              
        }
        setcoordinates(coords)
    }

    if(tags.length == doc["posts"].length){
        let temp2 = tags
        temp2.unshift("Starting point")
        temp2.push("Ending point")
        console.log(temp2)
        settags(temp2)
    }

    console.log(data)
    console.log(tags)
 
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {
                data.length>0 &&
                    
                <MapView style={styles.map}
                    initialRegion={{
                        latitude: doc["startPoint"][0],
                        longitude: doc["startPoint"][1],
                        latitudeDelta: 0.08,
                        longitudeDelta: 0.03,
                    }}
                >
                    <Polyline
                        lineDashPattern={[5,10]}
                        coordinates={coordinates}
                        strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                        strokeWidth={6}
                    /> 
                    {data.map((marker, index) => (
                        <Marker
                            key={index}
                            coordinate={{ latitude : marker[0] , longitude : marker[1] }}
                            title={tags[index]}
                        >
                            <Callout onPress={()=>handleView((index === 0 || index === data.length-1) ? null : doc["posts"][index-1])}>
                                <View style={{ backgroundColor: "#fff"}}>
                                    {/* <Text >{tags[index]}</Text>
                                    <Button onPress={()=>handleView(doc["posts"][index])} title="View More" color="#000000" /> */}
                                    <CustomCalloutView id={ (index === 0 || index === data.length-1) ? null : index} title={tags[index]} navigation={navigation}/>
                                </View>                                
                            </Callout>
                            
                        </Marker>
                    ))}  
                                 
                </MapView>
            }
            
        </View>
    )
}

export default ViewJourney

class CustomCalloutView extends React.Component {
    

    render() {
        return (

            <View>
                <View>
                    <Text style={{
                        fontWeight: "bold",
                        fontSize: 24,
                    }}>
                        {this.props.title}
                    </Text>
                    { 
                        this.props.id &&
                        <Button onPress={()=>this.handleView(this.props.id)} title="View More" color="#000000" />
                    }
                    
                </View>
            </View>

        )
    }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
        marginTop: 50,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
  });