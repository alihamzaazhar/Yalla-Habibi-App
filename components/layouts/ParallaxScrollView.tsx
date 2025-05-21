import { Button } from "@/ui/Button";
import ImagesCarousel from "@/ui/ImagesCarousel";
import { useNavigation } from "expo-router";

import Entypo from "@expo/vector-icons/Entypo";
import {
  useLayoutEffect,
  type PropsWithChildren,
  type ReactElement,
} from "react";
import { View, Text, Dimensions } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { FavouriteButtonLarge } from "../shared/FavouriteButton";
import { SafeAreaView } from "react-native-safe-area-context";
import BorderlessButton from "@/ui/BorderlessButton";
import { Theme } from "@/constants";

const HEADER_HEIGHT = 300;

type Props = PropsWithChildren<{
  headerImages?: Array<string>;
  className?: string;
  headerChildren?: React.ReactNode;
  favouriteButton?: {
    id: string;
    type: string;
    is_favourite: boolean;
  };
}>;

export default function ParallaxScrollView({
  children,
  className,
  favouriteButton,
  headerChildren = null,
  headerImages = [],
}: Props) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const navigation = useNavigation();

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerTransparent: true,
      headerShown: false,
    });
  }, [favouriteButton]);

  return (
    <Animated.ScrollView
      contentContainerClassName={className}
      ref={scrollRef}
      scrollEventThrottle={16}
    >
      <View style={{ height: 300, position: "relative" }}>
        {headerImages.length ? (
          <ImagesCarousel style={headerAnimatedStyle} images={headerImages} />
        ) : (
          <Animated.Image
            source={require("@/assets/images/sample-image.png")}
            style={{ width: "100%", height: 300 }}
            resizeMode={"cover"}
          />
        )}
        {headerChildren}
        <View className="absolute top-0 w-full">
          <SafeAreaView>
            <View className="flex justify-between items-center flex-row px-4 py-2">
              <BorderlessButton
                onPress={() => navigation.goBack()}
                className="rounded-full bg-white p-1.5 mt-1"
              >
                <Entypo name="chevron-left" size={20} color={Theme.slate[500]} />
              </BorderlessButton>
              {favouriteButton ? (
                <FavouriteButtonLarge
                  id={favouriteButton.id}
                  className="relative top-0 bottom-0"
                  type={favouriteButton.type}
                  isFavourite={favouriteButton.is_favourite}
                />
              ) : null}
            </View>
          </SafeAreaView>
        </View>
      </View>
      <View className="flex-1">{children}</View>
    </Animated.ScrollView>
  );
}
