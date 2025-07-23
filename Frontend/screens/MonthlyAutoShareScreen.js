import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Picker,
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
    <StyledView className="flex-1 bg-blue-50 px-4 py-8">
      <StyledText className="text-2xl font-bold text-blue-700 mb-4">
        Monthly Auto Share
      </StyledText>
      {myGroup ? (
        <StyledView className="p-4 rounded-xl bg-white shadow mb-6">
          <StyledText className="text-lg font-semibold text-blue-800 mb-2">
            Your Subscription
          </StyledText>
          <StyledText>Month: {myGroup.month}</StyledText>
          <StyledText>From: {myGroup.from}</StyledText>
          <StyledText>To: {myGroup.to}</StyledText>
          <StyledText>Morning: {myGroup.time_morning}</StyledText>
          <StyledText>Evening: {myGroup.time_evening}</StyledText>
          <StyledText>Package Price: ₹{myGroup.package_price}</StyledText>
          <StyledText className="mt-2 font-semibold">
            Members ({myGroup.members.length}/10):
          </StyledText>
          <FlatList
            data={myGroup.members}
            keyExtractor={(item, idx) => idx.toString()}
            renderItem={({ item }) => (
              <StyledText className="text-gray-700">• {item}</StyledText>
            )}
          />
        </StyledView>
      ) : (
        <>
          <StyledInput
            className="border border-gray-300 rounded px-4 py-2 mb-3 w-72"
            placeholder="Home Location"
            value={from}
            onChangeText={setFrom}
          />
          <StyledInput
            className="border border-gray-300 rounded px-4 py-2 mb-3 w-72"
            placeholder="College Location"
            value={to}
            onChangeText={setTo}
          />
          <StyledInput
            className="border border-gray-300 rounded px-4 py-2 mb-3 w-72"
            placeholder="Month (YYYY-MM)"
            value={month}
            onChangeText={setMonth}
          />
          <StyledInput
            className="border border-gray-300 rounded px-4 py-2 mb-3 w-72"
            placeholder="Morning Time (e.g. 08:00)"
            value={timeMorning}
            onChangeText={setTimeMorning}
          />
          <StyledInput
            className="border border-gray-300 rounded px-4 py-2 mb-3 w-72"
            placeholder="Evening Time (e.g. 17:00)"
            value={timeEvening}
            onChangeText={setTimeEvening}
          />
          <StyledButton
            className="bg-purple-600 rounded px-6 py-3 mb-4 flex-row items-center justify-center"
            onPress={handleJoin}
            disabled={loading}
          >
            <Icon
              name="calendar-plus-o"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <StyledText className="text-white text-lg text-center font-semibold">
              {loading ? "Joining..." : "Join Monthly Auto"}
            </StyledText>
          </StyledButton>
        </>
      )}
      <StyledButton
        className="bg-blue-600 rounded px-6 py-3 mt-6 flex-row items-center justify-center"
        onPress={() => navigation.goBack()}
      >
        <Icon
          name="arrow-left"
          size={20}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <StyledText className="text-white text-lg font-semibold">
          Back
        </StyledText>
      </StyledButton>
    </StyledView>
  );
}
