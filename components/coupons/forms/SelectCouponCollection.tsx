import { useCouponAdCollections } from "@/api/hooks/marketplace/services/coupons/queries";
import { Theme, globalStyles } from "@/constants";
import { cn, humanizeString } from "@/lib/common/utils";
import RectButton from "@/ui/RectButton";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

interface Props {
  selectedCollectionId?: string;
  setSelectedCollectionId: (id: string) => void;
  savedCollectionId?: string;
}

const EditCouponCollection = ({
  setSelectedCollectionId,
  savedCollectionId,
  selectedCollectionId,
}: Props) => {
  const { data, status } = useCouponAdCollections();
  if (status === "loading")
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size={"large"} color={Theme.gray[600]} />
      </View>
    );
  if (status === "error") return <Text>Error...</Text>;
  if (!data) return <Text>No data...</Text>;
  return (
    <View className="flex-1 gap-4 px-4 py-6">
      {data.collections.map((type) => (
        <RectButton
          key={type.id}
          onPress={() => {
            setSelectedCollectionId(type.id);
          }}
          ButtonProps={{
            style: [
              {
                backgroundColor: Theme.card.DEFAULT,
                borderRadius: 8,
                overflow: "hidden",
              },
              globalStyles.shadowSm,
            ],
          }}
          className={cn(
            "gap-2 items-center justify-between flex-row bg-white px-5 py-4 rounded-lg",
            savedCollectionId === type.id
              ? "bg-primary"
              : selectedCollectionId === type.id &&
                  "border-2 border-dashed border-gray-400"
          )}
        >
          <Text
            className={cn(
              " text-gray-600",
              savedCollectionId === type.id && "text-white"
            )}
          >
            {humanizeString(type.title)}
          </Text>
        </RectButton>
      ))}
    </View>
  );
};

export default EditCouponCollection;
