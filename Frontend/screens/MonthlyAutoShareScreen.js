import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";
import { useApi } from "../ApiContext";
import { useAuth } from "../AuthContext";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";

export default function MonthlyAutoShareScreen({ navigation }) {
  const { baseUrl } = useApi();
  const { token, user } = useAuth();

  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [timeMorning, setTimeMorning] = useState("08:00");
  const [timeEvening, setTimeEvening] = useState("17:00");
  const [myGroup, setMyGroup] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchMyGroup();
  }, [token]);

  const fetchMyGroup = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/monthly-auto/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyGroup(res.data.group);
    } catch {
      setMyGroup(null);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!from || !to) {
      Alert.alert("Error", "Please enter both home and college locations");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${baseUrl}/monthly-auto/join`,
        {
          month,
          from,
          to,
          time_morning: timeMorning,
          time_evening: timeEvening,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMyGroup(res.data.group);
      Alert.alert("Success", res.data.message);
    } catch (e) {
      Alert.alert("Error", e.response?.data?.message || "Could not join");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Monthly Auto Share</Text>

      {myGroup ? (
        <View style={styles.subscriptionCard}>
          <Text style={styles.subscriptionTitle}>Your Subscription</Text>
          <Text>Month: {myGroup.month}</Text>
          <Text>From: {myGroup.from}</Text>
          <Text>To: {myGroup.to}</Text>
          <Text>Morning: {myGroup.time_morning}</Text>
          <Text>Evening: {myGroup.time_evening}</Text>
          <Text>Package Price: ₹{myGroup.package_price}</Text>
          <Text style={styles.memberTitle}>
            Members ({myGroup.members.length}/10):
          </Text>
          <FlatList
            data={myGroup.members}
            keyExtractor={(item, idx) => idx.toString()}
            renderItem={({ item }) => (
              <Text style={styles.memberItem}>• {item}</Text>
            )}
          />
        </View>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Home Location"
            value={from}
            onChangeText={setFrom}
          />
          <TextInput
            style={styles.input}
            placeholder="College Location"
            value={to}
            onChangeText={setTo}
          />
          <TextInput
            style={styles.input}
            placeholder="Month (YYYY-MM)"
            value={month}
            onChangeText={setMonth}
          />
          <TextInput
            style={styles.input}
            placeholder="Morning Time (e.g. 08:00)"
            value={timeMorning}
            onChangeText={setTimeMorning}
          />
          <TextInput
            style={styles.input}
            placeholder="Evening Time (e.g. 17:00)"
            value={timeEvening}
            onChangeText={setTimeEvening}
          />
          <TouchableOpacity
            style={styles.joinButton}
            onPress={handleJoin}
            disabled={loading}
          >
            <Icon
              name="calendar-plus-o"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.joinButtonText}>
              {loading ? "Joining..." : "Join Monthly Auto"}
            </Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon
          name="arrow-left"
          size={20}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eff6ff", // bg-blue-50
    paddingHorizontal: 16, // px-4
    paddingVertical: 32, // py-8
  },
  header: {
    fontSize: 24, // text-2xl
    fontWeight: "bold",
    color: "#1d4ed8", // text-blue-700
    marginBottom: 16, // mb-4
  },
  subscriptionCard: {
    padding: 16, // p-4
    borderRadius: 12, // rounded-xl
    backgroundColor: "#fff",
    marginBottom: 24, // mb-6
    elevation: 2, // shadow
  },
  subscriptionTitle: {
    fontSize: 18, // text-lg
    fontWeight: "600",
    color: "#1e40af", // text-blue-800
    marginBottom: 8, // mb-2
  },
  memberTitle: {
    marginTop: 8, // mt-2
    fontWeight: "600",
  },
  memberItem: {
    color: "#374151", // text-gray-700
  },
  input: {
    borderColor: "#d1d5db", // border-gray-300
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 16, // px-4
    paddingVertical: 8, // py-2
    marginBottom: 12,
    width: 288, // w-72
    alignSelf: "flex-start",
  },
  joinButton: {
    backgroundColor: "#9333ea", // bg-purple-600
    borderRadius: 6,
    paddingHorizontal: 24, // px-6
    paddingVertical: 12, // py-3
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  joinButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: "#2563eb", // bg-blue-600
    borderRadius: 6,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 24, // mt-6
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
