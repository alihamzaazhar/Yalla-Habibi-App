import React from "react";
import { Text, View } from "react-native";
import { DefaultValues, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Theme, globalStyles } from "@/constants";
import { ScrollView } from "react-native-gesture-handler";
import { MotorAdInputSchema } from "@/lib/motors-ad/schema";
import { ImagePickerField } from "@/ui/Form/ImagePickerField";
import BaseButton from "@/ui/BaseButton";

const Schema = MotorAdInputSchema.pick({
  images: true,
});
type TFieldValues = z.infer<typeof Schema>;
interface Props {
  initalData?: DefaultValues<TFieldValues>;
  onSubmit: (values: TFieldValues) => void | Promise<void>;
  mode?: "edit" | "create";
  onNext?: () => void;
}
const MotorAdImagesForm = ({
  initalData,
  mode = "create",
  ...props
}: Props) => {
  const formInstance = useForm<z.infer<typeof Schema>>({
    mode: "all",
    defaultValues: {
      images: initalData?.images ?? [],
    },
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
        contentContainerClassName="px-6 pt-6 pb-4 relative bg-gray-100"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <ImagePickerField name={"images"} label="Add Images" />
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

export default MotorAdImagesForm;
