import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useApi } from "../ApiContext";
import { useAuth } from "../AuthContext";
import axios from "axios";

export default function PaymentScreen({ route, navigation }) {
  const { rideId, fare } = route.params;
  const { baseUrl } = useApi();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${baseUrl}/payment/razorpay`,
        { rideId, amount: fare },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Alert.alert("Payment Success", "Your payment was successful!", [
        { text: "OK", onPress: () => navigation.replace("Home") },
      ]);
    } catch (e) {
      Alert.alert(
        "Payment Failed",
        "There was a problem processing your payment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Icon name="credit-card" size={48} color="#2563eb" style={styles.icon} />
      <Text style={styles.title}>Payment</Text>
      <Text style={styles.fareText}>
        Ride Fare: <Text style={styles.bold}>₹{fare}</Text>
      </Text>

      <TouchableOpacity
        style={[styles.button, styles.payButton]}
        onPress={handlePay}
        disabled={loading}
      >
        <Icon name="rupee" size={20} color="#fff" style={styles.iconInline} />
        <Text style={styles.buttonText}>
          {loading ? "Processing..." : "Pay with Razorpay"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.backButton]}
        onPress={() => navigation.goBack()}
      >
        <Icon
          name="arrow-left"
          size={20}
          color="#fff"
          style={styles.iconInline}
        />
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
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginBottom: 24,
  },
  iconInline: {
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1d4ed8", // blue-700
    marginBottom: 16,
  },
  fareText: {
    fontSize: 18,
    color: "#374151", // gray-700
    marginBottom: 8,
  },
  bold: {
    fontWeight: "bold",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 24,
  },
  payButton: {
    backgroundColor: "#16a34a", // green-600
  },
  backButton: {
    backgroundColor: "#2563eb", // blue-600
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
});
