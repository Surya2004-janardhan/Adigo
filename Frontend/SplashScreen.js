import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);

export default function SplashScreen() {
  return (
    <StyledView className="flex-1 items-center justify-center bg-blue-600">
      <StyledText className="text-4xl font-bold text-white mb-6">
        Adigo
      </StyledText>
      <ActivityIndicator size="large" color="#fff" />
    </StyledView>
  );
}
