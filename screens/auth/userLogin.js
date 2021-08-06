import * as React from "react";
import { Text, View, Button, TextInput, StyleSheet } from "react-native";
import firebase from "firebase";
import theme from "../Assets/theme";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();

  function handleSignIn(params) {
    console.log("SignIn");
    if (email && password) {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
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
    <View style={styles.main}>
      <TextInput
        style={styles.textInput}
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder={"Email"}
      />
      <TextInput
        style={styles.textInput}
        onChangeText={(text) => setPassword(text)}
        value={password}
        placeholder={"Password"}
      />

      <Button onPress={handleSignIn} title="Sign In" style={styles.signInBtn} />
    </View>
  );
}
const styles = StyleSheet.create({
  main: { flex: 1, justifyContent: "center", alignItems: "center" },
  textInput: {
    height: 40,
    width: 300,
    borderColor: "gray",
    borderWidth: 1,
    textAlign: "center",
  },
  signInBtn: {
    backgroundColor: "#000000",
    color: "#ffffff",
  },
});
