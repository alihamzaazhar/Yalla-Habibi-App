import { globalStyles } from "@/constants";
import { formatPrice } from "@/lib/common/prices";
import { cn } from "@/lib/common/utils";
import React from "react";
import { Text, Pressable, View } from "react-native";

type Props = {
  title: string;
  price: number;
  points: Array<string>;
  onPress: () => void;
  isSelected?: boolean;
};

const VariantSelectCard = ({
  onPress,
  points,
  price,
  title,
  isSelected,
}: Props) => {
  return (
    <Pressable onPress={onPress}>
      <View
        className={cn(
          "px-6 pt-5 pb-8 rounded-md gap-6",
          isSelected ? "bg-blue-500" : "bg-white"
        )}
        style={[
          {
            minHeight: 120,
          },
          globalStyles.shadowSm,
        ]}
      >
        <View className="flex-row items-start justify-between gap-4">
          <Text
            className={cn(
              "font-semibold text-xl flex-1",
              isSelected ? "text-white" : "text-foreground"
            )}
          >
            {title}
          </Text>
          <Text
            className={cn(
              "font-semibold text-xl",
              isSelected ? "text-white" : "text-foreground"
            )}
          >
            {formatPrice({
              amount: price,
              currency_code: "aed",
            })}
          </Text>
        </View>
        <View className="gap-1">
          {points.map((p, idx) => (
            <Text
              key={idx}
              className={isSelected ? "text-gray-200" : "text-gray-400"}
            >
              - {p}
            </Text>
          ))}
        </View>
      </View>
    </Pressable>
  );
};

export default VariantSelectCard;
