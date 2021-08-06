import * as React from 'react';
import { ImageBackground, Text, View, Button, TextInput} from 'react-native';
import firebase from 'firebase';

export default function SignUpScreen({ navigation }) {
  const [email, setemail] = React.useState();
  const [password, setpassword] = React.useState();

  function handleCreateAccount(params) {
    console.log("CreateAccount");
    if (email && password) {
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            console.log(user);
            })
            .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
            });
        }
    }

    return (
        <ImageBackground source={require('../asset/back.jpg')} resizeMode="cover" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
                onPress={handleCreateAccount}
                title="Create Account"
                color="#841584"
            />

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text>Already have an Account ? </Text>
                <Button
                    title="Log In"
                    onPress={() => navigation.navigate('Login')}
                />
            </View>
        </ImageBackground>
    );
}
