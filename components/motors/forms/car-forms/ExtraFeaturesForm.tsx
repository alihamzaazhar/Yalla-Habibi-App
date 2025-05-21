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
import { Checkbox } from "@/ui/Checkbox";
import { MotorAdInputSchema } from "@/lib/motors-ad/schema";
import { EXTRA_FEATURES_ENUM } from "@/lib/motors-ad/constants";
import BaseButton from "@/ui/BaseButton";

const Schema = MotorAdInputSchema.pick({
  extra_features: true,
});
type TFieldValues = z.infer<typeof Schema>;
interface Props {
  initalData?: DefaultValues<TFieldValues>;
  onSubmit: (values: TFieldValues) => void | Promise<void>;
  mode?: "edit" | "create";
  onNext?: () => void;
}
const MotorAdExtraFeaturesForm = ({
  mode = "create",
  initalData,
  ...props
}: Props) => {
  const formInstance = useForm<z.infer<typeof Schema>>({
    mode: "all",
    defaultValues: initalData ?? {
      extra_features: {},
    },
    resolver: zodResolver(Schema),
  });
  const onSubmit = formInstance.handleSubmit(async () => {
    // For some reason above values are not working
    const values = formInstance.getValues();
    await props.onSubmit(values);
    formInstance.reset(values);
  });
  return (
    <FormProvider {...formInstance}>
      <ScrollView
        contentContainerClassName="px-4 pt-6 relative bg-gray-100"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="gap-3">
          <Text className="font-bold text-lg px-2">Select Extra Features</Text>
          <Controller
            name="extra_features"
            control={formInstance.control}
            render={({ field }) => (
              <View className="flex-row flex-wrap">
                {EXTRA_FEATURES_ENUM.map((o, idx) => (
                  <Checkbox
                    key={idx}
                    isChecked={Boolean(
                      field.value ? Object.hasOwn(field.value, o) : undefined
                    )}
                    labelClassName="flex-1"
                    setChecked={(isChecked) => {
                      if (isChecked) {
                        field.onChange({ ...field.value, [o]: true });
                      } else {
                        field.onChange(
                          field.value
                            ? Object.fromEntries(
                                Object.entries(field.value).filter(
                                  ([k]) => k !== o
                                )
                              )
                            : undefined
                        );
                      }
                    }}
                    style={{ width: "50%" }}
                    label={o}
                  />
                ))}
              </View>
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

export default MotorAdExtraFeaturesForm;
