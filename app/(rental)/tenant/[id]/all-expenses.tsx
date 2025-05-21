import {
  useRentalTenant,
  useRentalTenantExpenses,
  useRentalTenantPayments,
} from "@/api/hooks/rental-properties/queries";
import StackScreenWithTitleLayout from "@/components/layouts/StackScreenWithTitleLayout";
import { Theme } from "@/constants";
import { formatPrice } from "@/lib/common/prices";
import { formatDate } from "date-fns";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

const AllExpensesScreen = () => {
  const id = useLocalSearchParams().id as string;
  const { data: booking, status: bookingStatus } = useRentalTenant(id);
  const { data, status, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useRentalTenantExpenses({
      rental_property_booking_id: id,
    });
  if (status === "loading" || bookingStatus === "loading")
    return (
      <StackScreenWithTitleLayout title="All Expenses">
        <View className="items-center justify-center gap-4 flex-1">
          <ActivityIndicator size={"large"} color={Theme.gray[600]} />
        </View>
      </StackScreenWithTitleLayout>
    );
  if (status === "error" || bookingStatus === "error")
    return <Text>Error...</Text>;

  const allPayments = data.pages.map((p) => p.expenses).flat();
  return (
    <StackScreenWithTitleLayout title="All Expenses">
      <FlatList
        data={allPayments}
        onEndReachedThreshold={0.5}
        onEndReached={() => (hasNextPage ? fetchNextPage() : null)}
        ListFooterComponent={
          <View style={{ marginBottom: 60 }}>
            {isFetchingNextPage ? <ActivityIndicator size={"small"} /> : null}
          </View>
        }
        renderItem={({ item: payment, index }) => (
          <View
            className="flex-row justify-between items-start p-4 border-b border-gray-200"
            key={index}
          >
            <View>
              <Text className="text-slate-800 text-sm">{payment.title}</Text>
              <Text className="text-xs text-slate-400">
                {formatDate(payment.created_at, "MMM yyyy hh:mm a")}
              </Text>
            </View>
            <Text className="font-medium">
              {formatPrice({
                amount: payment.amount,
                currency_code: "aed",
              })}
            </Text>
          </View>
        )}
      />
      <View className="border-t border-dashed">
        <View className="flex flex-row items-center justify-between px-4 pt-4 pb-8">
          <Text className="text-md">{"Total Expenses"}</Text>
          <Text className="text-xl font-semibold text-gray-800">
            {formatPrice({
              amount: booking.booking.totalExpenses,
              currency_code: "aed",
            })}
          </Text>
        </View>
      </View>
    </StackScreenWithTitleLayout>
  );
};

export default AllExpensesScreen;
