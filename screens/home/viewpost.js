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
                    <Text style={{fontSize: 24}}> {posts.name} , {posts.city}</Text>
                    <Text> {posts.description} </Text>
                    {
                        posts.posts.map((value, index) => {
                            return (
                              <View key={index}>
                                <Text>{value.note}</Text>
            
                                {value.type == "image" && (
                                  <Image
                                    style={{ width: 200, height: 200 }}
                                    source={{
                                      uri: value.url,
                                    }}
                                  />
                                )}
            
                                {value.type == "video" && (
                                  <View>
                                    <Video
                                      style={{ width: 200, height: 200 }}
                                      source={{
                                        uri: value.url,
                                      }}
                                      useNativeControls
                                      resizeMode="contain"
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