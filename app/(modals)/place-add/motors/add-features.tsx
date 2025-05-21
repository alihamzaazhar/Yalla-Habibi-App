import React from "react";
import { useRouter } from "expo-router";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import MotorAdFeaturesForm from "@/components/motors/forms/car-forms/FeaturesForm";
import { useMotorAdStoreContext } from "@/lib/motors-ad/context/motor-ad-store-context";
import { Category } from "@/api/types";
import { MOTOR_CATEGORIES_HANDLES } from "@/lib/motors-ad/constants";
import BikeFeaturesForm from "@/components/motors/forms/bike-forms/BikeFeaturesForm";
import HeavyVehiclesFeaturesForm from "@/components/motors/forms/heavy-vehicle-forms/HeavyVehiclFeaturesForm";
import BoatFeaturesForm from "@/components/motors/forms/boat-forms/BoatFeaturesForm";

const AddFeaturesScreen = () => {
  const savedData = useMotorAdStoreContext((store) => store.data);
  const metadata = useMotorAdStoreContext((store) => store.metadata);
  const setDataToStore = useMotorAdStoreContext(
    (store) => store.actions.updateData
  );
  const router = useRouter();
  const rootCategory =
    typeof savedData?.categories?.[0] === "string"
      ? (metadata?.categories[savedData?.categories?.[0]] as Category)
      : null;

  if (!rootCategory) return null;
  if (
    rootCategory.handle.includes(
      MOTOR_CATEGORIES_HANDLES["motorcycles-motor-ad-categories"]
    )
  ) {
    return (
      <PlaceAdLayout title="Add Motors Details">
        <BikeFeaturesForm
          initalData={
            savedData
              ? {
                  final_drive_system: savedData?.final_drive_system,
                  wheels: savedData?.wheels,
                  engine_size: savedData?.engine_size,
                }
              : undefined
          }
          mode="create"
          onSubmit={(values) => {
            setDataToStore(values);
            router.navigate("/(modals)/place-add/motors/add-images");
          }}
        />
      </PlaceAdLayout>
    );
  } else if (
    rootCategory.handle.includes(
      MOTOR_CATEGORIES_HANDLES["heavy-vehicles-motor-ad-categories"]
    )
  ) {
    return (
      <PlaceAdLayout title="Add Motors Details">
        <HeavyVehiclesFeaturesForm
          initalData={
            savedData
              ? {
                  cylinder_count: savedData?.cylinder_count,
                  transmission_type: savedData?.transmission_type,
                  horsepower: savedData?.horsepower,
                  seats_count: savedData?.seats_count,
                }
              : undefined
          }
          mode="create"
          onSubmit={(values) => {
            setDataToStore(values);
            router.navigate("/(modals)/place-add/motors/add-images");
          }}
        />
      </PlaceAdLayout>
    );
  } else if (
    rootCategory.handle.includes(
      MOTOR_CATEGORIES_HANDLES["boats-motor-ad-categories"]
    )
  ) {
    return (
      <PlaceAdLayout title="Add Motors Details">
        <BoatFeaturesForm
          initalData={
            savedData
              ? {
                  age: savedData?.age,
                  length: savedData?.length,
                  has_warranty: savedData?.has_warranty,
                }
              : undefined
          }
          mode="create"
          onSubmit={(values) => {
            setDataToStore(values);
            router.navigate("/(modals)/place-add/motors/add-images");
          }}
        />
      </PlaceAdLayout>
    );
  }
  return (
    <PlaceAdLayout title="Add Motors Details">
      <MotorAdFeaturesForm
        initalData={
          savedData
            ? {
                body_type: savedData?.body_type,
                drive_system: savedData?.drive_system,
                fuel_type: savedData?.fuel_type,
                has_insurance: savedData?.has_insurance,
                has_warranty: savedData?.has_warranty,
                interior_color: savedData?.interior_color,
                exterior_color: savedData?.exterior_color,
                steering_side: savedData?.steering_side,
                transmission_type: savedData?.transmission_type,
                cylinder_count: savedData?.cylinder_count,
                seats_count: savedData?.seats_count,
                doors_count: savedData?.doors_count,
                horsepower: savedData?.horsepower,
                engine_size: savedData?.engine_size,
                regional_spec: savedData?.regional_spec,
                trim: savedData?.trim,
              }
            : undefined
        }
        mode="create"
        onSubmit={(values) => {
          setDataToStore(values);
          router.navigate("/(modals)/place-add/motors/add-extra-features");
        }}
      />
    </PlaceAdLayout>
  );
};

export default AddFeaturesScreen;
