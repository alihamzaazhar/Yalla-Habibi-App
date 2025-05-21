import { forwardRef } from "react";
import { TextInput } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Theme } from "@/constants";
import { addSaturationAndCommasInHsl, cn } from "@/lib/common/utils";
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const Input = forwardRef<
  React.ElementRef<typeof TextInput>,
  React.ComponentPropsWithoutRef<typeof TextInput>
>(({ className, onFocus, onBlur, style, ...props }, ref) => {
  const isPressed = useSharedValue(0);
  {
    /* 
    Apparently hsl with space seperated values doesn't work
    https://github.com/software-mansion/react-native-reanimated/issues/5746
  */
  }

  const tapAnimationStyle = useAnimatedStyle(() => {
    const darkBorder = !global._WORKLET
      ? `hsl(${addSaturationAndCommasInHsl(Theme.colors.input, "0%")})`
      : "";
    return {
      borderColor: isPressed.value
        ? darkBorder
        : `hsl(${Theme.colors.input.split(" ").join(",")})`,
    };
  }, [style]);
  return (
    <AnimatedTextInput
      className={cn("bg-gray-200 rounded-md text-start", className)}
      ref={ref}
      placeholderTextColor={Theme.slate[400]}
      cursorColor={Theme.slate[500]}
      style={[
        { paddingHorizontal: 14, fontSize: 16, minHeight: 48 },
        tapAnimationStyle,
        style
      ]}
      onFocus={(e) => {
        isPressed.value = 1;
        onFocus?.(e);
      }}
      onBlur={(e) => {
        isPressed.value = 0;
        onBlur?.(e);
      }}
      {...props}
    />
  );
});

export default Input;
