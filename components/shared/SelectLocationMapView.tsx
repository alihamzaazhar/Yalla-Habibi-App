import React, { useLayoutEffect } from "react";
import MapView, {
  LatLng,
  Marker,
  Region,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native";
import useReverseGeocoding from "@/api/hooks/address/queries";
import { Theme } from "@/constants";
import * as Location from "expo-location";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface Props {
  coordinates?: LatLng;
  selectCoordinates: (coordinates: LatLng) => void;
}
//Default UAE Coordinates
const defaultCoordinates = {
  latitude: 25.276987,
  longitude: 55.296249,
};
//Default UAE Region
const defaultRegion = {
  latitude: 25.276987,
  longitude: 55.296249,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};
export default function SelectLocationMapView({
  coordinates,
  selectCoordinates,
}: Props) {
  const mapRef = React.useRef<MapView>(null);
  const [currentLocation, setCurrentLocation] =
    React.useState<Region>(defaultRegion);
  const [isAtCurrentLocation, setIsAtCurrentLocation] = React.useState(false);
  const { data, status, isFetching } = useReverseGeocoding({ coordinates });
  useLayoutEffect(() => {
    (async () => {
      // Apparently if location is denied once then it has to be set explicitly from settings
      // Therefore, either accepts here, or deal with it by sending user to settings.
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      let location = coordinates
        ? {
            coords: {
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
            },
          }
        : await Location.getCurrentPositionAsync({});
      const region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setCurrentLocation(region);
      selectCoordinates({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      if (mapRef.current) {
        mapRef.current.animateToRegion(region, 1000);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        ref={mapRef}
        scrollEnabled={true}
        region={defaultRegion}
        onPoiClick={(e) => {
          selectCoordinates(e.nativeEvent.coordinate);
        }}
        onRegionChangeComplete={(region) => {
          if (
            currentLocation &&
            Math.abs(region.latitude - currentLocation.latitude) < 0.0005 &&
            Math.abs(region.longitude - currentLocation.longitude) < 0.0005
          ) {
            setIsAtCurrentLocation(true); // Map is near current location
          } else {
            setIsAtCurrentLocation(false); // Map is panned away
          }
        }}
        onPress={(e) => {
          selectCoordinates(e.nativeEvent.coordinate);
        }}
        showsUserLocation
      >
        {coordinates ? <Marker draggable coordinate={coordinates} /> : null}
      </MapView>
      <View className="absolute bottom-32 w-full items-end">
        <Pressable
          onPressIn={async () => {
            let location = await Location.getCurrentPositionAsync({});
            const currentLocationMade = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            };
            setCurrentLocation(currentLocationMade);
            selectCoordinates({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
            if (mapRef.current) {
              mapRef.current.animateToRegion(currentLocationMade, 1000);
            }
          }}
        >
          <View className="bg-white rounded-full w-14 h-14 items-center flex justify-center mr-4">
            {isAtCurrentLocation ? (
              <MaterialIcons
                size={24}
                color={Theme.blue[600]}
                name="my-location"
              />
            ) : (
              <MaterialIcons
                size={24}
                color={Theme.gray[600]}
                name="location-searching"
              />
            )}
          </View>
        </Pressable>
      </View>
      <View className="absolute top-2 self-center w-full">
        <View className=" px-3 py-1.5 rounded-md flex-1 mx-3 bg-white">
          <Text className="text-sm text-gray-400">Address</Text>
          <View className="flex-row items-center gap-1 pr-2 justify-center">
            <Text
              className="text-sm text-gray-800 font-semibold overflow-clip flex-1 line-clamp-1"
              numberOfLines={2}
            >
              {data}
            </Text>
            {status === "loading" || isFetching ? (
              <ActivityIndicator size={"small"} color={Theme.gray[600]} />
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
