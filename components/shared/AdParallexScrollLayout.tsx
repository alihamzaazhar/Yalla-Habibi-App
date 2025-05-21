import { useNavigation, useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import { useLayoutEffect, type PropsWithChildren, lazy, Suspense } from "react";
import { View } from "react-native";
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
import EditButton from "./EditButton";
import PremiumTag from "./atoms/PremiumTag";
const ImagesCarousel = lazy(() => import("@/ui/ImagesCarousel"));

const HEADER_HEIGHT = 300;

type Props = PropsWithChildren<{
  id?: string;
  className?: string;
  headerImages: Array<string>;
  thumbnail?: string;
  adOwnerId: string;
  isPremium?: boolean;
  onEdit?: () => void;
  onImageTapped?: (index: number) => void;
  favouriteButton: {
    id: string;
    type: string;
    isFavourite: boolean;
  };
}>;

export default function AdParallexScrollLayout({
  id,
  children,
  className,
  favouriteButton,
  adOwnerId,
  isPremium = false,
  thumbnail,
  headerImages = [],
  ...props
}: Props) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const navigation = useNavigation();
  const router = useRouter();

  const sortedHeaderImages = headerImages.sort((a, b) =>
    a === thumbnail ? -1 : b === thumbnail ? 1 : 0
  );
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
  }, []);

  return (
    <Animated.ScrollView
      contentContainerClassName={className}
      ref={scrollRef}
      scrollEventThrottle={16}
    >
      <View style={{ height: HEADER_HEIGHT, position: "relative" }}>
        <Suspense fallback={null}>
          <ImagesCarousel
            style={headerAnimatedStyle}
            images={sortedHeaderImages}
            onImageTapped={props.onImageTapped}
          />
        </Suspense>
        {isPremium ? <PremiumTag style={{ bottom: 18, right: 20 }} /> : null}
        <View className="absolute top-0 w-full">
          <SafeAreaView>
            <View className="flex justify-between items-center flex-row px-4 py-2">
              <BorderlessButton
                onPress={() => router.back()}
                className="rounded-full bg-white p-1.5"
              >
                <Entypo
                  name="chevron-left"
                  size={20}
                  color={Theme.slate[500]}
                />
              </BorderlessButton>
              <View className="flex flex-row gap-3">
                <FavouriteButtonLarge
                  id={favouriteButton.id}
                  type={favouriteButton.type}
                  isFavourite={favouriteButton.isFavourite}
                />
                <EditButton adOwnerId={adOwnerId} onPress={props.onEdit} />
              </View>
            </View>
          </SafeAreaView>
        </View>
      </View>
      <View className="flex-1">{children}</View>
    </Animated.ScrollView>
  );
}
