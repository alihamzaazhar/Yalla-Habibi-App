import { Theme } from "@/constants";
import Card from "@/ui/Card";
import RectButton from "@/ui/RectButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Linking, Platform, Pressable, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

type Props = {
  title: string;
  address: string;
  location: {
    coordinates: Array<number>;
  };
};

const DisplayLocationCard = ({ address, location, title }: Props) => {
  const openAddressOnMap = (label: string, lat: number, lng: number) => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${lat},${lng}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    url ? Linking.openURL(url) : null;
  };
  return (
    <RectButton
      onPress={() =>
        openAddressOnMap(
          title,
          location.coordinates[1],
          location.coordinates[0]
        )
      }
      className="overflow-hidden rounded-lg"
      ButtonProps={{
        style: [
          {
            backgroundColor: Theme.card.DEFAULT,
            borderRadius: 8,
            overflow: "hidden",
          },
        ],
      }}
    >
      <View className="flex-1" style={{ height: 160 }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          className="flex-1"
          style={{ width: "100%", height: "100%" }}
          region={{
            latitude: location.coordinates[1],
            longitude: location.coordinates[0],
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <Marker
            coordinate={{
              latitude: location.coordinates[1],
              longitude: location.coordinates[0],
            }}
          />
        </MapView>
      </View>
      <View className="flex-row items-center gap-2 px-2 py-4">
        <View>
          <Ionicons name="location-outline" size={20} color={Theme.gray[600]} />
        </View>
        <Text
          className="text-gray-600 font-medium"
          numberOfLines={1}
          style={{ flex: 1 }}
          ellipsizeMode="middle"
        >
          {address}
        </Text>
      </View>
    </RectButton>
  );
};

export default DisplayLocationCard;
