import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import MapView, { Marker } from "react-native-maps";
import Icon from "react-native-vector-icons/FontAwesome";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledButton = styled(TouchableOpacity);

export default function MapScreen({ route, navigation }) {
  const { pickup, drop } = route.params;
  const [pickupLat, pickupLng] = pickup.split(",").map(Number);
  const [dropLat, dropLng] = drop.split(",").map(Number);

  return (
    <StyledView className="flex-1 bg-blue-50">
      <StyledView className="flex-row items-center p-4 bg-blue-600">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <StyledText className="text-white text-xl font-bold ml-4 flex-1">
          Ride Map
        </StyledText>
        <Icon name="map-marker" size={28} color="#fff" />
      </StyledView>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: pickupLat,
          longitude: pickupLng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{ latitude: pickupLat, longitude: pickupLng }}
          title="Pickup"
          pinColor="green"
        />
        <Marker
          coordinate={{ latitude: dropLat, longitude: dropLng }}
          title="Drop"
          pinColor="red"
        />
      </MapView>
    </StyledView>
  );
}
