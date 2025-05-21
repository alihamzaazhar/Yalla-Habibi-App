import React from "react";
import { View } from "react-native";
import { RectButtonProps, TextInput } from "react-native-gesture-handler";
import RectButton from "../RectButton";
import { Theme } from "@/constants";
import DateTimePicker, {
  BaseProps as DateTimePickerProps,
} from "@react-native-community/datetimepicker";
import Feather from "@expo/vector-icons/Feather";
import { formatDate } from "date-fns";
type Props = {
  value: Date | undefined;
  placeholder?: string;
  onChange: (v: Date | undefined) => void;
} & Omit<DateTimePickerProps, "value" | "onChange">;

const DateFilter = ({ placeholder, onChange, value, ...props }: Props) => {
  const [showDate, setShowDate] = React.useState(false);
  return (
    <RectButton
      onPress={() => {
        setShowDate(true);
      }}
      ButtonProps={{
        style: [
          {
            borderRadius: 8,
            borderWidth: 1,
            borderColor: Theme.slate[300],
            overflow: "hidden",
            flex: 1,
          },
        ],
      }}
    >
      <View className="flex-row items-center gap-2 h-10 px-3 rounded-md ">
        <Feather name="calendar" size={16} color={Theme.slate[400]} />
        <TextInput
          className="text-slate-500 font-medium placeholder:text-slate-400"
          readOnly
          placeholderClassName="text-slate-400"
          placeholder={placeholder}
          value={
            value instanceof Date ? formatDate(value, "dd MMM yyyy") : undefined
          }
        />
      </View>
      {showDate ? (
        <DateTimePicker
          value={value ?? new Date()}
          onChange={(e, d) => {
            setShowDate(false);
            onChange(e.type === "dismissed" ? value : d);
          }}
          {...props}
        />
      ) : null}
    </RectButton>
  );
};

export default DateFilter;
