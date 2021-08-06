import * as React from "react";
import {
  ImageBackground,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import firebase from "firebase";
import { theme } from "../asset/theme";

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
  console.log(theme.primary);
  return (
    <ImageBackground
      source={require("../asset/back.jpg")}
      resizeMode="cover"
      style={styles.imageBackground}
    >
      <View style={styles.wrapper}>
        <TextInput
          style={styles.inputField}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder={"Email"}
          placeholderTextColor="lightgrey"
        />
        <TextInput
          style={styles.inputField}
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder={"Password"}
          placeholderTextColor="lightgrey"
        />

        <TouchableOpacity onPress={handleSignIn} style={styles.signInBtn}>
          <Text style={styles.signIn}>Sign in</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.createAccount}>
        <Text style={{ color: "#ffffff" }}>Don't have an account ? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("SignUp")}
          style={styles.createAccountBtn}
        >
          <Text style={styles.signUp}>Sign Up</Text>
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
  },
  inputField: {
    height: 50,
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
    width: 100,
    height: 40,
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
