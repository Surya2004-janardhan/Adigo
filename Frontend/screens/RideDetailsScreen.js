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

export default function RideDetailsScreen({ route, navigation }) {
  const { baseUrl } = useApi();
  const { token } = useAuth();
  const { rideId } = route.params;
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchRide = async () => {
      try {
        const res = await axios.get(`${baseUrl}/user/rides`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const found = (res.data.user_rides || []).find((r) => r._id === rideId);
        setRide(found);
      } catch (e) {
        Alert.alert("Error", "Could not fetch ride details");
      } finally {
        setLoading(false);
      }
    };
    fetchRide();
  }, [baseUrl, token, rideId]);

  const handleAction = async (action) => {
    try {
      setLoading(true);
      await axios.patch(
        `${baseUrl}/user/${action}/${rideId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Alert.alert("Success", `Ride ${action}d successfully`);
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", `Could not ${action} ride`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#2563eb" />;
  if (!ride)
    return (
      <StyledText className="text-center mt-10 text-red-500">
        Ride not found
      </StyledText>
    );

  return (
    <StyledView className="flex-1 bg-blue-50 px-4 py-8">
      <StyledView className="p-6 rounded-2xl bg-white shadow mb-6">
        <StyledText className="text-xl font-bold text-blue-700 mb-2">
          Ride Details
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
      <StyledButton
        className="bg-blue-600 rounded px-6 py-3 mb-3 flex-row items-center justify-center"
        onPress={() =>
          navigation.navigate("MapScreen", {
            pickup: ride.pickup_location,
            drop: ride.drop_location,
          })
        }
      >
        <Icon name="map" size={20} color="#fff" style={{ marginRight: 8 }} />
        <StyledText className="text-white text-lg text-center font-semibold">
          View Map
        </StyledText>
      </StyledButton>
      {ride.status === "pending" && (
        <StyledButton
          className="bg-red-600 rounded px-6 py-3 mb-3"
          onPress={() => handleAction("cancle")}
        >
          <StyledText className="text-white text-lg text-center font-semibold">
            Cancel Ride
          </StyledText>
        </StyledButton>
      )}
      {ride.status === "accepted" && (
        <StyledButton
          className="bg-green-600 rounded px-6 py-3 mb-3"
          onPress={() => handleAction("complete")}
        >
          <StyledText className="text-white text-lg text-center font-semibold">
            Complete Ride
          </StyledText>
        </StyledButton>
      )}
      {ride.status === "completed" && !ride.paid && (
        <StyledButton
          className="bg-green-700 rounded px-6 py-3 mb-3 flex-row items-center justify-center"
          onPress={() =>
            navigation.navigate("PaymentScreen", {
              rideId: ride._id,
              fare: ride.fare,
            })
          }
        >
          <Icon
            name="rupee"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <StyledText className="text-white text-lg text-center font-semibold">
            Pay Now
          </StyledText>
        </StyledButton>
      )}
      <StyledButton
        className="bg-blue-600 rounded px-6 py-3"
        onPress={() => navigation.goBack()}
      >
        <StyledText className="text-white text-lg text-center font-semibold">
          Back
        </StyledText>
      </StyledButton>
    </StyledView>
  );
}
