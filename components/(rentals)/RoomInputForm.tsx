import { Button } from "@/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { TextInput, Text, View } from "react-native";
import * as z from "zod";
import { humanizeString } from "@/lib/common/utils";
import InputField from "@/ui/molecules/InputField";
import { Theme } from "@/constants";
import CurrencyInput from "react-native-currency-input";
import AmountInput from "@/ui/AmountInput";
type Props = {
  type: "room" | "partition" | "bed";
  defaultValues?: z.infer<typeof RoomInputFormSchema>;
  onSave: (values: z.infer<typeof RoomInputFormSchema>) => void;
};

export const RoomInputFormSchema = z.object({
  name: z.string().min(1).max(100),
  rent_per_month: z.number(),
});

const RoomInputForm = (props: Props) => {
  const formInstance = useForm<z.infer<typeof RoomInputFormSchema>>({
    mode: "all",
    defaultValues: props.defaultValues,
    resolver: zodResolver(RoomInputFormSchema),
  });
  const onSubmit = formInstance.handleSubmit(async (values) => {
    props.onSave(values);
  });
  return (
    <FormProvider {...formInstance}>
      <View className="justify-between gap-4">
        <View>
          <Controller
            name="name"
            control={formInstance.control}
            render={({ field, formState }) => (
              <InputField
                value={field.value}
                onChangeText={(v) => field.onChange(v)}
                onBlur={field.onBlur}
                placeholder={`${humanizeString(props.type)} Name`}
                className="border-none"
                style={{
                  borderBottomWidth: 1,
                  borderColor: Theme.border,
                  fontSize: 18,
                  paddingHorizontal: 4,
                  backgroundColor: "transparent",
                }}
                autoFocus
              />
            )}
          />
          <Controller
            name="rent_per_month"
            control={formInstance.control}
            render={({ field, formState }) => (
              <AmountInput
                value={field.value}
                onChangeValue={(v) => field.onChange(v)}
                onBlur={field.onBlur}
                placeholder="Rent per month"
                prefix="AED"
                decimal_digits={2}
                style={{
                  borderBottomWidth: 1,
                  borderColor: Theme.border,
                  fontSize: 18,
                  paddingHorizontal: 4,
                  backgroundColor: "transparent",
                }}
              />
            )}
          />
        </View>
        <Button
          variant={"default"}
          onPress={onSubmit}
          className="items-center justify-center rounded-md gap-2 px-6 py-2 h-auto self-end mx-4"
        >
          <Text className="text-white text-lg font-semibold">Save</Text>
        </Button>
      </View>
    </FormProvider>
  );
};

export default RoomInputForm;
