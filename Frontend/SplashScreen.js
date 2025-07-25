import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
// import { styled } from "nativewind";

// const View = styled(View);
// const Text = styled(Text);

export default function SplashScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-blue-600">
      <Text className="text-4xl font-bold text-white mb-6">
        Adigo
      </Text>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}
