import { useRentalTenant } from "@/api/hooks/rental-properties/queries";
import EndOfContractButton from "@/components/(rentals)/EndOfContractButton";
import WithFormHeaderLayout from "@/components/layouts/(rental)/WithFormHeaderLayout";
import NoHeaderLayout from "@/components/layouts/NoHeaderLayout";
import BackIcon from "@/components/shared/BackIcon";
import { Theme } from "@/constants";
import colors from "@/constants/colors";
import { formatPrice } from "@/lib/common/prices";
import { addOpacityToHsl } from "@/lib/common/utils";
import { useRefreshOnFocus } from "@/lib/hooks/useRefreshOnFocus";
import { Avatar, AvatarFallback } from "@/ui/Avatar";
import BaseButton from "@/ui/BaseButton";
import BorderlessButton from "@/ui/BorderlessButton";
import { Button } from "@/ui/Button";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { formatDate, isAfter, isBefore } from "date-fns";
import { Link } from "expo-router";
import { useGlobalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const TenantScreen = () => {
  const { id } = useGlobalSearchParams();
  const router = useRouter();
  const { data, status, refetch } = useRentalTenant(id as string);
  useRefreshOnFocus(refetch);
  if (status === "loading") return <Loading />;
  if (status === "error") return <Error />;
  const booking = data.booking;
  const Details = [
    { label: "Apartment", value: booking.property.apartment },
    { label: "Floor", value: booking.property.floor },
    { label: "Building", value: booking.property.building.name },
    { label: "Total Keys", value: booking.keys_count },
    { label: "Total Kids", value: booking.kids_count },
    { label: "Total Tenants", value: booking.tenants_count },
  ];
  const FinanceDetails = [
    {
      label: "Due Payment",
      value: formatPrice({
        amount: booking.current_due ?? 0,
        currency_code: "aed",
      }),
    },
    {
      label: "Last Payment On",
      value: booking.current_due_updated_at
        ? formatDate(booking.current_due_updated_at, "dd MMM yyyy")
        : "-",
    },
    {
      label: "Deposit",
      value: formatPrice({
        amount: booking.deposit ?? 0,
        currency_code: "aed",
      }),
    },
  ];
  return (
    <NoHeaderLayout>
      <SafeAreaView className="bg-white">
        <View className="bg-white border-b border-gray-200">
          <View className="flex-row justify-between px-4 py-3 items-center">
            <View>
              <BackIcon />
            </View>
            <Link
              href={{
                pathname: `/(rental)/tenant/[id]/edit/edit-basic-details`,
                params: {
                  id: data.booking.id,
                },
              }}
              asChild
            >
              <BorderlessButton className="rounded-full bg-white">
                <Feather name="edit" size={18} color={Theme.slate[500]} />
              </BorderlessButton>
            </Link>
          </View>
          <View className="items-center justify-center gap-8 pb-12">
            <View className="gap-2 items-center">
              <Avatar className="h-20 w-20">
                <AvatarFallback textClassname="text-2xl">
                  {data.booking.tenant.name.charAt(0).toLocaleUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Text className="capitalize text-2xl font-medium">
                {data.booking.tenant.name}
              </Text>
            </View>
            <View className="gap-4 items-center flex-col">
              <View className="flex-row items-center gap-2">
                <FontAwesome
                  name="envelope"
                  size={20}
                  color={Theme.gray[400]}
                />
                <Text className="text-md font-medium text-gray-400">
                  {data.booking.tenant.email}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <FontAwesome name="phone" size={20} color={Theme.gray[400]} />
                <Text className="text-md font-medium text-gray-400">
                  {data.booking.tenant.phone}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
      <ScrollView
        contentContainerClassName="gap-4"
        className="px-4 gap-4 py-8 bg-background"
      >
        <View className="bg-card rounded-md border border-border py-3 px-1.5 w-full flex flex-row flex-wrap">
          {Details.map((i) => (
            <View
              className="flex-row justify-between items-center px-4 py-2"
              style={{ width: "50%" }}
              key={i.label}
            >
              <Text
                className="text-md font-medium text-gray-400 flex-1"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {i.label}
              </Text>
              <Text
                className="text-md font-medium text-gray-500 flex-1"
                style={{
                  textAlign: "right",
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {i.value}
              </Text>
            </View>
          ))}
        </View>
        <View className="bg-card rounded-md border border-border py-3 px-1.5 w-full flex flex-row flex-wrap">
          {FinanceDetails.map((i) => (
            <View
              className="flex-col px-4 py-2"
              key={i.label}
              style={{ width: "50%" }}
            >
              <Text
                className="text-md font-medium text-gray-400"
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {i.label}
              </Text>
              <Text
                className="text-md font-medium text-gray-500"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {i.value}
              </Text>
            </View>
          ))}
        </View>
        {booking.contract_starts_at ? (
          <View className="flex-row justify-between py-4 px-4 bg-white border border-gray-200 rounded-md">
            <View>
              <Text className="font-medium text-md text-gray-400">
                {"Booking"}
              </Text>
              <View className="gap-2 flex-row items-center">
                <Text className="font-medium text-lg text-gray-600">
                  {formatDate(
                    new Date(booking.contract_starts_at),
                    "dd MMM yyyy"
                  )}
                </Text>
                <Text>-</Text>
                <Text className="font-medium text-lg text-gray-600">
                  {booking.contract_ends_at
                    ? formatDate(new Date(booking.contract_ends_at), "MMM yyyy")
                    : "Ongoing"}
                </Text>
              </View>
            </View>
            {!booking.contract_ends_at ? (
              <View className="self-center">
                <EndOfContractButton booking_id={booking.id} />
              </View>
            ) : null}
          </View>
        ) : null}
        <View className="w-full" style={{ height: 170 }} />
      </ScrollView>
      <View className="absolute bottom-0 p-8 w-full flex items-end gap-3 bg-background">
        <BorderlessButton
          ButtonProps={{
            style: {
              width: "100%",
              alignItems: "center",
            },
          }}
          onPress={() => {
            router.navigate({
              pathname: `/(rental)/tenant/[id]/all-payments`,
              params: {
                id: data.booking.id,
              },
            });
          }}
        >
          <Text className="text-lg text-gray-400">
            {"View Payment History"}
          </Text>
        </BorderlessButton>
        <BaseButton
          ButtonProps={{
            style: {
              backgroundColor: !booking.is_active
                ? Theme.gray[300]
                : Theme.primary.DEFAULT,
              overflow: "hidden",
              borderRadius: 8,
              width: "100%",
            },
            rippleColor: addOpacityToHsl(colors.primary.DEFAULT, 0.3),
          }}
          disabled={
            !(
              booking.is_active &&
              typeof booking.contract_starts_at === "string" &&
              isBefore(booking.contract_starts_at, new Date())
            )
          }
          onPress={() => {
            router.navigate({
              pathname: `/(rental)/tenant/[id]/add-rent`,
              params: {
                id: data.booking.id,
              },
            });
          }}
          className="flex items-center justify-center px-8 py-3 rounded-md h-auto w-full"
        >
          <Text className="text-white text-xl font-medium">{"Add Rent"}</Text>
        </BaseButton>
      </View>
    </NoHeaderLayout>
  );
};

const Loading = () => {
  return (
    <NoHeaderLayout>
      <View className="gap-y-4 px-4 flex-1 items-center justify-center">
        <ActivityIndicator size={"large"} color={Theme.gray[600]} />
      </View>
    </NoHeaderLayout>
  );
};
const Error = () => {
  return (
    <NoHeaderLayout>
      <Text>Error</Text>
    </NoHeaderLayout>
  );
};

export default TenantScreen;
