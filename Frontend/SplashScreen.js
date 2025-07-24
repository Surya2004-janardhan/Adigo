import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adigo</Text>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2563eb", // Tailwind 'bg-blue-600'
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32, // Tailwind 'text-4xl'
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 24, // Tailwind 'mb-6'
  },
});
