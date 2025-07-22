import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { styled } from "nativewind";
import { useApi } from "../ApiContext";
import { useAuth } from "../AuthContext";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledButton = styled(TouchableOpacity);

export default function ProfileScreen({ navigation }) {
  const { baseUrl } = useApi();
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${baseUrl}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
    return (
      <StyledText className="text-center mt-10 text-red-500">
        No user data
      </StyledText>
    );

  return (
    <StyledView className="flex-1 bg-blue-50 px-4 py-8">
      <StyledView className="p-6 rounded-2xl bg-white shadow mb-6">
        <StyledText className="text-2xl font-bold text-blue-700 mb-2">
          {user.name}
        </StyledText>
        <StyledText className="text-base text-gray-700 mb-1">
          Roll: {user.rollno}
        </StyledText>
        <StyledText className="text-base text-gray-700 mb-1">
          Email: {user.email}
        </StyledText>
        <StyledText className="text-base text-gray-700 mb-1">
          Phone: {user.phonenumber}
        </StyledText>
      </StyledView>
      <StyledButton
        className="bg-blue-600 rounded px-6 py-3"
        onPress={() => navigation.goBack()}
      >
        <StyledText className="text-white text-lg text-center font-semibold">
          Back
        </StyledText>
      </StyledButton>
      <StyledButton
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
        <StyledText className="text-white text-lg text-center font-semibold">
          Logout
        </StyledText>
      </StyledButton>
    </StyledView>
  );
}
