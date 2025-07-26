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
    
  );
}
