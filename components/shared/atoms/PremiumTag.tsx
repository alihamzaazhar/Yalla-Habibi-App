import React from "react";
import { Text, View } from "react-native";

interface Props extends React.ComponentPropsWithoutRef<typeof View> {}

const PremiumTag = ({ style, ...props }: Props) => {
  return (
    <View
      style={[{ position: "absolute", bottom: 8, right: 8 }, style]}
      {...props}
    >
      <Text className="bg-primary px-2 py-0.5 font-medium text-xs text-primary-foreground rounded-md">
        Premium
      </Text>
    </View>
  );
};

export default PremiumTag;
