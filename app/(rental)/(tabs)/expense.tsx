import {
  RentalTenantBooking,
  RentalTenantListParams,
  UseRentalTenantsData,
  useRentalTenants,
} from "@/api/hooks/rental-properties/queries";
import BuildingSelectFilterPicker from "@/components/(rentals)/BuildingSelectFilterPicker";
import DepositAnalytics from "@/components/(rentals)/DepositAnalytics";
import ExpensesAnalytics from "@/components/(rentals)/ExpensesAnalytics";
import RentalPropertyCard from "@/components/(rentals)/RentalPropertyCard";
import SavingAnalytics from "@/components/(rentals)/SavingAnalytics";
import WithFormHeaderLayout from "@/components/layouts/(rental)/WithFormHeaderLayout";
import NoHeaderLayout from "@/components/layouts/NoHeaderLayout";
import BackIcon from "@/components/shared/BackIcon";
import Error from "@/components/shared/templates/Error";
import LoadingDefault from "@/components/shared/templates/LoadingDefault";
import NoDataFound from "@/components/shared/templates/NoDataFound";
import { Theme } from "@/constants";
import { useRefreshOnFocus } from "@/lib/hooks/useRefreshOnFocus";
import DateRangeFilter from "@/ui/filters/DateRangeFilter";
import { endOfMonth, startOfMonth } from "date-fns";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, FlatListProps, Text, View } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props
  extends Omit<
    React.ComponentPropsWithoutRef<typeof FlatList<RentalTenantBooking>>,
    "data" | "renderItem"
  > {
  startFrom?: Date;
  endTo?: Date;
  building_id?: string;
}
type Item =
  NonNullable<UseRentalTenantsData>["pages"][number]["bookings"][number];
type RentalPropertySpaceItemProps = Parameters<
  NonNullable<FlatListProps<Item>["renderItem"]>
>[0] & {
  start_from?: Date;
  end_to?: Date;
};

const RentalPropertySpaceItem = ({
  item: booking,
  start_from,
  end_to,
}: RentalPropertySpaceItemProps) => {
  const variantIdsSet = new Set(booking.variants.map((v) => v.id));
  const parentVariant = booking.variants.find(
    (v) => !variantIdsSet.has(v.variant_parent_id)
  );
  if (!parentVariant) return null;
  return (
    <Link
      href={{
        pathname: "/(rental)/tenant/[id]/overview",
        params: {
          id: booking.id,
          title: parentVariant.title,
          ...(start_from ? { start_from: start_from.toUTCString() } : {}),
          ...(end_to ? { end_to: end_to.toUTCString() } : {}),
        },
      }}
      asChild
    >
      <RentalPropertyCard
        className="w-full"
        style={{
          width: "100%",
        }}
        property={{
          title: parentVariant.title,
          floor: booking.property.floor,
          apartment: booking.property.apartment,
          building: booking.property.building.name,
          type: parentVariant.metadata.type,
          variant_id: parentVariant.id,
          current_booking: booking,
          prices: [
            {
              amount: 0,
              currency_code: "aed",
            },
          ],
        }}
      />
    </Link>
  );
};

const RentalPropertyBookingList = ({
  startFrom,
  endTo,
  building_id,
  ...props
}: Props) => {
  const {
    data,
    status,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    fetchNextPage,
  } = useRentalTenants({
    building_id,
    contract_starts_at: startFrom
      ? {
          gte: startFrom,
        }
      : undefined,
    contract_ends_at: endTo
      ? {
          lte: endTo,
        }
      : undefined,
  });
  useRefreshOnFocus(refetch);

  if (status === "loading") return <LoadingDefault />;
  if (status === "error") return <Error />;
  if (data.pages.length === 0) return <NoDataFound />;
  const allRentalTenants = data.pages.map((d) => d.bookings).flat();
  return (
    <View className="flex-1">
      <FlatList
        {...props}
        data={allRentalTenants}
        // contentContainerStyle={{
        //   paddingHorizontal: 16,
        //   paddingTop: 10,
        //   gap: 12,
        // }}
        renderItem={(props) => (
          <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
            <RentalPropertySpaceItem
              end_to={endTo}
              {...props}
              start_from={startFrom}
            />
          </View>
        )}
        onEndReachedThreshold={0.5}
        onEndReached={() => (hasNextPage ? fetchNextPage() : null)}
        ListFooterComponent={
          <View style={{ marginBottom: 20 }}>
            {isFetchingNextPage ? <ActivityIndicator size={"small"} /> : null}
          </View>
        }
      />
    </View>
  );
};

const ExpenseScreen = () => {
  const searchParams = useLocalSearchParams();
  const today = new Date();
  const [startFrom, setStartFrom] = React.useState<Date | undefined>(
    startOfMonth(today)
  );
  const [endTo, setEndTo] = React.useState<Date | undefined>(endOfMonth(today));
  const buildingId = searchParams.buildingId as string | undefined;
  return (
    <NoHeaderLayout>
      <SafeAreaView style={{ backgroundColor: Theme.white }}>
        <View className="px-4 pt-8 pb-6 items-start gap-3">
          <View className="flex-row items-center gap-2">
            <BackIcon />
            <Text className="text-3xl font-semibold text-gray-800">
              {"Expenses"}
            </Text>
          </View>
          <View className="pl-4">
            <DateRangeFilter
              from={startFrom}
              to={endTo}
              onChange={(from, to) => {
                setStartFrom(from);
                setEndTo(to);
              }}
            />
          </View>
        </View>
      </SafeAreaView>

      <RentalPropertyBookingList
        building_id={buildingId}
        startFrom={startFrom}
        endTo={endTo}
        ListHeaderComponent={() => (
          <>
            <View
              className="flex-row items-center gap-2 p-4 bg-white border-t border-b"
              style={{ borderColor: Theme.slate[200] }}
            >
              <BuildingSelectFilterPicker returnPath="/(rental)/expense" />
            </View>
            <View className="py-4">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="py-4 gap-2 px-4"
              >
                <SavingAnalytics
                  building_id={buildingId}
                  contract_starts_at={
                    startFrom
                      ? {
                          gte: startFrom,
                        }
                      : undefined
                  }
                  contract_ends_at={
                    endTo
                      ? {
                          lte: endTo,
                        }
                      : undefined
                  }
                  style={{
                    minWidth: 200,
                    minHeight: 110,
                  }}
                />
                <ExpensesAnalytics
                  building_id={buildingId}
                  contract_starts_at={
                    startFrom
                      ? {
                          gte: startFrom,
                        }
                      : undefined
                  }
                  contract_ends_at={
                    endTo
                      ? {
                          lte: endTo,
                        }
                      : undefined
                  }
                  style={{
                    minWidth: 200,
                    minHeight: 110,
                  }}
                />
                <DepositAnalytics
                  building_id={buildingId}
                  contract_starts_at={
                    startFrom
                      ? {
                          gte: startFrom,
                        }
                      : undefined
                  }
                  contract_ends_at={
                    endTo
                      ? {
                          lte: endTo,
                        }
                      : undefined
                  }
                  style={{
                    minWidth: 200,
                    minHeight: 110,
                  }}
                />
              </ScrollView>
            </View>
          </>
        )}
      />
      <View style={{ height: 40, width: "100%" }} />
    </NoHeaderLayout>
  );
};

export default ExpenseScreen;
