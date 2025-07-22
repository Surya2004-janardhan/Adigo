import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { styled } from "nativewind";
import { useApi } from "../ApiContext";
import { useAuth } from "../AuthContext";
import axios from "axios";

const StyledView = styled(View);
const StyledText = styled(Text);

export default function ActiveRideScreen({ route }) {
  const { baseUrl } = useApi();
  const { token } = useAuth();
  const { rideId } = route.params;
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let interval;
    const fetchRide = async () => {
      try {
        const res = await axios.get(`${baseUrl}/user/rides`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const found = (res.data.user_rides || []).find((r) => r._id === rideId);
        setRide(found);
      } catch (e) {
        setRide(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRide();
    interval = setInterval(fetchRide, 5000);
    return () => clearInterval(interval);
  }, [baseUrl, token, rideId]);

  if (loading) return <ActivityIndicator size="large" color="#2563eb" />;
  if (!ride)
    return (
      <StyledText className="text-center mt-10 text-red-500">
        No active ride
      </StyledText>
    );

  return (
    <StyledView className="flex-1 bg-blue-50 px-4 py-8">
      <StyledView className="p-6 rounded-2xl bg-white shadow mb-6">
        <StyledText className="text-xl font-bold text-blue-700 mb-2">
          Active Ride
        </StyledText>
        <StyledText className="text-base text-gray-700 mb-1">
          Pickup: {ride.pickup_location}
        </StyledText>
        <StyledText className="text-base text-gray-700 mb-1">
          Drop: {ride.drop_location}
        </StyledText>
        <StyledText className="text-base text-gray-700 mb-1">
          Fare: ₹{ride.fare}
        </StyledText>
        <StyledText className="text-base text-gray-700 mb-1">
          Status: {ride.status}
        </StyledText>
      </StyledView>
    </StyledView>
  );
}
