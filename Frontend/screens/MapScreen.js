import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Icon from "react-native-vector-icons/FontAwesome";

export default function MapScreen({ route, navigation }) {
  const { pickup, drop } = route.params;
  const [pickupLat, pickupLng] = pickup.split(",").map(Number);
  const [dropLat, dropLng] = drop.split(",").map(Number);

  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(
        [
          { latitude: pickupLat, longitude: pickupLng },
          { latitude: dropLat, longitude: dropLng },
        ],
        {
          edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
          animated: true,
        }
      );
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Ride Map</Text>
        <Icon name="map-marker" size={28} color="#fff" />
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebf8ff", // Tailwind's blue-50
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#2563eb", // Tailwind's blue-600
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
