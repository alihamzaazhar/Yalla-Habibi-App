import createGenericContext from "@/lib/common/create-generic-context";
import { PropsWithChildren, useState } from "react";
import Animated, {
  AnimatedRef,
  SharedValue,
  useAnimatedRef,
  useScrollViewOffset,
  useSharedValue,
} from "react-native-reanimated";

interface Context {
  scrollOffset: SharedValue<number>;
  setScrollOffset: (offset: number) => void;
}
const [useScrollOffset, ScrollOffsetContextProvider] =
  createGenericContext<Context>();

const ScrollOffsetProvider = (props: PropsWithChildren) => {
  const scrollOffset = useSharedValue<number>(0);
  const setScrollOffset = (value: number) => {
    scrollOffset.value = value;
  };

  return (
    <ScrollOffsetContextProvider
      value={{ scrollOffset, setScrollOffset }}
    >
      {props.children}
    </ScrollOffsetContextProvider>
  );
};
export { useScrollOffset, ScrollOffsetProvider };
