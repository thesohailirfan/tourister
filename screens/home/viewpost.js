import React from 'react'
import { Text, View, Button, ScrollView, Dimensions, StyleSheet, Image} from "react-native";
import { Video } from "expo-av";

function ViewPost({ route, navigation }) {
    const { doc , posts } = route.params;
    console.log(doc,posts);
    return (
        <ScrollView style={{ flex: 1, marginTop: 50}}>
            { posts &&
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{fontSize: 24, marginTop: 25}}> {posts.name} , {posts.city}</Text>
                    <Text style={{marginVertical: 10, fontStyle: 'italic', paddingHorizontal: 25}}> {posts.description} </Text>
                    {
                        posts.posts.map((value, index) => {
                            return (
                              <View key={index} style={styles.posts}>
                                <Text style={styles.captions}>{value.note}</Text>
            
                                {value.type == "image" && (
                                  <Image
                                    style={styles.files}
                                    source={{
                                      uri: value.url,
                                    }}
                                    resizeMode="cover"
                                  />
                                )}
            
                                {value.type == "video" && (
                                  <View>
                                    <Video
                                      style={styles.files}
                                      source={{
                                        uri: value.url,
                                      }}
                                      useNativeControls
                                      resizeMode="cover"
                                      isLooping
                                    />
                                  </View>
                                )}
                              </View>
                            );
                          })
                    }
                </View>
            }
        </ScrollView>
    )
}

export default ViewPost

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
    }
})
