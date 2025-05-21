import { forwardRef, useState } from "react";
import { TextInput, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Theme } from "@/constants";
import { addSaturationAndCommasInHsl, cn } from "@/lib/common/utils";
import { useRouter } from "expo-router";
import { Button } from "@/ui/Button";

interface Props extends React.ComponentPropsWithoutRef<typeof TextInput> {
  enableNavigatingBack?: boolean;
  clearSearchIcon?: boolean;
  iconSize?: number;
}
const SearchInput = forwardRef<React.ElementRef<typeof TextInput>, Props>(
  (
    {
      className,
      clearSearchIcon = false,
      enableNavigatingBack = false,
      iconSize = 20,
      ...props
    },
    ref
  ) => {
    const router = useRouter();
    const isPressed = useSharedValue(0);

    const tapAnimationStyle = useAnimatedStyle(() => ({
      /*  Apparently hsl with space seperated values doesn't work https://github.com/software-mansion/react-native-reanimated/issues/5746 */
      borderColor: isPressed.value
        ? // Make sure that function only run on JsThread, otherwise error will be thrown
          !global._WORKLET
          ? Theme.slate[500]
          : ""
        : `${Theme.slate[300]}`,
    }));

    return (
      <Animated.View
        className={cn(
          "relative flex-row items-center rounded-lg bg-slate-100 border",
          className
        )}
        style={[tapAnimationStyle]}
      >
        {/* Apparently nativeWind doesn't work on lucideSvgIcons */}

        {enableNavigatingBack || clearSearchIcon ? (
          enableNavigatingBack ? (
            <Button
              variant={"icon"}
              className="self-center"
              onPress={() => router.back()}
            >
              <Entypo
                name="chevron-left"
                size={iconSize}
                color={Theme.slate[400]}
              />
            </Button>
          ) : (
            <Button variant={"ghost"} className="self-center" onPress={() => props.onChangeText?.("")}>
              <MaterialIcons
                name="cancel"
                size={iconSize}
                color={Theme.slate[400]}
              />
            </Button>
          )
        ) : (
          <View className="pl-3">
            <MaterialIcons
              name="search"
              size={iconSize}
              color={Theme.slate[400]}
            />
          </View>
        )}
        <TextInput
          className={"px-2 py-3 flex-1 text-base"}
          placeholder="Search Properties"
          placeholderTextColor={Theme.slate[400]}
          cursorColor={Theme.slate[500]}
          onFocus={() => {
            isPressed.value = 1;
          }}
          onBlur={() => {
            isPressed.value = 0;
          }}
          ref={ref}
          {...props}
        />
      </Animated.View>
    );
  }
);

export { SearchInput };
