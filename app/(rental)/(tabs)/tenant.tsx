import {
  RentalTenantListParams,
  useRentalTenants,
} from "@/api/hooks/rental-properties/queries";
import WithHeaderLayout from "@/components/layouts/(rental)/WithHeaderLayout";
import { Theme, globalStyles } from "@/constants";
import { formatPrice } from "@/lib/common/prices";
import { Avatar, AvatarFallback } from "@/ui/Avatar";
import RippleButton from "@/ui/animations/RippleButton";
import Feather from "@expo/vector-icons/Feather";
import { formatDate } from "date-fns";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useRefreshOnFocus } from "@/lib/hooks/useRefreshOnFocus";
import BorderlessButton from "@/ui/BorderlessButton";
import SheetPickerFilter from "@/ui/filters/SheetFilters/SheetPickerFilter";
import BuildingSelectFilterPicker from "@/components/(rentals)/BuildingSelectFilterPicker";
import SearchingInput from "@/components/shared/SearchingInput";

type Props = {
  filters?: RentalTenantListParams;
};
const TenantScreen_ = (props: Props) => {
  const {
    data,
    status,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useRentalTenants(props.filters);
  useRefreshOnFocus(refetch);

  if (status === "loading") return <Loading />;
  if (status === "error") return <Error />;
  if (data.pages.length === 0 || !data.pages[0].bookings.length)
    return <NoDataFound />;

  const allRentalTenants = data.pages.map((d) => d.bookings).flat();

  return (
    <FlatList
      data={allRentalTenants}
      contentContainerStyle={{
        paddingHorizontal: 16,
        gap: 24,
      }}
      renderItem={({ item: booking, index: idx }) => {
        const parentProperty = booking.property;
        return (
          <View key={idx}>
            <Link
              href={{
                pathname: `/(rental)/tenant/[id]`,
                params: {
                  id: booking.id,
                },
              }}
              asChild
            >
              <RippleButton key={idx} rippleClassName="bg-gray-100">
                <Pressable
                  style={[globalStyles.shadowSm]}
                  className="rounded-lg overflow-hidden bg-white"
                >
                  <View className="flex-row items-center gap-2 border-b border-gray-200 px-4 py-4 flex-1 bg-gray-50 justify-between">
                    <View className="flex-row items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {booking.tenant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <View>
                        <Text className="text-sm font-medium">
                          {booking.tenant.name}
                        </Text>
                      </View>
                    </View>
                    {!booking.contract_ends_at && booking.current_due ? (
                      <View className="px-2 py-1 flex-row">
                        <Text className="font-medium text-md text-green-800">
                          {"Due - "}
                        </Text>
                        <Text className="text-md font-medium text-green-500">
                          {formatPrice({
                            amount: booking.current_due,
                            currency_code: "aed",
                          })}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <View className="flex-row items-center gap-2 px-4 pt-3 pb-4 flex-1 justify-between bg-card">
                    <View className="gap-8 flex-1">
                      <View className="flex-row justify-between flex-1">
                        <View className="gap-2 flex-row items-center">
                          <Text className="font-medium text-sm text-gray-400">
                            {"Building:"}
                          </Text>
                          <Text className="font-medium text-sm text-gray-500">
                            {parentProperty?.building?.name}
                          </Text>
                        </View>
                        <View className="gap-2 flex-row items-center">
                          <Text className="font-medium text-sm text-gray-400">
                            {"Apartment:"}
                          </Text>
                          <Text className="font-medium text-sm text-gray-500">
                            {parentProperty?.apartment}
                          </Text>
                        </View>
                        <View className="gap-2 flex-row items-center">
                          <Text className="font-medium text-sm text-gray-400">
                            {"Floor:"}
                          </Text>
                          <Text className="font-medium text-sm text-gray-500">
                            {parentProperty?.floor}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row justify-between flex-1">
                        {booking.contract_starts_at ? (
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
                                  ? formatDate(
                                      new Date(booking.contract_ends_at),
                                      "MMM yyyy"
                                    )
                                  : "Ongoing"}
                              </Text>
                            </View>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  </View>
                </Pressable>
              </RippleButton>
            </Link>
          </View>
        );
      }}
      onEndReachedThreshold={0.5}
      onEndReached={() => (hasNextPage ? fetchNextPage() : null)}
      ListFooterComponent={
        <View style={{ marginBottom: 60 }}>
          {isFetchingNextPage ? <ActivityIndicator size={"small"} /> : null}
        </View>
      }
    />
  );
};

const TenantScreen = () => {
  const { buildingId } = useLocalSearchParams();
  const [filters, setFilters_] = useState<RentalTenantListParams | undefined>({
    order: "-created_at",
  });
  const setFilters = (filters: RentalTenantListParams) => {
    setFilters_((prev) => ({ ...prev, ...filters }));
  };
  return (
    <WithHeaderLayout
      title="Tenants"
      className="bg-gray-100 flex-1"
      headerIconHref="/(rental)/tenant/create"
    >
      <View style={{ paddingBottom: 10, paddingTop: 20 }}>
        <SearchingInput
          afterDebounce={(value) =>
            setFilters({ q: value.length > 1 ? value : undefined })
          }
          placeholder="Search by name, email or phone"
        />
        <View className="flex-row gap-1 p-4">
          <BuildingSelectFilterPicker returnPath="/(rental)/tenant" />
          <SheetPickerFilter
            label="Is Active"
            value={filters?.is_active}
            options={[
              { label: "All", value: undefined },
              { label: "Active", value: true },
              { label: "Inactive", value: false },
            ]}
            onChange={(s) =>
              setFilters({
                is_active: s,
              })
            }
          />
        </View>
      </View>
      <View className="flex-1">
        <TenantScreen_
          filters={{
            ...filters,
            building_id: buildingId as
              | RentalTenantListParams["building_id"]
              | undefined,
          }}
        />
      </View>
    </WithHeaderLayout>
  );
};

const Loading = () => {
  return (
    <View
      className="flex items-center gap-4 flex-1"
      style={{ marginTop: 80, marginHorizontal: 40 }}
    >
      <ActivityIndicator size={"large"} color={Theme.gray[600]} />
    </View>
  );
};
const Error = () => {
  return (
    <WithHeaderLayout title="Tenants" headerIconHref="/(rental)/tenant/create">
      <Text>Error</Text>
    </WithHeaderLayout>
  );
};

const NoDataFound = () => {
  return (
    <View
      className="flex items-center gap-4 flex-1"
      style={{ marginTop: 80, marginHorizontal: 40 }}
    >
      <View className="gap-2">
        <Text className="text-2xl font-medium text-gray-400 text-center">
          No tenants found
        </Text>
        <Text className="text-md font-medium text-gray-400 text-center">
          Clear your search or add your first tenant using the button below
        </Text>
      </View>
      <View className="gap-2">
        <Link href={"/(rental)/tenant/create"} asChild>
          <BorderlessButton ButtonProps={{ style: { alignSelf: "center" } }}>
            <Feather
              name="plus-circle"
              size={60}
              color={`${Theme.gray[300]}`}
            />
          </BorderlessButton>
        </Link>
      </View>
    </View>
  );
};

export default TenantScreen;
