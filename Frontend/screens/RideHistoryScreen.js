import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useApi } from "../ApiContext";
import { useAuth } from "../AuthContext";
import axios from "axios";

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
    <View style={styles.container}>
      <Text style={styles.header}>Ride History</Text>

      {rides.length === 0 ? (
        <Text style={styles.noRidesText}>No rides found.</Text>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={({ item }) => (
            <View style={styles.rideCard}>
              <View>
                <Text style={styles.rideLocation}>
                  {item.pickup_location} → {item.drop_location}
                </Text>
                <Text style={styles.rideMeta}>
                  Status: {item.status} |{" "}
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString()
                    : ""}
                </Text>
              </View>
              <Text style={styles.fare}>₹{item.fare || "--"}</Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eff6ff", // blue-50
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1d4ed8", // blue-700
    marginBottom: 16,
  },
  noRidesText: {
    color: "#6b7280", // gray-500
    marginBottom: 32,
  },
  rideCard: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rideLocation: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1d4ed8",
  },
  rideMeta: {
    fontSize: 12,
    color: "#6b7280", // gray-500
  },
  fare: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2563eb", // blue-600
  },
  backButton: {
    backgroundColor: "#2563eb", // blue-600
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 24,
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
  },
});
