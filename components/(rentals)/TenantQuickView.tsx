import { useGetMyBookings } from "@/api/hooks/vendor/me/queries";
import { Theme } from "@/constants";
import { formatPrice } from "@/lib/common/prices";
import { cn, humanizeString } from "@/lib/common/utils";
import React from "react";
import { Dimensions, Text } from "react-native";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type Props = {};
const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
const TenantQuickView = () => {
  const { data, status } = useGetMyBookings({
    is_active: true,
  });
  const currentMonth = new Date().getMonth();
  const currentDate = new Date().getDate();
  const currentMonthName =
    currentMonth < MONTHS.length
      ? MONTHS[currentMonth]
      : MONTHS[MONTHS.length - 1];
  if (status === "loading") return <Text>Loading...</Text>;
  if (status === "error") return <Text>Error...</Text>;
  if (!data) return null;
  if (!data.bookings[0]) return null;

  return (
    <View>
      <ScrollView
        horizontal
        contentContainerClassName="pl-4 pr-4 py-2 gap-4"
        showsHorizontalScrollIndicator={false}
      >
        {data.bookings.map((currentBooking, idx) => {
          const hasDue = currentBooking.current_due ?? 0 > 0;
          return (
            <View
              key={idx}
              className="px-4 py-5 bg-slate-100 rounded-md shadow-md flex-row items-center gap-4"
              style={{
                width: Dimensions.get("window").width * 0.9,
              }}
            >
              <View className="flex-col items-center">
                <View className="bg-white rounded-md p-4 flex-col items-center">
                  <Text className="text-gray-600 text-4xl font-bold">
                    {currentDate}
                  </Text>
                  <Text className="text-gray-400 font-bold">
                    {currentMonthName}
                  </Text>
                </View>
              </View>
              <View className="flex-col gap-3 flex-1 w-full">
                <View>
                  <Text className="text-xs text-gray-400 font-bold">
                    Current Rental
                  </Text>
                  <View className="flex-row gap-2 items-center">
                    <Text
                      className="text-gray-600 text-xl font-bold"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {currentBooking.property.title}
                    </Text>
                  </View>
                  <View
                    className={`flex-row self-start rounded-md px-2 py-1 gap-1`}
                    style={{
                      backgroundColor: hasDue
                        ? Theme.red[200]
                        : Theme.green[200],
                    }}
                  >
                    <Text
                      className={cn(
                        `text-xs`,
                        hasDue ? "text-red-600" : "text-green-500"
                      )}
                    >
                      Due:
                    </Text>
                    <Text
                      className={cn(
                        `text-xs font-bold`,
                        hasDue ? "text-red-600" : "text-green-500"
                      )}
                    >
                      {formatPrice({
                        amount: currentBooking.current_due ?? 0,
                        currency_code: "aed",
                      })}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-end justify-between">
                  <View className="flex-col gap-1">
                    <Text className="text-xs text-gray-500">Type</Text>
                    <Text className="text-gray-600 font-semibold">
                      {humanizeString(currentBooking.variants[0].metadata.type)}
                    </Text>
                  </View>
                  <View className="flex-col gap-1">
                    <Text className="text-xs text-gray-500">Apartment</Text>
                    <Text className="text-gray-600 font-semibold">
                      {currentBooking.property.apartment}
                    </Text>
                  </View>
                  <View className="flex-col gap-1">
                    <Text className="text-xs text-gray-500">Floor</Text>
                    <Text className="text-gray-600 font-semibold">
                      {currentBooking.property.floor}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default TenantQuickView;
