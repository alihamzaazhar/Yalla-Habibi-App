import { Theme } from "@/constants";
import { Button } from "@/ui/Button";
import { useNavigation, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { PropsWithChildren, useLayoutEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { addCommasInHsl } from "@/lib/common/utils";

const OverlayScreenLayout = (props: PropsWithChildren) => {
  const navigation = useNavigation();
  const router = useRouter();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      header: () => (
        <SafeAreaView>
          <View className="px-8 py-4">
            <Button
              variant={"icon"}
              onPress={() => router.dismissAll()}
              className="self-end"
            >
              <AntDesign
                name="close"
                color={`hsl(${addCommasInHsl(Theme.colors.muted.foreground)}))`}
                size={24}
              />
            </Button>
          </View>
        </SafeAreaView>
      ),
    });
  }, []);
  return <View className="mt-16 flex-1">{props.children}</View>;
};

export default OverlayScreenLayout;
