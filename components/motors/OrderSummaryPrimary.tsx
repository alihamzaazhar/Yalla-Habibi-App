import React from "react";
import { View, Text } from "react-native";

type Props = {};

const OrderSummaryPrimary = (props: Props) => {
  return (
    <View className="gap-2">
      <Text className="text-2xl font-bold">Thanks for Trusting Us</Text>
      <Text className="text-md">
        We will sell your care at best price in short time, Our team will
        contact with you for more details.
      </Text>
    </View>
  );
};

export default OrderSummaryPrimary;
