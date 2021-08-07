import React from 'react'
import { Text, View, Button, ScrollView, Dimensions, StyleSheet} from "react-native";

function ViewPost({ route, navigation }) {
    const { doc } = route.params;
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Id {doc}</Text>
        </View>
    )
}

export default ViewPost