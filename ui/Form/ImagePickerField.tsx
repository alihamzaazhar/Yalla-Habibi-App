import React from "react";
import { View, Text, ViewProps } from "react-native";
import {
  useController,
  useFormContext,
  UseControllerProps,
} from "react-hook-form";
import ImagePicker from "../ImagePicker";
import Animated from "react-native-reanimated";
import { ImagePickerAsset } from "expo-image-picker";
interface Props extends UseControllerProps, ViewProps {
  label?: string;
  name: string;
}

const ControlledInput = (props: Props) => {
  const formContext = useFormContext();
  const { formState } = formContext;
  const { name, label, defaultValue, ...viewProps } = props;
  const { field } = useController({ name, defaultValue });
  const hasError = Boolean(formState?.errors[name]);

  return (
    <View className="gap-3" {...viewProps}>
      {label && <Text className="font-semibold text-gray-800">{label}</Text>}
      <View className="gap-2">
        <ImagePicker
          imagesSelected={field.value}
          setSelectedImages={(selectedImages) => field.onChange(selectedImages)}
        />
        <View>
          {hasError && (
            <Text className="text-red-600 text-sm">
              {formState.errors[name]?.message as string}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export const ImagePickerField = (props: Props) => {
  const formContext = useFormContext();

  // Placeholder until input name is initialized
  if (!formContext || !props.name) {
    const msg = !formContext
      ? "ImagePickerField must be wrapped by the FormProvider"
      : "Name must be defined";
    return null;
  }

  return <ControlledInput {...props} />;
};
