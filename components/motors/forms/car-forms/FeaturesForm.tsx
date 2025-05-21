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
  CAR_ENGINE_SIZES_MAP,
  CAR_HORSEPOWER_MAP,
  COLORS,
  MOTOR_BODY_TYPE,
  MOTOR_DRIVE_SYSTEM,
  MOTOR_FUEL_TYPE,
  MOTOR_STEERING_SIDE,
  MOTOR_TRANSMISSION_TYPE,
  REGIONAL_SPEC,
  TRIM,
} from "@/lib/motors-ad/constants";
import ChipsSelect from "@/ui/ChipsSelect";
import BaseButton from "@/ui/BaseButton";

const Schema = MotorAdInputSchema.pick({
  fuel_type: true,
  body_type: true,
  transmission_type: true,
  drive_system: true,
  cylinder_count: true,
  seats_count: true,
  trim: true,
  doors_count: true,
  horsepower: true,
  engine_size: true,
  has_warranty: true,
  has_insurance: true,
  steering_side: true,
  exterior_color: true,
  interior_color: true,
  regional_spec: true,
});
type TFieldValues = z.infer<typeof Schema>;
interface Props {
  initalData?: DefaultValues<TFieldValues>;
  onSubmit: (values: TFieldValues) => void | Promise<void>;
  mode?: "edit" | "create";
  onNext?: () => void;
}
const MotorAdFeaturesForm = ({ mode = "create", ...props }: Props) => {
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
            name="fuel_type"
            control={formInstance.control}
            render={({ field, fieldState }) => (
              <ChipsSelect
                onChange={(v) => field.onChange(v)}
                options={Object.values(MOTOR_FUEL_TYPE).map((o) => ({
                  label: humanizeString(o),
                  value: o,
                }))}
                value={field.value}
                label="Fuel Type"
                errorMessage={fieldState.error?.message}
                chipsContainerClassName="gap-2 px-4"
              />
            )}
          />
          <Controller
            name="body_type"
            control={formInstance.control}
            render={({ field, fieldState }) => (
              <ChipsSelect
                onChange={(v) => field.onChange(v)}
                options={Object.values(MOTOR_BODY_TYPE).map((o) => ({
                  label: humanizeString(o),
                  value: o,
                }))}
                value={field.value}
                label="Body Type"
                errorMessage={fieldState.error?.message}
                chipsContainerClassName="gap-2 pr-4"
              />
            )}
          />
          <Controller
            name="regional_spec"
            control={formInstance.control}
            render={({ field, fieldState }) => (
              <ChipsSelect
                onChange={(v) => field.onChange(v)}
                options={Object.values(REGIONAL_SPEC).map((o) => ({
                  label: humanizeString(o),
                  value: o,
                }))}
                value={field.value}
                label="Regional Spec"
                errorMessage={fieldState.error?.message}
                chipsContainerClassName="gap-2 pr-4"
              />
            )}
          />
          <Controller
            name="trim"
            control={formInstance.control}
            render={({ field, fieldState }) => (
              <ChipsSelect
                onChange={(v) => field.onChange(v)}
                options={Object.values(TRIM).map((o) => ({
                  label: o,
                  value: o,
                }))}
                value={field.value}
                label="Trim"
                errorMessage={fieldState.error?.message}
                chipsContainerClassName="gap-2 pr-4"
              />
            )}
          />
          <Controller
            name="exterior_color"
            control={formInstance.control}
            render={({ field, fieldState }) => (
              <ChipsSelect
                onChange={(v) => field.onChange(v)}
                options={Object.entries(COLORS).map(([color, hex]) => ({
                  label: humanizeString(color),
                  value: color,
                  className: "flex flex-row gap-3 items-center",
                  labelPrefix: hex ? (
                    <View
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: hex }}
                    ></View>
                  ) : null,
                }))}
                value={field.value}
                label="Exterior Color"
                errorMessage={fieldState.error?.message}
                chipsContainerClassName="gap-2 pr-4"
              />
            )}
          />
          <Controller
            name="interior_color"
            control={formInstance.control}
            render={({ field, fieldState }) => (
              <ChipsSelect
                onChange={(v) => field.onChange(v)}
                options={Object.entries(COLORS).map(([color, hex]) => ({
                  label: humanizeString(color),
                  value: color,
                  className: "flex flex-row gap-3 items-center",
                  labelPrefix: hex ? (
                    <View
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: hex }}
                    ></View>
                  ) : null,
                }))}
                value={field.value}
                label="Interior Color"
                errorMessage={fieldState.error?.message}
                chipsContainerClassName="gap-2 pr-4"
              />
            )}
          />
          <Controller
            name="cylinder_count"
            control={formInstance.control}
            render={({ field, fieldState }) => (
              <ChipsSelect
                onChange={(v) => field.onChange(v)}
                options={Array.from({ length: 10 }, (_, i) => i + 1).map(
                  (o) => ({
                    label: o,
                    value: o,
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
            name="seats_count"
            control={formInstance.control}
            render={({ field, fieldState }) => (
              <ChipsSelect
                onChange={(v) => field.onChange(v)}
                options={Array.from({ length: 10 }, (_, i) => i + 1).map(
                  (o) => ({
                    label: o,
                    value: o,
                  })
                )}
                value={field.value}
                label="Number of Seats"
                errorMessage={fieldState.error?.message}
                chipsContainerClassName="gap-2 pr-4"
              />
            )}
          />
          <Controller
            name="doors_count"
            control={formInstance.control}
            render={({ field, fieldState }) => (
              <ChipsSelect
                onChange={(v) => field.onChange(v)}
                options={Array.from({ length: 10 }, (_, i) => i + 1).map(
                  (o) => ({
                    label: o,
                    value: o,
                  })
                )}
                value={field.value}
                label="Number of Doors"
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
                options={Object.values(MOTOR_TRANSMISSION_TYPE).map((o) => ({
                  label: humanizeString(o),
                  value: o,
                }))}
                value={field.value}
                label="Transmission Type"
                errorMessage={fieldState.error?.message}
                chipsContainerClassName="gap-2 pr-4"
              />
            )}
          />
          <Controller
            name="has_warranty"
            control={formInstance.control}
            render={({ field, fieldState }) => (
              <ChipsSelect
                onChange={(v) => field.onChange(v)}
                options={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                errorMessage={fieldState.error?.message}
                value={field.value}
                label="Has Warranty"
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
                options={Object.entries(CAR_HORSEPOWER_MAP).map(([k, v]) => ({
                  label: k,
                  value: v,
                }))}
                value={field.value}
                label="Horsepower"
                chipsContainerClassName="gap-2 pr-4"
                errorMessage={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="engine_size"
            control={formInstance.control}
            render={({ field, fieldState }) => (
              <ChipsSelect
                onChange={(v) => field.onChange(v)}
                options={Object.entries(CAR_ENGINE_SIZES_MAP).map(
                  ([key, value], idx) => ({
                    label: key,
                    value: value,
                  })
                )}
                value={field.value}
                label="Engine Size"
                errorMessage={fieldState.error?.message}
                chipsContainerClassName="gap-2 pr-4"
              />
            )}
          />
          <Controller
            name="steering_side"
            control={formInstance.control}
            render={({ field, fieldState }) => (
              <ChipsSelect
                onChange={(v) => field.onChange(v)}
                options={Object.values(MOTOR_STEERING_SIDE).map((o) => ({
                  label: humanizeString(o) + " Hand",
                  value: o,
                }))}
                value={field.value}
                label="Steering Side"
                errorMessage={fieldState.error?.message}
                chipsContainerClassName="gap-2 pr-4"
              />
            )}
          />
          <Controller
            name="drive_system"
            control={formInstance.control}
            render={({ field, fieldState }) => (
              <ChipsSelect
                onChange={(v) => field.onChange(v)}
                options={Object.values(MOTOR_DRIVE_SYSTEM).map((o) => ({
                  label: humanizeString(o),
                  value: o,
                }))}
                value={field.value}
                label="Drive System"
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

export default MotorAdFeaturesForm;
