import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useApi } from "../ApiContext";
import { useAuth } from "../AuthContext";
import axios from "axios";
// import { HomeScreen } from "./HomeScreen";
// import { useNavigation } from "@react-navigation/native";
export default function LoginSingup({ navigation }) {
  // const navigation = useNavigation()
  const { baseUrl } = useApi();
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    rollno: "",
    email: "",
    phonenumber: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  // const handleSubmit = async () => {
  //   setLoading(true);
  //   try {
  //     let res;
  //     if (isLogin) {
  //       res = await login(form.rollno, form.password);
  //     } else {
  //       res = await signup(form);
  //     }
  //     Alert.alert(
  //       "Success",
  //       res.data.message || (isLogin ? "Login successful" : "Signup successful")
  //     );
  //     // navigation.navigate("Home");
  //     navigation.reset({
  //       index: 0,
  //       routes: [{ name: "Home" }],
  //     });
  //   } catch (e) {
  //     Alert.alert("Error", e.message);
  //     if (e.response && e.response.data && e.response.data.message) {
  //       Alert.alert("Error", e.response.data.message);
  //     } else {
  //       Alert.alert("Error", "Network");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const res = await login(form); // <- this should update context
        console.log("Logged in successfully", res.data);
        // No need to navigate manually — RootNavigator will change screen
      } else {
        const res = await signup(form);
        if (!res.data.token) {
          Alert.alert("Signup successful", "Please log in to continue");
          setIsLogin(true);
        }
      }
    } catch (err) {
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>{isLogin ? "Login" : "Sign Up"}</Text>

        {!isLogin && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={form.name}
              onChangeText={(v) => handleChange("name", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={form.email}
              onChangeText={(v) => handleChange("email", v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={form.phonenumber}
              onChangeText={(v) => handleChange("phonenumber", v)}
              keyboardType="phone-pad"
            />
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder="Roll Number"
          value={form.rollno}
          onChangeText={(v) => handleChange("rollno", v)}
          autoCapitalize="none"
        />
        <TextInput
          style={[styles.input, { marginBottom: 24 }]}
          placeholder="Password"
          value={form.password}
          onChangeText={(v) => handleChange("password", v)}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.linkText}>
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // bg-white
    paddingHorizontal: 16, // px-4
    paddingVertical: 32, // py-8
    alignItems: "center", // items-center
    justifyContent: "center", // justify-center
  },
  title: {
    fontSize: 30, // text-3xl
    fontWeight: "bold", // font-bold
    marginBottom: 24, // mb-6
    color: "#1d4ed8", // text-blue-700
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db", // border-gray-300
    borderRadius: 6, // rounded
    paddingHorizontal: 16, // px-4
    paddingVertical: 8, // py-2
    marginBottom: 12, // mb-3
    width: 288, // w-72 (72 * 4)
  },
  button: {
    backgroundColor: "#2563eb", // bg-blue-600
    borderRadius: 6, // rounded
    paddingHorizontal: 24, // px-6
    paddingVertical: 12, // py-3
    marginBottom: 16, // mb-4
    width: 288, // w-72
  },
  buttonText: {
    color: "#ffffff", // text-white
    fontSize: 18, // text-lg
    fontWeight: "600", // font-semibold
    textAlign: "center", // text-center
  },
  linkText: {
    color: "#1d4ed8", // text-blue-700
    textDecorationLine: "underline",
  },
});
