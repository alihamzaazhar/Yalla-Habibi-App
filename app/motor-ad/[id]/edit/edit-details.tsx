import { useRouter } from "expo-router";
import React from "react";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import { useMotorAdStoreContext } from "@/lib/motors-ad/context/motor-ad-store-context";
import MotorAdDetailsForm from "@/components/motors/forms/car-forms/BasicDetailsForm";
import { useUpdateMotorAd } from "@/api/hooks/vendor/services/motor-ads/mutations";
import { useGlobalMetaData } from "@/contexts/GlobalMetaDataContext";
import { Category } from "@/api/types";
import { MOTOR_CATEGORIES_HANDLES } from "@/lib/motors-ad/constants";
import BikeBasicDetailForm from "@/components/motors/forms/bike-forms/BikeBasicDetailForm";
import AccessoryBasicDetailForm from "@/components/motors/forms/accessory-forms/AccessoryBasicDetailForm";
import HeavyVehicleBasicDetailForm from "@/components/motors/forms/heavy-vehicle-forms/HeavyVehicleBasicDetailForm";
import BoatBasicDetailForm from "@/components/motors/forms/boat-forms/BoatBasicDetailForm";
import NumberPlateDetailForm from "@/components/motors/forms/number-plates/NumberPlateDetailForm";

const EditDetails_ = () => {
  const metadata = useMotorAdStoreContext((store) => store.metadata);
  const savedData = useMotorAdStoreContext((store) => store.data);
  const router = useRouter();
  const id = useMotorAdStoreContext((store) => store.data?.id);
  const { mutate: updateMotorAd } = useUpdateMotorAd();
  const appendDataToStore = useMotorAdStoreContext(
    (store) => store.actions.updateData
  );

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
      <BikeBasicDetailForm
        initalData={
          savedData
            ? {
                description: savedData?.description,
                price: savedData?.price,
                title: savedData?.title,
                kilometer: savedData?.kilometer,
                year: savedData?.year,
                phone_number: savedData?.phone_number,
                has_warranty: savedData?.has_warranty,
                usage: savedData?.usage,
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
            pathname: `/motor-ad/[id]/edit/edit-location`,
            params: {
              id: id!,
            },
          });
        }}
      />
    );
  } else if (
    rootCategory.handle.includes(
      MOTOR_CATEGORIES_HANDLES["auto-accessories-parts-motor-ad-categories"]
    )
  ) {
    return (
      <AccessoryBasicDetailForm
        initalData={
          savedData
            ? {
                description: savedData.description,
                phone_number: savedData.phone_number,
                price: savedData.price,
                title: savedData.title,
                usage: savedData.usage,
                condition: savedData.condition,
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
            pathname: `/motor-ad/[id]/edit/edit-location`,
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
      <HeavyVehicleBasicDetailForm
        initalData={
          savedData
            ? {
                description: savedData.description,
                phone_number: savedData.phone_number,
                price: savedData.price,
                title: savedData.title,
                kilometer: savedData.kilometer,
                year: savedData.year,
                weight: savedData.weight,
                has_warranty: savedData.has_warranty,
                body_condition: savedData.body_condition,
                mechanical_condition: savedData.mechanical_condition,
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
            pathname: `/motor-ad/[id]/edit/edit-location`,
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
      <BoatBasicDetailForm
        initalData={
          savedData
            ? {
                description: savedData?.description,
                price: savedData?.price,
                title: savedData?.title,
                phone_number: savedData?.phone_number,
                usage: savedData?.usage,
                condition: savedData?.condition,
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
            pathname: `/motor-ad/[id]/edit/edit-location`,
            params: {
              id: id!,
            },
          });
        }}
      />
    );
  } else if (
    rootCategory.handle.includes(
      MOTOR_CATEGORIES_HANDLES["number-plates-motor-ad-categories"]
    )
  ) {
    return (
      <NumberPlateDetailForm
        initalData={
          savedData
            ? {
                description: savedData?.description,
                price: savedData?.price,
                title: savedData?.title,
                phone_number: savedData?.phone_number,
                plate_number: savedData?.plate_number,
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
            pathname: `/motor-ad/[id]/edit/edit-location`,
            params: {
              id: id!,
            },
          });
        }}
      />
    );
  }
  return (
    <MotorAdDetailsForm
      initalData={
        savedData
          ? {
              description: savedData.description,
              phone_number: savedData.phone_number,
              price: savedData.price,
              title: savedData.title,
              has_insurance: savedData.has_insurance,
              kilometer: savedData.kilometer,
              year: savedData.year,
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
          pathname: `/motor-ad/[id]/edit/edit-location`,
          params: {
            id: id!,
          },
        });
      }}
    />
  );
};
const EditDetailsScreen = () => {
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
      <EditDetails_ />
    </PlaceAdLayout>
  );
};

export default EditDetailsScreen;
