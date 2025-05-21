import { Button } from "@/ui/Button";
import { ChipsSelectField } from "@/ui/Form/ChipsSelectField";
import React from "react";
import {
  Controller,
  DefaultValues,
  FormProvider,
  useForm,
} from "react-hook-form";
import { Text, View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateKeysObjectForObject } from "@/lib/common/utils";
import * as z from "zod";
import { ScrollView } from "react-native-gesture-handler";
import { Theme, globalStyles } from "@/constants";
import ChipsSelect from "@/ui/ChipsSelect";
import { PropertyAd2Schema } from "@/lib/property-ad/schemas";
import BaseButton from "@/ui/BaseButton";

const PropertyAd2SchemaKeys = generateKeysObjectForObject(
  PropertyAd2Schema.shape
);
type TFieldValues = z.infer<typeof PropertyAd2Schema>;
interface Props {
  initialData?: DefaultValues<TFieldValues>;
  onSubmit: (values: TFieldValues) => void | Promise<void>;
  mode?: "edit" | "create";
  onNext?: () => void;
}
const PropertyFeaturesForm = ({ mode = "create", ...props }: Props) => {
  const formInstance = useForm<z.infer<typeof PropertyAd2Schema>>({
    mode: "all",
    defaultValues: props.initialData,
    resolver: zodResolver(PropertyAd2Schema),
  });

  const onSubmit = formInstance.handleSubmit(async (values) => {
    await props.onSubmit(values);
    formInstance.reset(values);
  });
  return (
    <FormProvider {...formInstance}>
      <ScrollView className="mb-4 pt-6 pb-4 relative flex-1 bg-gray-100">
        <View className="gap-4">
          <ChipsSelectField
            name={PropertyAd2SchemaKeys["bedroom_count"]}
            label="Bedroom"
            chipsContainerClassName="px-4"
            labelClassName="px-4"
            options={Array.from(
              { length: PropertyAd2Schema.shape.bedroom_count.maxValue ?? 0 },
              (_, i) => i + 1
            )}
          />
          <ChipsSelectField
            name={PropertyAd2SchemaKeys["bathroom_count"]}
            label="Bathrooms"
            chipsContainerClassName="px-4"
            labelClassName="px-4"
            options={Array.from(
              {
                length: PropertyAd2Schema.shape.bathroom_count.maxValue ?? 0,
              },
              (_, i) => i + 1
            )}
          />
          <Controller
            name="is_furnished"
            control={formInstance.control}
            render={({ field }) => (
              <ChipsSelect
                onChange={(v) => field.onChange(v)}
                options={[
                  { value: true, label: "Furnished" },
                  { value: false, label: "Not Furnished" },
                ]}
                errorMessage={
                  formInstance.formState.errors.is_furnished?.message
                }
                value={field.value}
                label="Furnished"
                chipsContainerClassName="px-4"
                labelClassName="px-4"
              />
            )}
          />
          <ChipsSelectField
            name={PropertyAd2SchemaKeys["listed_by"]}
            label="Listed By"
            chipsContainerClassName="px-4"
            labelClassName="px-4"
            options={Object.keys(PropertyAd2Schema.shape.listed_by.Enum)}
          />
        </View>
      </ScrollView>
      <View
        className="absolute bottom-0 p-6 w-full bg-white"
        style={globalStyles.shadowMd}
      >
        <BaseButton
          ButtonProps={{
            style: {
              width: "100%",
              backgroundColor: Theme.primary.DEFAULT,
            },
          }}
          className="w-full"
          variant={"default"}
          onPress={() => {
            if (mode === "create") return onSubmit();
            else {
              if (formInstance.formState.isDirty) onSubmit();
              else props.onNext?.();
            }
          }}
          isLoading={formInstance.formState.isSubmitting}
        >
          <Text className="text-white font-bold text-xl">
            {mode === "edit" && formInstance.formState.isDirty
              ? "Update"
              : "Next"}
          </Text>
        </BaseButton>
      </View>
    </FormProvider>
  );
};

export default PropertyFeaturesForm;
