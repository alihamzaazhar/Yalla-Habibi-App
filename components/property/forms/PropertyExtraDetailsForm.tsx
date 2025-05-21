import { humanizeString } from "@/lib/common/utils";
import { Button } from "@/ui/Button";
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
import { EXTRA_FEATURES_ENUM } from "@/lib/property-ad/schemas";
import { PropertyAd3Schema } from "@/lib/property-ad/schemas";
import BaseButton from "@/ui/BaseButton";

type TFieldValues = z.infer<typeof PropertyAd3Schema>;
interface Props {
  initalData?: DefaultValues<TFieldValues>;
  onSubmit: (values: TFieldValues) => void | Promise<void>;
  mode?: "edit" | "create";
  onNext?: () => void;
}
const PropertyExtraDetailsForm = ({ mode = "create", ...props }: Props) => {
  const formInstance = useForm<z.infer<typeof PropertyAd3Schema>>({
    mode: "all",
    defaultValues: props.initalData,
    resolver: zodResolver(PropertyAd3Schema),
  });

  const onSubmit = formInstance.handleSubmit(async (values) => {
    await props.onSubmit(values);
    formInstance.reset(values);
  });
  return (
    <FormProvider {...formInstance}>
      <ScrollView className="px-4 relative flex-1" style={{ marginBottom: 80 }}>
        <View className="gap-4 py-8">
          <Text className="font-bold text-lg">Select Extra Features</Text>
          <Controller
            name="extra_features"
            control={formInstance.control}
            render={({ field }) => (
              <View className="flex-row flex-wrap">
                {EXTRA_FEATURES_ENUM.map((o, idx) => (
                  <Checkbox
                    key={idx}
                    isChecked={Boolean(field.value?.includes(o))}
                    setChecked={(isChecked) =>
                      field.onChange(
                        isChecked
                          ? field.value
                            ? [...field.value, o]
                            : [o]
                          : field.value
                          ? field.value.filter((p) => o !== p)
                          : []
                      )
                    }
                    style={{ width: "50%" }}
                    label={humanizeString(o)}
                    labelClassName="flex-1"
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

export default PropertyExtraDetailsForm;
