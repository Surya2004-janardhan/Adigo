import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  SafeAreaView,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
// import { styled } from "nativewind";
import { useApi } from "../ApiContext";
import { useAuth } from "../AuthContext";
import axios from "axios";
import { MotiView } from "moti";

// import Icon from "react-native-vector-icons/FontAwesome";

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
          headers: { authentication: `Bearer ${token}` },
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
        { headers: { authentication: `Bearer ${token}` } }
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
        headers: { authentication: `Bearer ${token}` },
      });
      setRides(res.data.user_rides || []);
    } catch (e) {
      setRides([]);
    } finally {
      setLoading(false);
    }
  };
  const activeRide = rides.find(
    (r) => r.status === "pending" || r.status === "accepted"
  );

  // Bottom nav handler, active tab state:
  const [activeTab, setActiveTab] = useState("Home");

  // Dummy tab navigation handler:
  const handleTabPress = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case "Profile":
        navigation.navigate("Profile");
        break;
      case "History":
        navigation.navigate("RideHistory");
        break;
      case "Home":
      default:
        // stay on home
        break;
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        className="px-5 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {/* User Card with animated entrance */}
        <Animated.View
          className={`bg-gray-100 rounded-3xl px-6 py-5 mb-6 shadow-md flex-row justify-between items-center
            transition-all duration-700 ${MotiView ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
        >
          <View>
            <Text className="text-2xl font-extrabold text-black">
              Hello, {user ? user.name : "..."}
            </Text>
            <Text className="text-sm text-gray-600 mt-1">
              Roll Number: {user ? user.rollno : "..."}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            activeOpacity={0.7}
            className="bg-black rounded-full p-3 shadow
              transition-all duration-200
              active:scale-90"
          >
            <Icon name="user" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>

        {/* Action buttons with touch feedback */}
        <View className="flex-row justify-between mb-6 space-x-4">
          <TouchableOpacity
            onPress={() => navigation.navigate("RideHistory")}
            activeOpacity={0.8}
            className="flex-1 bg-gray-900 rounded-xl py-4 shadow flex-row items-center justify-center
              transition-all duration-150 active:scale-95"
          >
            <Icon name="history" size={20} color="white" />
            <Text className="text-white font-semibold ml-3">Ride History</Text>
          </TouchableOpacity>

          {activeRide && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ActiveRide", { rideId: activeRide._id })
              }
              activeOpacity={0.8}
              className="flex-1 bg-green-800 rounded-xl py-4 shadow items-center justify-center
                transition-all duration-150 active:scale-95"
            >
              <Text className="text-white font-semibold">Active Ride</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Book a Ride Card with animated entry */}
        <Animated.View
          className={`bg-gray-50 rounded-3xl p-6 shadow mb-8
            transition-all duration-700 ${MotiView ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
        >
          <Text className="text-xl font-bold text-black mb-5">Book a Ride</Text>
          <TextInput
            placeholder="Pickup Location (lat,long)"
            placeholderTextColor="#7a7a7a"
            value={pickup}
            onChangeText={setPickup}
            className="border border-gray-300 rounded-xl px-5 py-3 mb-4 bg-white text-black"
          />
          <TextInput
            placeholder="Drop Location (lat,long)"
            placeholderTextColor="#7a7a7a"
            value={drop}
            onChangeText={setDrop}
            className="border border-gray-300 rounded-xl px-5 py-3 mb-6 bg-white text-black"
          />
          <TouchableOpacity
            className={`bg-black rounded-xl py-4 shadow 
              transition-all duration-150 active:scale-95
              ${loading ? "opacity-70 animate-pulse" : "opacity-100"}`}
            onPress={() => {
              // Your handleBookRide here
              Alert.alert("Button pressed", "Implement booking logic");
            }}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-center text-lg">
              {loading ? "Booking..." : "Book Ride"}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Recent Rides */}
        <Text className="text-xl font-bold text-black mb-4">Recent Rides</Text>
        {rides.length === 0 ? (
          <Text className="text-gray-500 mb-8">No rides booked yet.</Text>
        ) : (
          <FlatList
            data={rides}
            keyExtractor={(item, idx) => idx.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("RideDetails", { rideId: item._id })
                }
                activeOpacity={0.7}
                className="mb-4 transition-all duration-200 active:scale-98"
              >
                <View className="bg-white rounded-2xl p-5 shadow flex-row justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="font-semibold text-black text-base">
                      {item.pickup_location} → {item.drop_location}
                    </Text>
                    <Text className="text-gray-600 mt-1 capitalize">
                      Status: {item.status}
                    </Text>
                  </View>
                  <View className="justify-center">
                    <Text className="text-black font-semibold text-lg">
                      ₹{item.fare ?? "--"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </ScrollView>
      {/* Animated Bottom Navbar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-300 flex-row justify-around py-3 shadow-lg">
        {[
          { label: "Home", icon: "home" },
          { label: "Profile", icon: "user" },
          { label: "History", icon: "history" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.label}
            onPress={() => handleTabPress(tab.label)}
            activeOpacity={0.75}
            className="items-center flex-1"
            style={{
              transform: [
                {
                  scale: activeTab === tab.label ? 1.14 : 1,
                },
              ],
            }}
          >
            <Icon
              name={tab.icon}
              size={activeTab === tab.label ? 28 : 24}
              color={activeTab === tab.label ? "black" : "gray"}
            />
            <Text
              className={`text-xs mt-1 transition-all duration-200 ${
                activeTab === tab.label
                  ? "text-black font-semibold"
                  : "text-gray-500"
              }`}
              style={{
                letterSpacing: activeTab === tab.label ? 2 : 0.5,
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>{" "}
    </SafeAreaView>
  );
}
