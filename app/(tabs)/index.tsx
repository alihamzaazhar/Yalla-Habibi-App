import ProfileHeader from "@/components/home/ProfileHeader";
import MotorsList from "@/components/motors/MotorsList";
import PropertyList from "@/components/property/PropertyList";
import { Href, Link, router, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { Image, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { TAB_BAR_HEIGHT } from "./_layout";
import ProtectedLink from "@/components/shared/ProtectedLink";
import CouponsList from "@/components/coupons/CouponsList";
import SearchInputPlaceholder from "@/components/shared/SearchInputPlaceholder";
import BorderlessButton from "@/ui/BorderlessButton";
import { PROPERTY_SALE_TYPE_ENUM } from "@/lib/property-ad/schemas";
import RectButton from "@/ui/RectButton";
import { Theme } from "@/constants";
import Feather from "@expo/vector-icons/Feather";
import { addOpacityToHsl } from "@/lib/common/utils";

const Collections = [
  {
    title: "Property for Rent",
    href: "/property/(list)/see-more?selling_mode=rent" as Href<string>,
    List: PropertyList,
    queryParams: {
      selling_mode: "rent" as (typeof PROPERTY_SALE_TYPE_ENUM)[number],
    },
  },
  {
    title: "Property for Sale",
    href: "/property/(list)/see-more?selling_mode=sale" as Href<string>,
    List: PropertyList,
    queryParams: {
      selling_mode: "sale" as (typeof PROPERTY_SALE_TYPE_ENUM)[number],
    },
  },
  {
    title: "Nearby Motor Ads",
    href: "/motor-ad/(list)/filters/filter-vehicle-type" as Href<string>,
    List: MotorsList,
  },
  {
    title: "Latest Coupon Ads",
    href: "/coupon-ad/see-more?title=Latest%20Coupon%20Ads" as Href<string>,
    List: CouponsList,
  },
];

export default function Index() {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => <ProfileHeader />,
    });
  }, []);
  return (
    <ScrollView
      contentContainerClassName="gap-8 pt-8 bg-[#f9fafb]"
      style={{ marginBottom: TAB_BAR_HEIGHT }}
    >
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="py-2 gap-2"
          contentContainerStyle={{ paddingLeft: 15, paddingRight: 15 }}
        >
          <RectButton
            className="items-center justify-center"
            ButtonProps={{
              style: {
                backgroundColor: Theme.card.DEFAULT,
                borderRadius: 12,
                borderWidth: 1,
                alignContent: "center",
                justifyContent: "center",
                paddingVertical: 14,
                width: 100,
                borderColor: Theme.slate[200],
              },
            }}
            onPress={() =>
              router.navigate("/property/see-more?title=All%20Property%20Ads")
            }
          >
            <Image
              source={require("@/assets/images/Property-Icon.png")}
              style={{ width: 40, height: 40 }}
            />
            <Text className="text-sm font-medium text-slate-500 -mt-1">
              Property
            </Text>
          </RectButton>

          <RectButton
            className="items-center justify-center"
            ButtonProps={{
              style: {
                backgroundColor: Theme.card.DEFAULT,
                borderRadius: 12,
                borderWidth: 1,
                paddingVertical: 14,
                alignContent: "center",
                justifyContent: "center",
                width: 100,
                borderColor: Theme.slate[200],
              },
            }}
            onPress={() =>
              router.navigate("/motor-ad/(list)/filters/filter-vehicle-type")
            }
          >
            <Image
              source={require("@/assets/images/Motors-Icon.png")}
              style={{ width: 40, height: 40 }}
            />
            <Text className="text-sm font-medium text-slate-500 -mt-1">
              Motors
            </Text>
          </RectButton>

          <ProtectedLink href="/(rental)/(tabs)/rent" asChild>
            <RectButton
              className="items-center justify-center"
              ButtonProps={{
                style: {
                  backgroundColor: Theme.card.DEFAULT,
                  borderRadius: 12,
                  borderWidth: 1,
                  paddingVertical: 14,
                  alignContent: "center",
                  justifyContent: "center",
                  width: 100,
                  borderColor: Theme.slate[200],
                },
              }}
            >
              <Image
                source={require("@/assets/images/Management-Icon.png")}
                style={{ width: 36, height: 36 }}
              />
              <View className="items-center mt-2">
                <Text className="text-sm font-medium text-slate-500">
                  Property
                </Text>
                <Text className="text-sm font-medium text-slate-500 -mt-1">
                  Management
                </Text>
              </View>
            </RectButton>
          </ProtectedLink>
          <RectButton
            className="items-center justify-center"
            ButtonProps={{
              style: {
                backgroundColor: Theme.card.DEFAULT,
                borderRadius: 12,
                borderWidth: 1,
                paddingVertical: 14,
                alignContent: "center",
                justifyContent: "center",
                width: 100,
                borderColor: Theme.slate[200],
              },
            }}
            onPress={() =>
              router.navigate("/coupon-ad/see-more?title=All%20Coupon%20Ads")
            }
          >
            <Image
              source={require("@/assets/images/Coupons-Icon.png")}
              style={{ width: 40, height: 40 }}
            />
            <Text className="text-sm font-medium text-slate-500">Coupons</Text>
          </RectButton>
        </ScrollView>
      </View>
      <View className="px-5">
        <Link href="/search" asChild>
          <SearchInputPlaceholder placeholder="Search Properties, Motors and Coupons" />
        </Link>
      </View>
      {Collections.map(({ title, queryParams, href, List }) => (
        <View key={title}>
          <View className="flex-row justify-between items-center px-4">
            <Text className="text-xl font-semibold">{title}</Text>
            <Link
              href={{
                //@ts-ignore
                pathname: href as Href<string>,
                params: queryParams,
              }}
              asChild
            >
              <BorderlessButton
                className="flex-row items-center gap-1"
                ButtonProps={{
                  rippleColor: addOpacityToHsl(
                    Theme.colors.primary.DEFAULT,
                    0.1
                  ),
                }}
              >
                <Text className="text-primary font-bold mb-1">See More</Text>
                <Feather
                  name="arrow-right"
                  size={18}
                  color={`${Theme.primary.DEFAULT}`}
                />
              </BorderlessButton>
            </Link>
          </View>
          <List {...queryParams} />
        </View>
      ))}
    </ScrollView>
  );
}
