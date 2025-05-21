import { useRouter } from "expo-router";
import React from "react";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import { useMotorAdStoreContext } from "@/lib/motors-ad/context/motor-ad-store-context";
import { useUpdateMotorAd } from "@/api/hooks/vendor/services/motor-ads/mutations";
import MotorAdFeaturesForm from "@/components/motors/forms/car-forms/FeaturesForm";
import { Category } from "@/api/types";
import { MOTOR_CATEGORIES_HANDLES } from "@/lib/motors-ad/constants";
import BikeFeaturesForm from "@/components/motors/forms/bike-forms/BikeFeaturesForm";
import HeavyVehiclesFeaturesForm from "@/components/motors/forms/heavy-vehicle-forms/HeavyVehiclFeaturesForm";
import BoatFeaturesForm from "@/components/motors/forms/boat-forms/BoatFeaturesForm";

const EditFeatures_ = () => {
  const router = useRouter();
  const data = useMotorAdStoreContext((store) => store.data);
  const metadata = useMotorAdStoreContext((store) => store.metadata);
  const id = useMotorAdStoreContext((store) => store.data?.id);
  const { mutate: updateMotorAd } = useUpdateMotorAd();
  const appendDataToStore = useMotorAdStoreContext(
    (store) => store.actions.updateData
  );
  const rootCategory =
    typeof data?.categories?.[0] === "string"
      ? (metadata?.categories[data?.categories?.[0]] as Category)
      : null;

  if (!rootCategory) return null;

  if (
    rootCategory.handle.includes(
      MOTOR_CATEGORIES_HANDLES["motorcycles-motor-ad-categories"]
    )
  ) {
    return (
      <BikeFeaturesForm
        initalData={
          data
            ? {
                final_drive_system: data?.final_drive_system,
                wheels: data?.wheels,
                engine_size: data?.engine_size,
              }
            : undefined
        }
        mode="edit"
        onSubmit={async (values) =>
          new Promise((resolve) => {
            updateMotorAd(
              {
                id: id ?? "",
                payload: values,
              },
              {
                onSuccess: () => {
                  appendDataToStore(values);
                  resolve();
                },
              }
            );
          })
        }
        onNext={() => {
          router.navigate({
            pathname: `/motor-ad/[id]/edit/edit-images`,
            params: {
              id: id!,
            },
          });
        }}
      />
    );
  } else if (
    rootCategory.handle.includes(
      MOTOR_CATEGORIES_HANDLES["heavy-vehicles-motor-ad-categories"]
    )
  ) {
    return (
      <HeavyVehiclesFeaturesForm
        initalData={
          data
            ? {
                cylinder_count: data.cylinder_count,
                transmission_type: data.transmission_type,
                horsepower: data.horsepower,
                seats_count: data.seats_count,
              }
            : undefined
        }
        mode="edit"
        onSubmit={async (values) =>
          new Promise((resolve) => {
            updateMotorAd(
              {
                id: id ?? "",
                payload: values,
              },
              {
                onSuccess: () => {
                  appendDataToStore(values);
                  resolve();
                },
              }
            );
          })
        }
        onNext={() => {
          router.navigate({
            pathname: `/motor-ad/[id]/edit/edit-images`,
            params: {
              id: id!,
            },
          });
        }}
      />
    );
  } else if (
    rootCategory.handle.includes(
      MOTOR_CATEGORIES_HANDLES["boats-motor-ad-categories"]
    )
  ) {
    return (
      <BoatFeaturesForm
        initalData={
          data
            ? {
                age: data.age,
                length: data.length,
                has_warranty: data.has_warranty,
              }
            : undefined
        }
        mode="edit"
        onSubmit={async (values) =>
          new Promise((resolve) => {
            updateMotorAd(
              {
                id: id ?? "",
                payload: values,
              },
              {
                onSuccess: () => {
                  appendDataToStore(values);
                  resolve();
                },
              }
            );
          })
        }
        onNext={() => {
          router.navigate({
            pathname: `/motor-ad/[id]/edit/edit-images`,
            params: {
              id: id!,
            },
          });
        }}
      />
    );
  }
  return (
    <MotorAdFeaturesForm
      initalData={
        data
          ? {
              body_type: data.body_type,
              cylinder_count: data.cylinder_count,
              drive_system: data.drive_system,
              engine_size: data.engine_size,
              fuel_type: data.fuel_type,
              has_insurance: data.has_insurance,
              has_warranty: data.has_warranty,
              horsepower: data.horsepower,
              seats_count: data.seats_count,
              steering_side: data.steering_side,
              transmission_type: data.transmission_type,
              doors_count: data.doors_count,
              exterior_color: data.exterior_color,
              interior_color: data.interior_color,
              regional_spec: data.regional_spec,
            }
          : undefined
      }
      mode="edit"
      onSubmit={async (values) =>
        new Promise((resolve) => {
          updateMotorAd(
            {
              id: id ?? "",
              payload: values,
            },
            {
              onSuccess: () => {
                appendDataToStore(values);
                resolve();
              },
            }
          );
        })
      }
      onNext={() => {
        router.navigate({
          pathname: `/motor-ad/[id]/edit/edit-extra-features`,
          params: {
            id: id!,
          },
        });
      }}
    />
  );
};

const EditFeaturesScreen = () => {
  const router = useRouter();
  const id = useMotorAdStoreContext((store) => store.data?.id);

  return (
    <PlaceAdLayout
      title="Edit Motor Details"
      showDismissButton
      onDismiss={() => {
        router.navigate({
          pathname: `/motor-ad/[id]`,
          params: {
            id: id!,
          },
        });
      }}
    >
      <EditFeatures_ />
    </PlaceAdLayout>
  );
};

export default EditFeaturesScreen;
