import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { ApiProvider } from "./ApiContext";
import { AuthProvider, useAuth } from "./AuthContext";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import LoginSingup from "./screens/LoginSingup";
import ProfileScreen from "./screens/ProfileScreen";
import RideDetailsScreen from "./screens/RideDetailsScreen";
import ActiveRideScreen from "./screens/ActiveRideScreen";
import RideHistoryScreen from "./screens/RideHistoryScreen";
import SplashScreen from "./SplashScreen";
import MapScreen from "./screens/MapScreen";
import PaymentScreen from "./screens/PaymentScreen";

const Stack = createStackNavigator();

function RootNavigator() {
  const { user, loading } = useAuth();
  if (loading) return <SplashScreen />;
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="RideDetails" component={RideDetailsScreen} />
            <Stack.Screen name="ActiveRide" component={ActiveRideScreen} />
            <Stack.Screen name="RideHistory" component={RideHistoryScreen} />
            <Stack.Screen name="MapScreen" component={MapScreen} />
            <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
          </>
        ) : (
          <Stack.Screen name="LoginSingup" component={LoginSingup} />
        )}
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ApiProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ApiProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
