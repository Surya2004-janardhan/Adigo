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
// import { styled } from "nativewind";
import { useApi } from "../ApiContext";
import { useAuth } from "../AuthContext";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";

// const View = styled(View);
// const Text = styled(Text);
// const TextInput = styled(TextInput);
// const TouchableOpacity = styled(TouchableOpacity);

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
      <View className="flex-1 bg-blue-50 px-4 py-8">
        {/* User Info */}
        <View className="mb-6 p-4 rounded-xl bg-white shadow flex-row items-center justify-between">
          <Text className="text-xl font-bold text-blue-700">
            Hi, {user ? user.name : "..."}
          </Text>
          <Text className="text-base text-gray-500">
            Roll: {user ? user.rollno : "..."}
          </Text>
        </View>
        <TouchableOpacity
          className="bg-blue-600 rounded px-6 py-3 mb-4 flex-row items-center justify-center"
          onPress={() => navigation.navigate("Profile")}
        >
          <Icon name="user" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text className="text-white text-lg text-center font-semibold">
            View Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-blue-500 rounded px-6 py-3 mb-4 flex-row items-center justify-center"
          onPress={() => navigation.navigate("RideHistory")}
        >
          <Icon
            name="history"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text className="text-white text-lg text-center font-semibold">
            Ride History
          </Text>
        </TouchableOpacity>
        {activeRide && (
          <TouchableOpacity
            className="bg-green-600 rounded px-6 py-3 mb-4"
            onPress={() =>
              navigation.navigate("ActiveRide", { rideId: activeRide._id })
            }
          >
            <Text className="text-white text-lg text-center font-semibold">
              Go to Active Ride
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className="bg-purple-600 rounded px-6 py-3 mb-4 flex-row items-center justify-center"
          onPress={() => navigation.navigate("MonthlyAutoShare")}
        >
          <Icon
            name="calendar"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text className="text-white text-lg text-center font-semibold">
            Monthly Auto Share
          </Text>
        </TouchableOpacity>
        {/* Book Ride Card */}
        <View className="mb-8 p-6 rounded-2xl bg-blue-100 shadow">
          <Text className="text-lg font-semibold text-blue-800 mb-4">
            Book a Ride
          </Text>
          <TextInput
            className="border border-blue-300 rounded px-4 py-2 mb-3 bg-white"
            placeholder="Pickup Location (lat,long)"
            value={pickup}
            onChangeText={setPickup}
          />
          <TextInput
            className="border border-blue-300 rounded px-4 py-2 mb-4 bg-white"
            placeholder="Drop Location (lat,long)"
            value={drop}
            onChangeText={setDrop}
          />
          <TouchableOpacity
            className="bg-blue-600 rounded px-6 py-3"
            onPress={handleBookRide}
            disabled={loading}
          >
            <Text className="text-white text-lg text-center font-semibold">
              {loading ? "Booking..." : "Book Ride"}
            </Text>
          </TouchableOpacity>
        </View>
        {/* Recent Rides */}
        <Text className="text-lg font-semibold text-blue-800 mb-2">
          Recent Rides
        </Text>
        {rides.length === 0 ? (
          <Text className="text-gray-500 mb-8">No rides yet.</Text>
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
                <View className="mb-3 p-4 rounded-xl bg-white shadow flex-row justify-between items-center">
                  <View>
                    <Text className="text-base font-bold text-blue-700">
                      {item.pickup_location} → {item.drop_location}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      Status: {item.status}
                    </Text>
                  </View>
                  <Text className="text-base font-semibold text-blue-600">
                    ₹{item.fare || "--"}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </ScrollView>
  );
}
