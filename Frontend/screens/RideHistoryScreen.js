import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { styled } from "nativewind";
import { useApi } from "../ApiContext";
import { useAuth } from "../AuthContext";
import axios from "axios";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledButton = styled(TouchableOpacity);

export default function RideHistoryScreen({ navigation }) {
  const { baseUrl } = useApi();
  const { token } = useAuth();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchRides = async () => {
      try {
        const res = await axios.get(`${baseUrl}/user/rides`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRides(res.data.user_rides || []);
      } catch (e) {
        setRides([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, [baseUrl, token]);

  if (loading) return <ActivityIndicator size="large" color="#2563eb" />;

  return (
    <StyledView className="flex-1 bg-blue-50 px-4 py-8">
      <StyledText className="text-2xl font-bold text-blue-700 mb-4">
        Ride History
      </StyledText>
      {rides.length === 0 ? (
        <StyledText className="text-gray-500 mb-8">No rides found.</StyledText>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={({ item }) => (
            <StyledView className="mb-3 p-4 rounded-xl bg-white shadow flex-row justify-between items-center">
              <StyledView>
                <StyledText className="text-base font-bold text-blue-700">
                  {item.pickup_location} → {item.drop_location}
                </StyledText>
                <StyledText className="text-xs text-gray-500">
                  Status: {item.status} |{" "}
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString()
                    : ""}
                </StyledText>
              </StyledView>
              <StyledText className="text-base font-semibold text-blue-600">
                ₹{item.fare || "--"}
              </StyledText>
            </StyledView>
          )}
        />
      )}
      <StyledButton
        className="bg-blue-600 rounded px-6 py-3 mt-6"
        onPress={() => navigation.goBack()}
      >
        <StyledText className="text-white text-lg text-center font-semibold">
          Back
        </StyledText>
      </StyledButton>
    </StyledView>
  );
}
