import { useRentalProperties } from "@/api/hooks/rental-properties/queries";
import { FlatListProps } from "react-native";
import RentalPropertyCard from "../RentalPropertyCard";
import { Link } from "expo-router";

type Item = NonNullable<
  ReturnType<typeof useRentalProperties>["data"]
>["pages"][number]["rental_properties"][number];
type RentalPropertySpaceItemProps = Parameters<
  NonNullable<FlatListProps<Item>["renderItem"]>
>[0];

const RentalPropertySpaceItem = ({
  item: propertySpace,
}: RentalPropertySpaceItemProps) => {
  const property = {
    title: propertySpace.property_title,
    floor: propertySpace.floor,
    apartment: propertySpace.apartment,
    building_name: propertySpace.building,
  };
  return (
    <Link href={"/(rental)/tenant"}>
      <RentalPropertyCard
        property={{
          title: property.title,
          floor: property.floor,
          apartment: property.apartment,
          building: property.building_name,
          type: propertySpace.type,
          variant_id: propertySpace.variant_id,
          current_booking: propertySpace.current_booking,
          prices: propertySpace.prices,
        }}
      />
    </Link>
  );
};

export default RentalPropertySpaceItem;
