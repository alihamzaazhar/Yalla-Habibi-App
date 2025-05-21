import TruncatedText from "@/components/shared/TruncatedText";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { differenceInTime } from "@/lib/common/date-functions";
import { Avatar, AvatarFallback } from "@/ui/Avatar";
import { formatDate } from "date-fns";
import { formatPrice } from "@/lib/common/prices";
import { useCouponAd } from "@/api/hooks/marketplace/services/coupons/queries";
import { humanizeString } from "@/lib/common/utils";
import { useDigitalCart } from "@/api/hooks/cart/mutations";
import AdParallexScrollLayout from "@/components/shared/AdParallexScrollLayout";
import RectButton from "@/ui/RectButton";
import { Theme } from "@/constants";
import BaseButton from "@/ui/BaseButton";
import DetailScreenSkeleton from "@/components/shared/skeletons/DetailScreenSkeleton";
import { useVendorMe } from "@/api/hooks/vendor/me/queries";
import { Suspense, lazy } from "react";
const CouponsList = lazy(
  () => import("../../../components/coupons/CouponsList")
);

export default function CouponAdDetailScreen() {
  const { id } = useGlobalSearchParams();
  const { data: data_, status } = useCouponAd(id as string);
  const { data: userData } = useVendorMe();
  const router = useRouter();
  const { mutate: createDigitalCart, status: digitalCartStatus } =
    useDigitalCart();
  if (status === "loading") {
    return <DetailScreenSkeleton />;
  }
  if (status === "error") {
    return <Text>Something went wrong</Text>;
  }
  const data = data_.couponAd;
  return (
    <View className="flex-1 bg-background">
      <AdParallexScrollLayout
        id={data.id}
        adOwnerId={data.owner.id}
        thumbnail={data.thumbnail}
        className="pb-24 relative"
        onImageTapped={(index) => {
          router.navigate({
            pathname: "/coupon-ad/[id]/gallery",
            params: {
              id: data.id,
            },
          });
        }}
        onEdit={() => {
          router.navigate({
            pathname: "/coupon-ad/[id]/edit/edit-coupon-collection",
            params: {
              id: data.id,
            },
          });
        }}
        headerImages={data.images?.map((i) => i.url as string)}
        favouriteButton={{
          id: data.id,
          type: "coupon_ad",
          isFavourite: data.is_favourite,
        }}
      >
        <View className="px-4 py-5 gap-8 bg-background flex-1">
          <View className="gap-y-3">
            <View className="flex-row justify-between items-start">
              <Text className="text-sm text-muted-foreground">
                {humanizeString(data.collection.title)}
              </Text>
              <Text className={`text-sm text-muted-foreground capitalize`}>
                {`${differenceInTime(new Date(), new Date(data.created_at))}`}
              </Text>
            </View>
            <View className="gap-y-1">
              <View>
                <Text className="text-3xl font-medium">{data.title}</Text>
              </View>
              <View className="gap-2 flex-row items-center">
                <Text
                  className={`font-medium text-primary`}
                  style={{ fontSize: 16 }}
                >
                  {formatPrice({
                    amount: data.variants[0].prices[0]?.amount,
                    currency_code: "aed",
                  })}
                </Text>
                <Text
                  className="text-gray-400 line-through"
                  style={{ fontSize: 16 }}
                >
                  {formatPrice({
                    amount: data.variants[0].prices[0].discount.value,
                    currency_code: "aed",
                  })}
                </Text>
              </View>
            </View>
          </View>
          <View className="gap-y-2">
            <Text className="text-xl font-medium">Description</Text>
            <TruncatedText>{`${data.description}`}</TruncatedText>
          </View>
          <RectButton
            onPress={() => {
              router.navigate(`/profile-public/${data.owner.id}`);
            }}
            ButtonProps={{
              rippleColor: Theme.slate[100],
              style: {
                backgroundColor: Theme.card.DEFAULT,
              },
            }}
            className="px-4 py-4 flex-row rounded-md border border-border gap-4 items-center"
          >
            <Avatar>
              <AvatarFallback>
                {data.owner.first_name.charAt(0) +
                  data.owner.last_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <View>
              <Text className="font-medium text-lg">
                {data.owner.first_name + " " + data.owner.last_name}
              </Text>
              <Text className="text-xs font-medium text-gray-400">
                {`Member since ${formatDate(
                  data.owner.created_at,
                  "MMM yyyy"
                )}`}
              </Text>
            </View>
          </RectButton>
        </View>
        <Suspense fallback={null}>
          <View className="flex-1 py-4 bg-background">
            <Text className="text-xl font-semibold px-4">{"Similar Ads"}</Text>
            <CouponsList
              collection_id={data.collection.id}
              exceptIds={[data.id]}
            />
          </View>
        </Suspense>
      </AdParallexScrollLayout>
      <Animated.View
        className={
          "flex-row gap-6 absolute bottom-0 px-4 py-6 border-t border-border items-center justify-center bg-card w-full"
        }
      >
        <BaseButton
          ButtonProps={{
            style: {
              backgroundColor: Theme.green[200],
              borderRadius: 8,
              flex: 1,
            },
          }}
          loadingClassName="bg-green-600"
          className="bg-transparent items-center w-full flex-1"
          isLoading={digitalCartStatus === "loading"}
          onPress={() =>
            createDigitalCart(
              {
                variant_id: data_.couponAd.variants[0].id,
                email: userData?.user.email ?? "random@email.com",
              },
              {
                onSuccess: ({ cart: { id } }) => {
                  router.navigate(`/cart/${id}`);
                },
              }
            )
          }
        >
          <Text
            style={{ color: "hsl(140,100%,32%)" }}
            className="font-medium text-xl"
          >
            {"Buy Now"}
          </Text>
        </BaseButton>
      </Animated.View>
    </View>
  );
}
