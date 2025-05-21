import { globalStyles, Theme } from "@/constants";
import { formatPrice } from "@/lib/common/prices";
import { cn, humanizeString } from "@/lib/common/utils";
import { Avatar, AvatarFallback } from "@/ui/Avatar";
import RectButton from "@/ui/RectButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { formatDate } from "date-fns";
import React from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";

type Props = {
  className?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  property: {
    variant_id: string;
    type: string;
    title: string;
    building: string;
    floor: string;
    apartment: string;
    current_booking?: {
      keys_count?: number;
      tenants_count?: number;
      kids_count?: number;
      tenant_id: null | string;
      tenant?: {
        id: string;
        name: string;
        email: string;
        phone: string;
        address: string;
      } | null;
      contract_starts_at: string | null;
      contract_ends_at: string | null;
      is_active?: boolean;
      id: string;
    } | null;
    prices?: Array<{
      currency_code: string;
      amount: number;
    }>;
  };
};

const RentalPropertyCard = React.forwardRef<View, Props>(
  ({ property, style, className, onPress }, ref) => {
    return (
      <RectButton
        style={[globalStyles.shadowSm, style]}
        onPress={onPress}
        ref={ref}
        className={cn("rounded-lg overflow-hidden bg-white w-full", className)}
      >
        <View className="flex-row items-center gap-2 px-4 py-4 justify-between">
          <View>
            <Text className="font-semibold text-xl text-gray-600">
              {humanizeString(property.title)}
            </Text>
            <Text className="font-semibold text-gray-400">
              {humanizeString(property.type)}
            </Text>
          </View>
          <View className="rounded-md px-2 py-1 flex-row items-center gap-1">
            <FontAwesome name="money" color={`${Theme.green[600]}`} size={18} />
            <Text className="text-md font-medium text-green-600">
              {formatPrice({
                amount: property.prices?.[0]?.amount ?? 0,
                currency_code: "aed",
              })}
            </Text>
          </View>
        </View>

        {property.current_booking && property.current_booking.is_active ? (
          <View className="py-4 border-t border-dashed flex-row justify-between px-4">
            <View className="flex-row items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {property.current_booking?.tenant?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <View>
                <Text className="text-sm font-medium">
                  {property.current_booking?.tenant?.name}
                </Text>
                {property.current_booking.contract_starts_at ? (
                  <Text className="text-xs font-medium text-gray-400">
                    {`Booked from: ${formatDate(
                      property.current_booking.contract_starts_at,
                      "dd MMM yyyy"
                    )}`}
                  </Text>
                ) : null}
              </View>
            </View>
            <View className="bg-primary rounded-md px-2 py-1 flex-row items-center gap-1">
              <FontAwesome name="clock-o" color={`white`} size={16} />
              <Text className="text-sm font-medium text-white">Booked</Text>
            </View>
          </View>
        ) : null}
      </RectButton>
    );
  }
);
RentalPropertyCard.displayName = "RentalPropertyCard";

export default RentalPropertyCard;
