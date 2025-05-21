import { useVendorMe } from "@/api/hooks/vendor/me/queries";
import { useVendorProductOrders } from "@/api/hooks/vendor/products/queries";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  id: string;
  owner_id: string;
};

const CouponSoldTag_ = (props: Props) => {
  const { data, status } = useVendorProductOrders(props.id);
  if (status === "loading") return <Text>Loading...</Text>;
  if (status === "error") return <Text>Error...</Text>;
  return (
    <View className="bg-blue-100 rounded-full px-3 py-1,5 items-center justify-center">
      <Text className="font-semibold text-blue-600">
        {data.orders.length} Sold
      </Text>
    </View>
  );
};

const CouponSoldTag = (props: Props) => {
  const { data: userData, status, isFetching } = useVendorMe();
  if (status === "loading") return null;
  if (status === "error") return null;
  if (!userData) return null;
  if (userData?.user.id?.split("__")[0] !== props.owner_id) return null;
  return <CouponSoldTag_ {...props} />;
};

export default CouponSoldTag;
