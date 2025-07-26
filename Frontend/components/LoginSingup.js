import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";

// IMPORTANT: Make sure you import your login and signup functions properly
// Example:
import { useApi } from "../ApiContext";
import { useAuth } from "../AuthContext";
import axios from "axios";

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
        const res = await login(form); // <- this should update context
        console.log("Logged in successfully", res.data);
        // No need to navigate manually — RootNavigator will change screen
      } else {
        res = await signup(form);
        const res = await signup(form);
        if (!res.data.token) {
          Alert.alert("Signup successful", "Please log in to continue");
          setIsLogin(true);
        }
      }
    } catch (err) {
      Alert.alert(
        "Success",
        res.data.message || (isLogin ? "Login successful" : "Signup successful")
      );
      navigation.dispatch(StackActions.replace("Home"));
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 items-center justify-center  bg-white px-4 py-8">
        <Text className="text-4xl font-extrabold mb-6 text-black select-none">
          {isLogin ? "Login" : "Sign Up"}
        </Text>

        {!isLogin && (
          <>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2 mb-3 w-80 h-[45px]
                focus:border-gray-700 focus:ring-2 focus:ring-gray-400
                transition-all duration-300 transform
                hover:scale-[1.02] active:scale-[0.98] "
              placeholder="Name"
              value={form.name}
              onChangeText={(v) => handleChange("name", v)}
            />
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2 mb-3 w-80 h-[45px]
                focus:border-gray-700 focus:ring-2 focus:ring-gray-400
                transition-all duration-300 transform
                hover:scale-[1.02] active:scale-[0.98] "
              placeholder="Email"
              value={form.email}
              onChangeText={(v) => handleChange("email", v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2 mb-3 w-80 h-[45px]
                focus:border-gray-700 focus:ring-2 focus:ring-gray-400
                transition-all duration-300 transform
                hover:scale-[1.02] active:scale-[0.98] "
              placeholder="Phone Number"
              value={form.phonenumber}
              onChangeText={(v) => handleChange("phonenumber", v)}
              keyboardType="phone-pad"
            />
          </>
        )}

        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-2 mb-5 w-80 h-[45px]
            focus:border-gray-700 focus:ring-2 focus:ring-gray-400
            transition-all duration-300 transform
            hover:scale-[1.02] active:scale-[0.98] "
          placeholder="Roll Number"
          value={form.rollno}
          onChangeText={(v) => handleChange("rollno", v)}
          autoCapitalize="none"
        />
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-2 mb-6 w-80 h-[45px]
            focus:border-gray-700 focus:ring-2 focus:ring-gray-200
            transition-all duration-300 transform
            hover:scale-[1.02] active:scale-[0.98] "
          placeholder="Password"
          value={form.password}
          onChangeText={(v) => handleChange("password", v)}
          secureTextEntry
        />

        <TouchableOpacity
          className={`
            bg-black rounded-lg px-6 py-3 mb-4 w-80 h-[40px]
            
            transform
            hover:scale-[1.05]
            active:scale-[0.95]
            transition-transform duration-300
            ${loading ? "opacity-70" : "opacity-100"}
          `}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text className="text-white text-lg text-center font-semibold select-none">
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsLogin(!isLogin)}
          activeOpacity={0.7}
        >
          <Text className="text-black underline select-none">
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
