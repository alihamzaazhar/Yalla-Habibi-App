import "react-native-get-random-values";
import { Stack } from "expo-router";
import "@/global.css";
import { withLayoutContext } from "expo-router";
import {
  createStackNavigator,
  StackNavigationEventMap,
  StackNavigationOptions,
} from "@react-navigation/stack";
import { ParamListBase, StackNavigationState } from "@react-navigation/native";
import RootProviders from "@/components/layouts/RootProviders";

const { Navigator } = createStackNavigator();

export const JsStack = withLayoutContext<
  StackNavigationOptions,
  typeof Navigator,
  StackNavigationState<ParamListBase>,
  StackNavigationEventMap
>(Navigator);

export default function RootLayout() {
  return (
    <RootProviders>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="profile" />
        <Stack.Screen name="profile-public/[id]" />
        <Stack.Screen name="(menu)/favourites" />
        <Stack.Screen name="search" />
        <Stack.Screen name="cart/[id]" />
        <Stack.Screen name="(auth)/sign-in" />
        <Stack.Screen name="(auth)/sign-up" />
        <Stack.Screen name="motor-ad/[id]/index" />
        <Stack.Screen name="property/[id]/index" />
        <Stack.Screen
          name="(modals)/place-add"
          options={{
            presentation: "modal",
            gestureEnabled: true,
            animation: "slide_from_bottom",
            headerShown: false,
          }}
        />
      </Stack>
    </RootProviders>
  );
}
