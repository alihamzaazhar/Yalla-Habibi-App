import React from "react";
import { View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import RectButton from "../RectButton";
import { Theme } from "@/constants";
import DateTimePicker from "@react-native-community/datetimepicker";
import { cn } from "@/lib/common/utils";
import { formatDate } from "date-fns";
type Props = {
  value: Date | undefined;
  placeholder?: string;
  onChange: (v: Date | undefined) => void;
};

const DateInputField = ({ placeholder, onChange, value }: Props) => {
  const [showDate, setShowDate] = React.useState(false);
  return (
    <View>
      <RectButton
        onPress={() => {
          setShowDate(true);
        }}
        ButtonProps={{
          style: {
            backgroundColor: Theme.gray[200],
            borderRadius: 8,
            overflow: "hidden",
          },
        }}
      >
        <TextInput
          className={cn(
            "h-14 px-4 rounded-md text-gray-400 text-lg",
            value ? "text-slate-800" : "text-slate-400"
          )}
          readOnly
          value={value ? formatDate(value, 'dd-MM-yyyy') : placeholder}
        />
        {showDate ? (
          <DateTimePicker
            value={value ?? new Date()}
            minimumDate={new Date()}
            onChange={(e, d) => {
              setShowDate(false);
              onChange(e.type === "dismissed" ? undefined : d);
              
            }}
          />
        ) : null}
      </RectButton>
    </View>
  );
};

export default DateInputField;
