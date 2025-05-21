import {
  RentalTenantBooking,
  UseRentalTenantsData,
  useRentalTenants,
} from "@/api/hooks/rental-properties/queries";
import BuildingSelectFilterPicker from "@/components/(rentals)/BuildingSelectFilterPicker";
import RentDueAnalytics from "@/components/(rentals)/RentDueAnalytics";
import RentalPropertyCard from "@/components/(rentals)/RentalPropertyCard";
import RevenueAnalytics from "@/components/(rentals)/RevenueAnalytics";
import NoHeaderLayout from "@/components/layouts/NoHeaderLayout";
import BackIcon from "@/components/shared/BackIcon";
import Error from "@/components/shared/templates/Error";
import LoadingDefault from "@/components/shared/templates/LoadingDefault";
import NoDataFound from "@/components/shared/templates/NoDataFound";
import { Theme, globalStyles } from "@/constants";
import { formatPrice } from "@/lib/common/prices";
import { useRefreshOnFocus } from "@/lib/hooks/useRefreshOnFocus";
import DateRangeFilter from "@/ui/filters/DateRangeFilter";
import { endOfMonth, startOfMonth } from "date-fns";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, FlatListProps, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
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
  building_id,
  startFrom,
  endTo,
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
        renderItem={(props) => (
          <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
            <RentalPropertySpaceItem
              end_to={endTo}
              start_from={startFrom}
              {...props}
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

const RentScreen = () => {
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
              {"Rent"}
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
        ListHeaderComponent={() => {
          return (
            <>
              <View
                className="flex-row items-center gap-2 p-4 bg-white border-t border-b"
                style={{ borderColor: Theme.slate[200] }}
              >
                <BuildingSelectFilterPicker returnPath="/(rental)/rent" />
              </View>
              <View className="gap-3 flex-row px-4 py-6">
                <RevenueAnalytics
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
                />
                <RentDueAnalytics
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
                />
              </View>
            </>
          );
        }}
      />
      <View style={{ height: 40, width: "100%" }} />
    </NoHeaderLayout>
  );
};

export default RentScreen;
