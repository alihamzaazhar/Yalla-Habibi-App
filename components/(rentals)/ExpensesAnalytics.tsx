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

const ExpensesAnalytics = ({
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
    return <ExpenseAnalyticsSkeleton className={className} style={style} />;
  if (status === "error") return <Text>Error...</Text>;
  if (!data) return <Text>No data...</Text>;
  return (
    <View
      className={cn(
        "relative rounded-md border border-orange-200 overflow-hidden p-4",
        className
      )}
      style={[
        { backgroundColor: Theme.orange[100] },
        globalStyles.shadowSm,
        style,
      ]}
      {...props}
    >
      <View>
        <Text
          className="text-3xl font-bold"
          style={{ color: Theme.orange[600] }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {formatPrice({
            amount: data.analytics.expensesTotal,
            currency_code: "aed",
          })}
        </Text>
      </View>
      <Text className="text-sm font-bold" style={{ color: Theme.orange[500] }}>
        Total Expenses
      </Text>
    </View>
  );
};
const ExpenseAnalyticsSkeleton = ({ className, style }: Props) => {
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
        style={{ height: 20, width: 100, backgroundColor: Theme.orange[200] }}
      />
    </View>
  );
};

export default ExpensesAnalytics;
