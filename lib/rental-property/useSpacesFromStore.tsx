import { SpaceType } from "@/components/(rentals)/property/forms/space-types-form";
import { useState } from "react";
import { useRentalPropertyStoreContext } from "./property/rental-property-store-context";
import isEqual from "lodash.isequal";
const useSpacesFromStore = () => {
  const store = useRentalPropertyStoreContext((state) => state.data);
  const roomVariants =
    store?.variants
      ?.filter(
        (v) => !v.variant_parent_id && v.bookings?.every((e) => !e.is_active)
      )
      .map((v) => ({
        id: v.id!,
        name: v.title,
        rent_per_month: v.price,
        parent: v.variant_parent_id ?? "null",
      })) ?? [];
  const partitionVariants =
    store?.variants
      ?.filter(
        (v) =>
          v.variant_parent_id &&
          roomVariants?.map((v) => v.id).includes(v.variant_parent_id) &&
          v.bookings?.every((e) => !e.is_active)
      )
      .map((v) => ({
        id: v.id!,
        name: v.title,
        rent_per_month: v.price,
        parent: v.variant_parent_id ?? "null",
      })) ?? [];
  const bedVariants =
    store?.variants
      ?.filter(
        (v) =>
          v.variant_parent_id &&
          partitionVariants?.map((v) => v.id).includes(v.variant_parent_id) &&
          v.bookings?.every((e) => !e.is_active)
      )
      .map((v) => ({
        id: v.id!,
        name: v.title,
        rent_per_month: v.price,
        parent: v.variant_parent_id ?? "null",
      })) ?? [];
  const [rooms, setRooms] = useState<Array<SpaceType>>(roomVariants);
  const [partitions, setPartitions] =
    useState<Array<SpaceType>>(partitionVariants);
  const [beds, setBeds] = useState<Array<SpaceType>>(bedVariants);

  const isDirty =
    !isEqual(rooms, roomVariants) ||
    !isEqual(partitions, partitionVariants) ||
    !isEqual(beds, bedVariants);
  return {
    rooms,
    partitions,
    beds,
    setRooms,
    setBeds,
    setPartitions,
    isDirty,
  };
};

export default useSpacesFromStore;
