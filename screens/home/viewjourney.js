import React from 'react'
import { Text, View, Button, ScrollView } from "react-native";

function ViewJourney({ route, navigation }) {
    const { doc } = route.params;

    console.log(doc);
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading</Text>
        </View>
    )
}

export default ViewJourney
