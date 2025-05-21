import { Theme } from "@/constants";
import React from "react";
import { TextInput } from "react-native";
import PhoneInput, {
  ReactNativePhoneInputProps,
} from "react-native-phone-input";
const PhoneNumberInput = React.forwardRef<
  PhoneInput<typeof TextInput> | null,
  ReactNativePhoneInputProps
>(({ textProps = { style: {} }, ...props }, ref) => {
  return (
    <PhoneInput
      ref={ref}
      autoFormat
      textProps={{
        ...textProps,
        style: [
          {
            paddingHorizontal: 14,
            minHeight: 48,
            fontSize: 16,
            backgroundColor: Theme.gray[200],
            borderRadius: 8,
          },
          textProps.style,
        ],
        placeholderTextColor: Theme.slate[400],
        cursorColor: Theme.slate[500],
      }}
      initialCountry={"ae"}
      {...props}
    />
  );
});

export default PhoneNumberInput;
