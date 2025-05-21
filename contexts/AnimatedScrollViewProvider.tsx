import { Theme } from "@/constants";
import createGenericContext from "@/lib/common/create-generic-context";
import { PropsWithChildren, useState } from "react";
import Animated, {
  AnimatedRef,
  SharedValue,
  useAnimatedRef,
  useScrollViewOffset,
} from "react-native-reanimated";

interface Context {
  scrollOffset: SharedValue<number>;
  containerHeight: number | undefined;
  containerRef: AnimatedRef<Animated.ScrollView>;
}
const [useAnimatedScrollView, AnimatedScrollViewContextProvider] =
  createGenericContext<Context>();

const AnimatedScrollViewProvider = (props: PropsWithChildren) => {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const [containerHeight, setContainerHeight] = useState<number | undefined>(
    undefined
  );
  return (
    <Animated.ScrollView
      ref={scrollRef}
      scrollEventThrottle={16}
      onLayout={(e) => {
        e.target.measure((x, y, width, height) => {
          setContainerHeight(height);
        });
      }}
      contentContainerStyle={{
        backgroundColor: Theme.gray[100],
      }}
    >
      <AnimatedScrollViewContextProvider
        value={{ scrollOffset, containerHeight, containerRef: scrollRef }}
      >
        {props.children}
      </AnimatedScrollViewContextProvider>
    </Animated.ScrollView>
  );
};
export { useAnimatedScrollView, AnimatedScrollViewProvider };
