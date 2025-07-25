import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
// import { styled } from "nativewind";
import Icon from "react-native-vector-icons/FontAwesome";
import { useApi } from "../ApiContext";
import { useAuth } from "../AuthContext";
import axios from "axios";

// const View = styled(View);
// const Text = styled(Text);
// const TouchableOpacity = styled(TouchableOpacity);

export default function PaymentScreen({ route, navigation }) {
  const { rideId, fare } = route.params;
  const { baseUrl } = useApi();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      // Simulate payment with dummy backend endpoint
      // In real app, integrate Razorpay SDK and backend payment endpoint
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
    <View className="flex-1 bg-blue-50 px-4 py-8 items-center justify-center">
      <Icon
        name="credit-card"
        size={48}
        color="#2563eb"
        style={{ marginBottom: 24 }}
      />
      <Text className="text-2xl font-bold text-blue-700 mb-4">
        Payment
      </Text>
      <Text className="text-lg text-gray-700 mb-2">
        Ride Fare: <Text className="font-bold">₹{fare}</Text>
      </Text>
      <TouchableOpacity
        className="bg-green-600 rounded px-8 py-4 mt-6 flex-row items-center justify-center"
        onPress={handlePay}
        disabled={loading}
      >
        <Icon name="rupee" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text className="text-white text-lg font-semibold">
          {loading ? "Processing..." : "Pay with Razorpay"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-blue-600 rounded px-6 py-3 mt-6 flex-row items-center justify-center"
        onPress={() => navigation.goBack()}
      >
        <Icon
          name="arrow-left"
          size={20}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <Text className="text-white text-lg font-semibold">
          Back
        </Text>
      </TouchableOpacity>
    </View>
  );
}
