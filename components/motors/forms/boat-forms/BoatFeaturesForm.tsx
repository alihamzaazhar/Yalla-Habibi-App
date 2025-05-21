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
  BOAT_AGE_OPTIONS,
  BOAT_LENGTH_OPTIONS,
} from "@/lib/motors-ad/constants";
import ChipsSelect from "@/ui/ChipsSelect";
import BaseButton from "@/ui/BaseButton";

const Schema = MotorAdInputSchema.pick({
  age: true,
  length: true,
  has_warranty: true,
});
type TFieldValues = z.infer<typeof Schema>;
interface Props {
  initalData?: DefaultValues<TFieldValues>;
  onSubmit: (values: TFieldValues) => void | Promise<void>;
  mode?: "edit" | "create";
  onNext?: () => void;
}
const BoatFeaturesForm = ({ mode = "create", ...props }: Props) => {
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
            name="age"
            control={formInstance.control}
            render={({ field, fieldState }) => (
              <ChipsSelect
                onChange={(v) => field.onChange(v)}
                options={BOAT_AGE_OPTIONS.map((o) => ({
                  label: o,
                  value: o,
                }))}
                value={field.value}
                label="Age"
                errorMessage={fieldState.error?.message}
                chipsContainerClassName="gap-2 px-4"
              />
            )}
          />
          <Controller
            name="length"
            control={formInstance.control}
            render={({ field, fieldState }) => (
              <ChipsSelect
                onChange={(v) => field.onChange(v)}
                options={BOAT_LENGTH_OPTIONS.map((o) => ({
                  label: o,
                  value: o,
                }))}
                value={field.value}
                label="Length"
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

export default BoatFeaturesForm;
