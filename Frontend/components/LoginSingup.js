import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
// import { styled } from "nativewind";
import { useApi } from "../ApiContext";
import { useAuth } from "../AuthContext";
import axios from "axios";

// const View = styled(View);
// const Text = styled(Text);
// const TextInput = styled(TextInput);
// const TouchableOpacity = styled(TouchableOpacity);

export default function LoginSingup({ navigation }) {
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let res;
      if (isLogin) {
        res = await login(form.rollno, form.password);
      } else {
        res = await signup(form);
      }
      Alert.alert(
        "Success",
        res.data.message || (isLogin ? "Login successful" : "Signup successful")
      );
      navigation.replace("Home");
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        Alert.alert("Error", e.response.data.message);
      } else {
        Alert.alert("Error", "Network error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 items-center justify-center bg-white px-4 py-8">
        <Text className="text-3xl font-bold mb-6 text-blue-700">
          {isLogin ? "Login" : "Sign Up"}
        </Text>
        {!isLogin && (
          <>
            <TextInput
              className="border border-gray-300 rounded px-4 py-2 mb-3 w-72"
              placeholder="Name"
              value={form.name}
              onChangeText={(v) => handleChange("name", v)}
            />
            <TextInput
              className="border border-gray-300 rounded px-4 py-2 mb-3 w-72"
              placeholder="Email"
              value={form.email}
              onChangeText={(v) => handleChange("email", v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              className="border border-gray-300 rounded px-4 py-2 mb-3 w-72"
              placeholder="Phone Number"
              value={form.phonenumber}
              onChangeText={(v) => handleChange("phonenumber", v)}
              keyboardType="phone-pad"
            />
          </>
        )}
        <TextInput
          className="border border-gray-300 rounded px-4 py-2 mb-3 w-72"
          placeholder="Roll Number"
          value={form.rollno}
          onChangeText={(v) => handleChange("rollno", v)}
          autoCapitalize="none"
        />
        <TextInput
          className="border border-gray-300 rounded px-4 py-2 mb-6 w-72"
          placeholder="Password"
          value={form.password}
          onChangeText={(v) => handleChange("password", v)}
          secureTextEntry
        />
        <TouchableOpacity
          className="bg-blue-600 rounded px-6 py-3 mb-4 w-72"
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text className="text-white text-lg text-center font-semibold">
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text className="text-blue-700 underline">
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
