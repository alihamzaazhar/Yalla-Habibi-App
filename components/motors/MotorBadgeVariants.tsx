import useServices, {
  ServiceProduct,
} from "@/api/hooks/marketplace/services/queries";
import Card from "@/ui/Card";
import React from "react";
import { View } from "react-native";
import { Text } from "react-native";
import VariantCheckboxButton from "./VariantCheckboxButton";
import { camelCaseToHumanReadable } from "@/lib/common/utils";

type Props = {
  onVariantSelect?: (
    variant: { id: string; calculated_price: number } | null
  ) => void;
  selectedVariant?: { id: string; calculated_price: number };
};

interface MotorBadgeVariants_Props extends Props {
  motorAdBadgeProduct: ServiceProduct;
}
const MotorBadgeVariants_ = ({
  motorAdBadgeProduct,
  ...props
}: MotorBadgeVariants_Props) => {
  const variants = motorAdBadgeProduct.variants;
  const options = motorAdBadgeProduct.options;
  const initalSelectedOptions =
    variants
      ?.find((v) => props.selectedVariant?.id === v.id)
      ?.options?.map(
        (v) =>
          options?.find((o) => v.option_id === o.id) as NonNullable<
            typeof options
          >[number]
      ) ?? [];
  const [selectedOptions, setSelectedOptions] = React.useState<typeof options>(
    initalSelectedOptions
  );

  return (
    <View className="gap-8">
      <View className="gap-2">
        <Text className="text-2xl font-bold">
          You can Select Different Badges
        </Text>
        <Text className="text-md">
          If you want that your ad will be appear on these tags then you can
          select one of them.
        </Text>
      </View>
      <View>
        <View className="gap-4">
          <Card>
            {options?.map((o) => (
              <VariantCheckboxButton
                isChecked={selectedOptions.map((v) => v.id).includes(o.id)}
                label={camelCaseToHumanReadable(o.title)}
                badgePrice={
                  variants?.find((v) => {
                    const currentBadgeOption =
                      v.options?.filter(
                        (ov) => ov.option_id === o.id && ov.value === "added"
                      ).length === 1;
                    //Rest of the options should be null
                    const restOfOptionsAreNull = v.options?.every((ov) => {
                      return (
                        ov.value === "null" ||
                        (ov.option_id === o.id && ov.value === "added")
                      );
                    });
                    return Boolean(currentBadgeOption) && restOfOptionsAreNull;
                  })?.calculated_price ?? 0
                }
                setChecked={() => {
                  const selectedOptionsIds = selectedOptions.map((o) => o.id);
                  //If this option is already selected, remove it
                  //Else add it
                  const newSelectedOptions = selectedOptionsIds.includes(o.id)
                    ? selectedOptions.filter((v) => v.id !== o.id)
                    : [...selectedOptions, o];

                  setSelectedOptions(newSelectedOptions);
                  const newSelectedOptionsIds = newSelectedOptions.map(
                    (o) => o.id
                  );

                  //Find a variant that has all the options in it as added
                  const selectedVariant = variants.find((v) => {
                    if (newSelectedOptionsIds.length === 0) return false;
                    const variantAddedOptionsId = v.options
                      ?.filter((o) => o.value === "added")
                      .map((o) => o.option_id);
                    if (
                      variantAddedOptionsId?.length !==
                      newSelectedOptionsIds.length
                    )
                      return false;
                    return newSelectedOptionsIds.every((oId) =>
                      variantAddedOptionsId?.includes(oId)
                    );
                  });

                  props.onVariantSelect?.(
                    selectedVariant
                      ? {
                          id: selectedVariant?.id!,
                          calculated_price: selectedVariant?.calculated_price!,
                        }
                      : null
                  );
                }}
                key={o.id}
              />
            ))}
          </Card>
        </View>
      </View>
    </View>
  );
};

const MotorBadgeVariants = (props: Props) => {
  const { status, data } = useServices();
  if (status === "loading") return null;
  if (status === "error") return null;

  const motorAdProducts = data?.get("motor_ads");
  const motorAdBadgeProduct = motorAdProducts?.find(
    (v) => v.handle === "motors-ad-placement-service-badge"
  );
  if (!motorAdBadgeProduct) {
    return null;
  }
  return (
    <MotorBadgeVariants_ motorAdBadgeProduct={motorAdBadgeProduct} {...props} />
  );
};

export default MotorBadgeVariants;
