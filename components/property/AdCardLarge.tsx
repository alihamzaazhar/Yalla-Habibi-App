import { Button } from "@/ui/Button";
import React from "react";
import { Image, Linking, Text, View } from "react-native";

interface Props {
  title: string;
  body: string;
  imageUrl?: string;
  url?: string;
}

const AdCardLarge = ({ body, imageUrl, title, url }: Props) => {
  return (
    <View
      className="rounded-lg overflow-hidden bg-card border border-[hsl(240,5.9%,90%)]"
      style={{ minHeight: 400 }}
    >
      <View className="relative">
        <Image
          source={
            imageUrl
              ? { uri: imageUrl }
              : require("@/assets/images/sample-image.png")
          }
          style={{ height: 210, width: "100%", objectFit: "cover" }}
        />
      </View>
      <View className="px-4 pt-3 pb-4 gap-2 justify-between flex-col flex-1">
        <View className="gap-2">
          <Text className="text-2xl font-bold">{`${title}`}</Text>
          <Text className="flex-row justify-between flex-wrap">{`${body}`}</Text>
        </View>
        <Button
          className="px-8 py-2 self-end"
          onPress={() => {
            url ? Linking.openURL(url) : null;
          }}
        >
          <Text className="text-white font-bold text-xl">Learn More</Text>
        </Button>
      </View>
    </View>
  );
};

export default AdCardLarge;
