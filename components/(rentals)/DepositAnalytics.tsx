import {
  VendorRentalPropertyBookingsAnalyticsGetReq,
  useRentalPropertyBookingsAnalytics,
} from "@/api/hooks/bookings/queries";
import { Theme, globalStyles } from "@/constants";
import { formatPrice } from "@/lib/common/prices";
import { cn } from "@/lib/common/utils";
import { Skeleton } from "@/ui/Skeleton";
import React from "react";
import { Text, View, ViewProps } from "react-native";

type Props = VendorRentalPropertyBookingsAnalyticsGetReq & ViewProps;

const DepositAnalytics = ({
  id,
  building_id,
  contract_starts_at,
  contract_ends_at,
  className,
  style,
  ...props
}: Props) => {
  const { data, status } = useRentalPropertyBookingsAnalytics({
    id,
    building_id,
    contract_starts_at,
    contract_ends_at,
  });

  if (status === "loading")
    return <DepositAnalyticsSkeleton className={className} style={style} />;
  if (status === "error") return <Text>Error...</Text>;
  if (!data) return <Text>No data...</Text>;
  return (
    <View
      className={cn(
        "relative rounded-md border border-blue-200 overflow-hidden p-4",
        className
      )}
      style={[
        { backgroundColor: Theme.blue[100] },
        globalStyles.shadowSm,
        style,
      ]}
      {...props}
    >
      <View>
        <Text
          className="text-3xl font-bold"
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ color: Theme.blue[600] }}
        >
          {formatPrice({
            amount: data.analytics.depositsTotal,
            currency_code: "aed",
          })}
        </Text>
      </View>
      <Text className="text-sm font-bold" style={{ color: Theme.blue[500] }}>
        Total Deposits
      </Text>
    </View>
  );
};

const DepositAnalyticsSkeleton = ({ className, style }: Props) => {
  return (
    <View
      className={cn(
        "relative rounded-md border border-blue-200 overflow-hidden p-4",
        className
      )}
      style={[
        { backgroundColor: Theme.blue[100] },
        globalStyles.shadowSm,
        style,
      ]}
    >
      <Skeleton
        style={{ height: 20, width: 100, backgroundColor: Theme.blue[200] }}
      />
    </View>
  );
};
export default DepositAnalytics;
