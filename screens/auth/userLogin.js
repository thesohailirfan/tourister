import * as React from 'react';
import { Text, View, Button, TextInput} from 'react-native';
import firebase from 'firebase';

export default function LoginScreen({navigation}) {
    const [email, setemail] = React.useState();
    const [password, setpassword] = React.useState();

    function handleSignIn(params) {
        console.log("SignIn")
        if(email && password) {
            firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                console.log(user)
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorMessage)
            });
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TextInput
                style={{ height: 40, width: 300 , borderColor: 'gray', borderWidth: 1, textAlign: 'center' }}
                onChangeText={text => setemail(text)}
                value={email}
                placeholder={"Email"}
            />
            <TextInput
                style={{ height: 40, width: 300 ,borderColor: 'gray', borderWidth: 1, textAlign: 'center' }}
                onChangeText={text => setpassword(text)}
                value={password}
                placeholder={"Password"}
            />

            <Button
                onPress={handleSignIn}
                title="Sign In"
                color="#841584"
            />

        </View>
    );
}