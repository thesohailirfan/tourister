import * as React from "react";
import {
  ImageBackground,
  Image,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import firebase from "firebase";
import { theme } from "../asset/theme";

var db = firebase.firestore();

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = React.useState();
  const [name, setName] = React.useState();
  const [password, setPassword] = React.useState();

  function handleCreateAccount(params) {
    if (email && password) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in
          var user = userCredential.user;
          db.collection("users")
            .doc(user.uid)
            .set({
              name: name,
              email: email,
              isJourney: false,
              journeyID: "",
            })
            .then(() => {
              navigation.navigate("Home");
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            });
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
        });
    }
  }

  return (
    <ImageBackground
      source={require("../asset/back.jpg")}
      resizeMode="cover"
      style={styles.imageBackground}
    >
      <Image
        source={require("../asset/logo.png")}
        style={{ position: "absolute", top: 120 , height: 100, width: 100}}
      />
      <View style={styles.wrapper}>
        <TextInput
          style={styles.inputField}
          onChangeText={(text) => setName(text)}
          value={name}
          placeholder={"Name"}
          placeholderTextColor="lightgrey"
        />
        <TextInput
          style={styles.inputField}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder={"Email"}
          placeholderTextColor="lightgrey"
          textContentType="emailAddress"
        />
        <TextInput
          style={styles.inputField}
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder={"Password"}
          placeholderTextColor="lightgrey"
          textContentType="newPassword"
          secureTextEntry={true}
        />
        <TouchableOpacity
          onPress={handleCreateAccount}
          style={styles.signInBtn}
        >
          <Text style={styles.signIn}>Create account</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.createAccount}>
        <Text style={{ color: "#ffffff" }}>Already have an Account ? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.createAccountBtn}
        >
          <Text style={styles.signUp}>Log In</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: { flex: 1, justifyContent: "center", alignItems: "center" },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 60
  },
  inputField: {
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
  signInBtn: {
    width: 150,
    height: 50,
    textAlign: "center",
    backgroundColor: theme.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  signIn: {
    color: theme.textDark,
  },
  createAccount: {
    position: "absolute",
    flexDirection: "row",
    bottom: 60,
  },
  signUp: {
    color: theme.primary,
  },
});
