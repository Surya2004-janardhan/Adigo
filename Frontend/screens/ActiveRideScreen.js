import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useApi } from "../ApiContext";
import { useAuth } from "../AuthContext";
import axios from "axios";

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

  if (loading) {
    return <ActivityIndicator size="large" color="#2563eb" />;
  }

  if (!ride) {
    return <Text style={styles.noRideText}>No active ride</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.rideCard}>
        <Text style={styles.rideTitle}>Active Ride</Text>
        <Text style={styles.rideInfo}>Pickup: {ride.pickup_location}</Text>
        <Text style={styles.rideInfo}>Drop: {ride.drop_location}</Text>
        <Text style={styles.rideInfo}>Fare: ₹{ride.fare}</Text>
        <Text style={styles.rideInfo}>Status: {ride.status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eff6ff", // Tailwind's bg-blue-50
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  rideCard: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 24,
  },
  rideTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1d4ed8", // Tailwind's text-blue-700
    marginBottom: 8,
  },
  rideInfo: {
    fontSize: 16,
    color: "#374151", // Tailwind's text-gray-700
    marginBottom: 4,
  },
  noRideText: {
    marginTop: 40,
    textAlign: "center",
    color: "#ef4444", // Tailwind's text-red-500
    fontSize: 16,
  },
});
