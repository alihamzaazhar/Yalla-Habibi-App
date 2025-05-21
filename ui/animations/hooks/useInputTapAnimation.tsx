import { Theme } from "@/constants";
import { addSaturationAndCommasInHsl } from "@/lib/common/utils";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";


const useInputTapAnimation = () => {
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
  }, []);

  return {
    style: tapAnimationStyle,
    onFocus: () => {
      isPressed.value = 1;
    },
    onBlur: () => {
      isPressed.value = 0;
    },
  };
};

export default useInputTapAnimation;
