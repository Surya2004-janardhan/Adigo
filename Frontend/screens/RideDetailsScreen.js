import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useApi } from "../ApiContext";
import { useAuth } from "../AuthContext";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";

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

  if (!ride) return <Text style={styles.errorText}>Ride not found</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Ride Details</Text>
        <Text style={styles.text}>Pickup: {ride.pickup_location}</Text>
        <Text style={styles.text}>Drop: {ride.drop_location}</Text>
        <Text style={styles.text}>Fare: ₹{ride.fare}</Text>
        <Text style={styles.text}>Status: {ride.status}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.mapButton]}
        onPress={() =>
          navigation.navigate("MapScreen", {
            pickup: ride.pickup_location,
            drop: ride.drop_location,
          })
        }
      >
        <Icon name="map" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>View Map</Text>
      </TouchableOpacity>

      {ride.status === "pending" && (
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => handleAction("cancle")}
        >
          <Text style={styles.buttonText}>Cancel Ride</Text>
        </TouchableOpacity>
      )}

      {ride.status === "accepted" && (
        <TouchableOpacity
          style={[styles.button, styles.completeButton]}
          onPress={() => handleAction("complete")}
        >
          <Text style={styles.buttonText}>Complete Ride</Text>
        </TouchableOpacity>
      )}

      {ride.status === "completed" && !ride.paid && (
        <TouchableOpacity
          style={[styles.button, styles.paymentButton]}
          onPress={() =>
            navigation.navigate("PaymentScreen", {
              rideId: ride._id,
              fare: ride.fare,
            })
          }
        >
          <Icon name="rupee" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Pay Now</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.button, styles.mapButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Back</Text>
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
  card: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1d4ed8", // blue-700
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: "#374151", // gray-700
    marginBottom: 4,
  },
  errorText: {
    textAlign: "center",
    marginTop: 40,
    color: "#ef4444", // red-500
    fontSize: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  mapButton: {
    backgroundColor: "#2563eb", // blue-600
  },
  cancelButton: {
    backgroundColor: "#dc2626", // red-600
  },
  completeButton: {
    backgroundColor: "#16a34a", // green-600
  },
  paymentButton: {
    backgroundColor: "#15803d", // green-700
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  icon: {
    marginRight: 8,
  },
});
