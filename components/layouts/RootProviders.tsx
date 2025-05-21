import React, { PropsWithChildren } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StripeProvider } from "@stripe/stripe-react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { YallahApiProvider } from "@/api/yallah-api-context";
import { GlobalMetaDataProvider } from "@/contexts/GlobalMetaDataContext";

const RootProviders = (props: PropsWithChildren) => {
  return (
    <GlobalMetaDataProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <BottomSheetModalProvider>
            <StripeProvider
              publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
            >
              <YallahApiProvider
                baseUrl={process.env.EXPO_PUBLIC_BACKEND_BASE_URL!}
              >
                {props.children}
              </YallahApiProvider>
            </StripeProvider>
          </BottomSheetModalProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </GlobalMetaDataProvider>
  );
};

export default RootProviders;
