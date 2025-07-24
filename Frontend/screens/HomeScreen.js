import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useApi } from "../ApiContext";
import { useAuth } from "../AuthContext";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";

export default function HomeScreen({ navigation }) {
  const { baseUrl } = useApi();
  const { token } = useAuth();
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

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

  const activeRide = rides.find(
    (r) => r.status === "pending" || r.status === "accepted"
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {/* User Info */}
        <View style={styles.userCard}>
          <Text style={styles.userName}>Hi, {user ? user.name : "..."}</Text>
          <Text style={styles.userRoll}>
            Roll: {user ? user.rollno : "..."}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Profile")}
        >
          <Icon name="user" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>View Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#3b82f6" }]}
          onPress={() => navigation.navigate("RideHistory")}
        >
          <Icon name="history" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Ride History</Text>
        </TouchableOpacity>

        {activeRide && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#16a34a" }]}
            onPress={() =>
              navigation.navigate("ActiveRide", { rideId: activeRide._id })
            }
          >
            <Text style={styles.buttonText}>Go to Active Ride</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#7c3aed" }]}
          onPress={() => navigation.navigate("MonthlyAutoShare")}
        >
          <Icon name="calendar" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Monthly Auto Share</Text>
        </TouchableOpacity>

        {/* Book Ride Card */}
        <View style={styles.rideCard}>
          <Text style={styles.rideCardTitle}>Book a Ride</Text>
          <TextInput
            style={styles.input}
            placeholder="Pickup Location (lat,long)"
            value={pickup}
            onChangeText={setPickup}
          />
          <TextInput
            style={[styles.input, { marginBottom: 16 }]}
            placeholder="Drop Location (lat,long)"
            value={drop}
            onChangeText={setDrop}
          />
          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleBookRide}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Booking..." : "Book Ride"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Rides */}
        <Text style={styles.sectionTitle}>Recent Rides</Text>
        {rides.length === 0 ? (
          <Text style={styles.emptyText}>No rides yet.</Text>
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
                <View style={styles.rideItem}>
                  <View>
                    <Text style={styles.rideLocation}>
                      {item.pickup_location} → {item.drop_location}
                    </Text>
                    <Text style={styles.rideStatus}>Status: {item.status}</Text>
                  </View>
                  <Text style={styles.rideFare}>₹{item.fare || "--"}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eff6ff", // bg-blue-50
    paddingHorizontal: 16, // px-4
    paddingVertical: 32, // py-8
  },
  userCard: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1d4ed8", // text-blue-700
  },
  userRoll: {
    fontSize: 16,
    color: "#6b7280", // text-gray-500
  },
  button: {
    backgroundColor: "#2563eb", // default blue
    borderRadius: 6,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  rideCard: {
    marginBottom: 32,
    padding: 24,
    borderRadius: 20,
    backgroundColor: "#dbeafe", // bg-blue-100
    elevation: 2,
  },
  rideCardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e40af", // text-blue-800
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#93c5fd", // border-blue-300
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 12,
  },
  bookButton: {
    backgroundColor: "#2563eb",
    borderRadius: 6,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e40af",
    marginBottom: 8,
  },
  emptyText: {
    color: "#6b7280", // text-gray-500
    marginBottom: 32,
  },
  rideItem: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  rideLocation: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1d4ed8",
  },
  rideStatus: {
    fontSize: 12,
    color: "#6b7280",
  },
  rideFare: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2563eb",
  },
});
