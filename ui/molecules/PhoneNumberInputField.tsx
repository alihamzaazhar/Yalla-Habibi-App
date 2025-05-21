import React from "react";
import { View, Text } from "react-native";
import PhoneNumberInput from "../PhoneNumberInput";
import phoneNumber from "@/lib/common/phone-number";

type Props = {
  errorMessage: string | undefined;
  value?: string;
  onChangePhoneNumber: (v: string) => void;
  onBlur: () => void;
};

const getFormattedPhoneNumberOrUndefined = (value?: string) => {
  try {
    const code = phoneNumber.getCountryCodeOfNumber(value);
    return phoneNumber.isValidNumber(value, code) ? value : undefined;
  } catch (e) {
    return undefined;
  }
};
const PhoneNumberInputField = ({
  errorMessage,
  value,
  onChangePhoneNumber,
  onBlur,
}: Props) => {
  return (
    <View>
      <PhoneNumberInput
        onChangePhoneNumber={(v) => {
          onChangePhoneNumber(v);
        }}
        initialValue={getFormattedPhoneNumberOrUndefined(value)}
        textProps={{ onBlur: onBlur }}
      />
      <View>
        {Boolean(errorMessage) && (
          <Text className="text-red-600 text-sm">{errorMessage as string}</Text>
        )}
      </View>
    </View>
  );
};

export default PhoneNumberInputField;
