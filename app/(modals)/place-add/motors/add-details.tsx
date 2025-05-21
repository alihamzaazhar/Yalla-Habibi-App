import { useRouter } from "expo-router";
import React from "react";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import MotorAdDetailsForm from "@/components/motors/forms/car-forms/BasicDetailsForm";
import { useMotorAdStoreContext } from "@/lib/motors-ad/context/motor-ad-store-context";
import { useGlobalMetaData } from "@/contexts/GlobalMetaDataContext";
import { Category } from "@/api/types";
import { MOTOR_CATEGORIES_HANDLES } from "@/lib/motors-ad/constants";
import BikeBasicDetailForm from "@/components/motors/forms/bike-forms/BikeBasicDetailForm";
import AccessoryBasicDetailForm from "@/components/motors/forms/accessory-forms/AccessoryBasicDetailForm";
import HeavyVehicleBasicDetailForm from "@/components/motors/forms/heavy-vehicle-forms/HeavyVehicleBasicDetailForm";
import BoatBasicDetailForm from "@/components/motors/forms/boat-forms/BoatBasicDetailForm";
import NumberPlateDetailForm from "@/components/motors/forms/number-plates/NumberPlateDetailForm";

const AddDetailsScreen = () => {
  const router = useRouter();
  const setDataToStore = useMotorAdStoreContext(
    (store) => store.actions.updateData
  );
  const savedData = useMotorAdStoreContext((store) => store.data);
  const metadata = useMotorAdStoreContext((store) => store.metadata);
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
          mode="create"
          onSubmit={(values) => {
            setDataToStore(values);
            router.navigate("/(modals)/place-add/motors/add-location");
          }}
        />
      </PlaceAdLayout>
    );
  } else if (
    rootCategory.handle.includes(
      MOTOR_CATEGORIES_HANDLES["auto-accessories-parts-motor-ad-categories"]
    )
  ) {
    return (
      <PlaceAdLayout title="Add Motors Details">
        <AccessoryBasicDetailForm
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
          mode="create"
          onSubmit={(values) => {
            setDataToStore(values);
            router.navigate("/(modals)/place-add/motors/add-location");
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
        <HeavyVehicleBasicDetailForm
          initalData={
            savedData
              ? {
                  description: savedData?.description,
                  price: savedData?.price,
                  title: savedData?.title,
                  kilometer: savedData?.kilometer,
                  year: savedData?.year,
                  weight: savedData?.weight,
                  has_warranty: savedData?.has_warranty,
                  body_condition: savedData?.body_condition,
                  mechanical_condition: savedData?.mechanical_condition,
                }
              : undefined
          }
          mode="create"
          onSubmit={(values) => {
            setDataToStore(values);
            router.navigate("/(modals)/place-add/motors/add-location");
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
          mode="create"
          onSubmit={(values) => {
            setDataToStore(values);
            router.navigate("/(modals)/place-add/motors/add-location");
          }}
        />
      </PlaceAdLayout>
    );
  } else if (
    rootCategory.handle.includes(
      MOTOR_CATEGORIES_HANDLES["number-plates-motor-ad-categories"]
    )
  ) {
    return (
      <PlaceAdLayout title="Add Motors Details">
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
          mode="create"
          onSubmit={(values) => {
            setDataToStore(values);
            router.navigate("/(modals)/place-add/motors/add-location");
          }}
        />
      </PlaceAdLayout>
    );
  }
  return (
    <PlaceAdLayout title="Add Motors Details">
      <MotorAdDetailsForm
        initalData={
          savedData
            ? {
                description: savedData?.description,
                price: savedData?.price,
                title: savedData?.title,
                kilometer: savedData?.kilometer,
                year: savedData?.year,
                phone_number: savedData?.phone_number,
                has_insurance: savedData?.has_insurance,
              }
            : undefined
        }
        mode="create"
        onSubmit={(values) => {
          setDataToStore(values);
          router.navigate("/(modals)/place-add/motors/add-location");
        }}
      />
    </PlaceAdLayout>
  );
};

export default AddDetailsScreen;
