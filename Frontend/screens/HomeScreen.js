import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";
import { styled } from "nativewind";
import { useApi } from "../ApiContext";
import { useAuth } from "../AuthContext";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledButton = styled(TouchableOpacity);

export default function HomeScreen({ navigation }) {
  const { baseUrl } = useApi();
  const { token } = useAuth();
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch user info
  useEffect(() => {
    if (!token) return;
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${baseUrl}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (e) {
        setUser({ name: "User", rollno: "12345" }); // fallback
      }
    };
    fetchUser();
  }, [baseUrl, token]);

  // Fetch rides on mount
  useEffect(() => {
    if (!token) return;
    fetchRides();
  }, [baseUrl, token]);

  const handleBookRide = async () => {
    if (!pickup || !drop) {
      Alert.alert("Error", "Please enter both pickup and drop locations");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${baseUrl}/user/bookRide`,
        { pickup_location: pickup, drop_location: drop },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Success", res.data.message || "Ride booked!");
      setPickup("");
      setDrop("");
      fetchRides();
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

  const fetchRides = async () => {
    setLoading(true);
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

  // Find active ride (status not completed/cancled)
  const activeRide = rides.find(
    (r) => r.status === "pending" || r.status === "accepted"
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledView className="flex-1 bg-blue-50 px-4 py-8">
        {/* User Info */}
        <StyledView className="mb-6 p-4 rounded-xl bg-white shadow flex-row items-center justify-between">
          <StyledText className="text-xl font-bold text-blue-700">
            Hi, {user ? user.name : "..."}
          </StyledText>
          <StyledText className="text-base text-gray-500">
            Roll: {user ? user.rollno : "..."}
          </StyledText>
        </StyledView>
        <StyledButton
          className="bg-blue-600 rounded px-6 py-3 mb-4 flex-row items-center justify-center"
          onPress={() => navigation.navigate("Profile")}
        >
          <Icon name="user" size={20} color="#fff" style={{ marginRight: 8 }} />
          <StyledText className="text-white text-lg text-center font-semibold">
            View Profile
          </StyledText>
        </StyledButton>
        <StyledButton
          className="bg-blue-500 rounded px-6 py-3 mb-4 flex-row items-center justify-center"
          onPress={() => navigation.navigate("RideHistory")}
        >
          <Icon
            name="history"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <StyledText className="text-white text-lg text-center font-semibold">
            Ride History
          </StyledText>
        </StyledButton>
        {activeRide && (
          <StyledButton
            className="bg-green-600 rounded px-6 py-3 mb-4"
            onPress={() =>
              navigation.navigate("ActiveRide", { rideId: activeRide._id })
            }
          >
            <StyledText className="text-white text-lg text-center font-semibold">
              Go to Active Ride
            </StyledText>
          </StyledButton>
        )}
        {/* Book Ride Card */}
        <StyledView className="mb-8 p-6 rounded-2xl bg-blue-100 shadow">
          <StyledText className="text-lg font-semibold text-blue-800 mb-4">
            Book a Ride
          </StyledText>
          <StyledInput
            className="border border-blue-300 rounded px-4 py-2 mb-3 bg-white"
            placeholder="Pickup Location (lat,long)"
            value={pickup}
            onChangeText={setPickup}
          />
          <StyledInput
            className="border border-blue-300 rounded px-4 py-2 mb-4 bg-white"
            placeholder="Drop Location (lat,long)"
            value={drop}
            onChangeText={setDrop}
          />
          <StyledButton
            className="bg-blue-600 rounded px-6 py-3"
            onPress={handleBookRide}
            disabled={loading}
          >
            <StyledText className="text-white text-lg text-center font-semibold">
              {loading ? "Booking..." : "Book Ride"}
            </StyledText>
          </StyledButton>
        </StyledView>
        {/* Recent Rides */}
        <StyledText className="text-lg font-semibold text-blue-800 mb-2">
          Recent Rides
        </StyledText>
        {rides.length === 0 ? (
          <StyledText className="text-gray-500 mb-8">No rides yet.</StyledText>
        ) : (
          <FlatList
            data={rides}
            keyExtractor={(item, idx) => idx.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("RideDetails", { rideId: item._id })
                }
              >
                <StyledView className="mb-3 p-4 rounded-xl bg-white shadow flex-row justify-between items-center">
                  <StyledView>
                    <StyledText className="text-base font-bold text-blue-700">
                      {item.pickup_location} → {item.drop_location}
                    </StyledText>
                    <StyledText className="text-xs text-gray-500">
                      Status: {item.status}
                    </StyledText>
                  </StyledView>
                  <StyledText className="text-base font-semibold text-blue-600">
                    ₹{item.fare || "--"}
                  </StyledText>
                </StyledView>
              </TouchableOpacity>
            )}
          />
        )}
      </StyledView>
    </ScrollView>
  );
}
