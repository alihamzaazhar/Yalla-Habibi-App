import { Theme } from "@/constants";
import { Skeleton } from "@/ui/Skeleton";
import React from "react";
import { Text } from "react-native";
import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import RectButton from "@/ui/RectButton";
import { useMotorsCategories } from "@/api/hooks/marketplace/services/motors/queries";


interface Props {
    onSelect:(id:string) => void
}
const SelectRootCategory = ({onSelect}:Props) => {
  const { status, data } = useMotorsCategories({ root_only: true });
  if (status === "loading") return <Loading />;
  if (status === "error") return <Error />;
  if (!data) return <NoDataFound />;

  return (
    <PlaceAdLayout title="Select an ad">
      <View className="flex-row flex-wrap p-8 gap-4 flex-1">
        {data.motorAdsCategories.map((o) => (
          <ServiceLink
            title={o.name}
            icon={
              <Ionicons
                name="car"
                color={`hsl(${Theme.colors.primary.DEFAULT})`}
                size={60}
              />
            }
            onPress={() => {
                onSelect(o.id);
            }}
          />
        ))}
      </View>
    </PlaceAdLayout>
  );
};

const ServiceLink = (props: {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
}) => {
  return (
    <RectButton
      ButtonProps={{
        style: {
          paddingVertical: 24,
          paddingHorizontal: 16,
          borderRadius: 24,
          width: "47%",
          backgroundColor: Theme.card.DEFAULT,
        },
        rippleColor: Theme.slate[200],
      }}
      style={{ alignItems: "center", gap: 12 }}
      onPress={props.onPress}
    >
      {props.icon}
      <Text className="text-center text-slate-500 font-medium break-words">
        {props.title}
      </Text>
    </RectButton>
  );
};

const Loading = () => {
  return (
    <PlaceAdLayout title="Select an ad">
      <View className="flex-row flex-wrap p-8 gap-4 flex-1">
        <Skeleton
          className="rounded-md"
          style={{ height: 140, width: "47%" }}
        />
        <Skeleton
          className="rounded-md"
          style={{ height: 140, width: "47%" }}
        />
        <Skeleton
          className="rounded-md"
          style={{ height: 140, width: "47%" }}
        />
        <Skeleton
          className="rounded-md"
          style={{ height: 140, width: "47%" }}
        />
      </View>
    </PlaceAdLayout>
  );
};

const Error = () => {
  return (
    <PlaceAdLayout title="Select an ad">
      <Text>Error</Text>
    </PlaceAdLayout>
  );
};

const NoDataFound = () => {
  return (
    <PlaceAdLayout title="Select an ad">
      <Text>No data...</Text>
    </PlaceAdLayout>
  );
};

export default SelectRootCategory;
