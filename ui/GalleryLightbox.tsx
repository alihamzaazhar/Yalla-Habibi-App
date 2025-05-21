import { useNavigation } from "expo-router";
import React, { useRef, useState } from "react";
import { Image, StyleSheet, StatusBar, Text, View } from "react-native";
import { GalleryRef, RenderItemInfo } from "react-native-awesome-gallery";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AwesomeGallery from "react-native-awesome-gallery";
import NoHeaderLayout from "@/components/layouts/NoHeaderLayout";
import BorderlessButton from "./BorderlessButton";
import Feather from "@expo/vector-icons/Feather";
import { Theme } from "@/constants";

const renderItem = ({ item }: RenderItemInfo<string>) => {
  return (
    <Image
      source={{ uri: item }}
      style={[
        StyleSheet.absoluteFillObject,
        {
          backgroundColor: "rgba(1,1,1, 0.5)",
        },
      ]}
      resizeMode="contain"
      // onLoad={(e) => {
      //   const { width, height } = e.nativeEvent.source;
      //   setImageDimensions({ width, height });
      // }}
    />
  );
};

type Props = {
  images: Array<string>;
  initalNumToRender?: number;
};

export const GalleryLightbox = ({ images, initalNumToRender = 0 }: Props) => {
  const { goBack } = useNavigation();
  const { top, bottom } = useSafeAreaInsets();
  const gallery = useRef<GalleryRef>(null);
  const [currentIndex, setCurrentIndex] = useState(initalNumToRender);

  return (
    <NoHeaderLayout>
      <View
        className="absolute"
        style={{ top: top + 16, left: 8, zIndex: 9999 }}
      >
        <BorderlessButton
          onPress={goBack}
          style={{
            backgroundColor: "rgba(1,1,1,0.5)",
            padding: 8,
            borderRadius: 24,
          }}
        >
          <Feather name="x" size={24} color={Theme.white} />
        </BorderlessButton>
      </View>

      <AwesomeGallery
        ref={gallery}
        renderItem={renderItem}
        data={images}
        initialIndex={initalNumToRender}
        onIndexChange={(index) => {
          setCurrentIndex(index);
        }}
        doubleTapInterval={150}
        onSwipeToClose={goBack}
        loop
        onScaleEnd={(scale) => {
          if (scale < 0.8) {
            goBack();
          }
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: bottom + 80,
          zIndex: 9999,
          width: "100%",
        }}
      >
        <View className="flex-row items-center justify-center w-full">
          <Text
            className="text-md font-bold text-white"
            style={{
              backgroundColor: "rgba(1,1,1,0.5)",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
            }}
          >
            Showing {currentIndex + 1} of {images.length}
          </Text>
        </View>
      </View>
    </NoHeaderLayout>
  );
};

export default GalleryLightbox;
