import {
  VendorRentalPropertyBookingsAnalyticsGetReq,
  useRentalPropertyBookingsAnalytics,
} from "@/api/hooks/bookings/queries";
import { Theme, globalStyles } from "@/constants";
import { formatPrice } from "@/lib/common/prices";
import { Skeleton } from "@/ui/Skeleton";
import React from "react";
import { Text, View } from "react-native";

type Props = VendorRentalPropertyBookingsAnalyticsGetReq;

const RevenueAnalytics = (props: Props) => {
  const { data, status } = useRentalPropertyBookingsAnalytics(props);
  if (status === "loading") return <RevenueAnalyticsSkeleton />;
  if (status === "error") return <Text>Error...</Text>;

  return (
    <View
      className="items-center justify-center gap-4 relative rounded-md overflow-hidden border border-orange-200"
      style={[
        { backgroundColor: Theme.orange[100], flex: 1, height: 120 },
        globalStyles.shadowSm,
      ]}
    >
      <View className="absolute" style={{ top: 8, left: 8 }}>
        <Text
          className="text-md font-bold"
          style={{ color: Theme.orange[500] }}
        >
          Revenue
        </Text>
      </View>
      <View>
        <Text
          className="text-2xl font-bold"
          style={{ color: Theme.orange[600] }}
        >
          {formatPrice({
            amount: data.analytics.paymentsTotal,
            currency_code: "aed",
          })}
        </Text>
      </View>
    </View>
  );
};

const RevenueAnalyticsSkeleton = () => {
  return (
    <View
      className="items-center justify-center gap-4 relative rounded-md overflow-hidden border border-orange-200"
      style={[
        { backgroundColor: Theme.orange[100], flex: 1, height: 120 },
        globalStyles.shadowSm,
      ]}
    >
      <View className="absolute" style={{ top: 8, left: 8 }}>
        <Skeleton
          style={{ height: 12, width: 60, backgroundColor: Theme.orange[200] }}
        />
      </View>
      <View>
        <Skeleton
          style={{ height: 20, width: 100, backgroundColor: Theme.orange[200] }}
        />
      </View>
    </View>
  );
};
export default RevenueAnalytics;
