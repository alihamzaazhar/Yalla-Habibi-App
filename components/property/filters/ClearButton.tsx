import { Theme } from "@/constants";
import BorderlessButton from "@/ui/BorderlessButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text } from "react-native";

const ClearButton = (props: { onPress?: () => void }) => {
  return (
    <BorderlessButton
      onPress={props.onPress}
      className="flex-row items-center gap-2"
    >
      <MaterialIcons name="cancel" size={18} color={`${Theme.gray[500]}`} />
      <Text className="font-semibold text-gray-500 mb-0.5">{"Clear"}</Text>
    </BorderlessButton>
  );
};
export default ClearButton;
