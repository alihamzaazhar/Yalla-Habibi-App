import { humanizeString } from "@/lib/common/utils";
import React from "react";
import { Text, View } from "react-native";
import {
  Controller,
  DefaultValues,
  FormProvider,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Theme, globalStyles } from "@/constants";
import { ScrollView } from "react-native-gesture-handler";
import { MotorAdInputSchema } from "@/lib/motors-ad/schema";
import {
  HEAVY_VEHICLE_CYLINDER_MAP,
  HEAVY_VEHICLE_HORSEPOWER_MAP,
  HEAVY_VEHICLE_SEATING_MAP,
  HEAVY_VEHICLE_TRANSMISSION_TYPE,
} from "@/lib/motors-ad/constants";
import ChipsSelect from "@/ui/ChipsSelect";
import BaseButton from "@/ui/BaseButton";

const Schema = MotorAdInputSchema.pick({
  cylinder_count: true,
  seats_count: true,
  transmission_type: true,
  horsepower: true,
});
type TFieldValues = z.infer<typeof Schema>;
interface Props {
  initalData?: DefaultValues<TFieldValues>;
  onSubmit: (values: TFieldValues) => void | Promise<void>;
  mode?: "edit" | "create";
  onNext?: () => void;
}
const HeavyVehiclesFeaturesForm = ({ mode = "create", ...props }: Props) => {
  const formInstance = useForm<z.infer<typeof Schema>>({
    mode: "all",
    defaultValues: props.initalData,
    resolver: zodResolver(Schema),
  });
  const reset = formInstance.reset;
  const onSubmit = formInstance.handleSubmit(async (values) => {
    await props.onSubmit(values);
    reset(values);
  });

  return (
    <FormProvider {...formInstance}>
      <ScrollView
        contentContainerClassName="pt-4 pb-4 relative bg-gray-100"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="gap-4">
          <Controller
            name="cylinder_count"
            control={formInstance.control}
            render={({ field, fieldState }) => (
              <ChipsSelect
                onChange={(v) => field.onChange(v)}
                options={Object.entries(HEAVY_VEHICLE_CYLINDER_MAP).map(
                  ([key, value], idx) => ({
                    label: key,
                    value: value,
                  })
                )}
                value={field.value}
                label="Number of Cylinders"
                errorMessage={fieldState.error?.message}
                chipsContainerClassName="gap-2 pr-4"
              />
            )}
          />
          <Controller
            name="transmission_type"
            control={formInstance.control}
            render={({ field, fieldState }) => (
              <ChipsSelect
                onChange={(v) => field.onChange(v)}
                options={Object.values(HEAVY_VEHICLE_TRANSMISSION_TYPE).map(
                  (o) => ({
                    label: humanizeString(o),
                    value: o,
                  })
                )}
                value={field.value}
                label="Transmission Type"
                errorMessage={fieldState.error?.message}
                chipsContainerClassName="gap-2 pr-4"
              />
            )}
          />
          <Controller
            name="seats_count"
            control={formInstance.control}
            render={({ field, fieldState }) => (
              <ChipsSelect
                onChange={(v) => field.onChange(v)}
                options={Object.entries(HEAVY_VEHICLE_SEATING_MAP).map(
                  ([key, value], idx) => ({
                    label: key,
                    value: value,
                  })
                )}
                value={field.value}
                label="Seating Capacity"
                errorMessage={fieldState.error?.message}
                chipsContainerClassName="gap-2 pr-4"
              />
            )}
          />
          <Controller
            name="horsepower"
            control={formInstance.control}
            render={({ field, fieldState }) => (
              <ChipsSelect
                onChange={(v) => field.onChange(v)}
                options={Object.entries(HEAVY_VEHICLE_HORSEPOWER_MAP).map(
                  ([key, value], idx) => ({
                    label: key,
                    value: value,
                  })
                )}
                value={field.value}
                label="Horsepower"
                errorMessage={fieldState.error?.message}
                chipsContainerClassName="gap-2 pr-4"
              />
            )}
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

export default HeavyVehiclesFeaturesForm;
