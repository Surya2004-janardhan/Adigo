import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
// import { styled } from "nativewind";
import { useApi } from "../ApiContext";
import { useAuth } from "../AuthContext";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";

// const View = styled(View);
// const Text = styled(Text);
// const TouchableOpacity = styled(TouchableOpacity);

export default function ProfileScreen({ navigation }) {
  const { baseUrl } = useApi();
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchProfile = async () => {
      try {
        console.log("inside of profile fetch");
        const res = await axios.get(`${baseUrl}/user/profile`, {
          headers: { authentication: `Bearer ${token}` },
        });
        // console.log(res);
        setUser(res.data.user);
      } catch (e) {
        Alert.alert("Error", "Could not fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [baseUrl, token]);

  if (loading) return <ActivityIndicator size="large" color="#2563eb" />;

  if (!user)
    return <Text className="text-center mt-10 text-red-500">No user data</Text>;

  return (
    <View className="flex-1 bg-blue-50 px-4 py-8">
      <View className="p-6 rounded-2xl bg-white shadow mb-6">
        <Text className="text-2xl font-bold text-blue-700 mb-2">
          {user.name}
        </Text>
        <Text className="text-base text-gray-700 mb-1">
          Roll: {user.rollno}
        </Text>
        <Text className="text-base text-gray-700 mb-1">
          Email: {user.email}
        </Text>
        <Text className="text-base text-gray-700 mb-1">
          Phone: {user.phonenumber}
        </Text>
      </View>
      <TouchableOpacity
        className="bg-blue-600 rounded px-6 py-3"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-white text-lg text-center font-semibold">
          Back
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-red-600 rounded px-6 py-3 mt-4 flex-row items-center justify-center"
        onPress={async () => {
          await logout();
          navigation.replace("LoginSingup");
        }}
      >
        <Icon
          name="sign-out"
          size={20}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <Text className="text-white text-lg text-center font-semibold">
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}
