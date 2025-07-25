import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { ApiProvider } from "./ApiContext";
import { AuthProvider, useAuth } from "./AuthContext";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./components/HomeScreen";
import LoginSingup from "./components/LoginSingup";
import ProfileScreen from "./components/ProfileScreen";
import RideDetailsScreen from "./components/RideDetailsScreen";
import ActiveRideScreen from "./components/ActiveRideScreen";
import RideHistoryScreen from "./components/RideHistoryScreen";
import SplashScreen from "./SplashScreen";
// import MapScreen from "./components/MapScreen";
import PaymentScreen from "./components/PaymentScreen";
import MonthlyAutoShareScreen from "./components/MonthlyAutoShareScreen";
import "./global.css";
// import { NativeWindStyleSheet } from "nativewind";

// NativeWindStyleSheet.setOutput({
  // default: "native",
// });

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
            {/* <Stack.Screen name="MapScreen" component={MapScreen} /> */}
            <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
            <Stack.Screen
              name="MonthlyAutoShare"
              component={MonthlyAutoShareScreen}
            />
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
