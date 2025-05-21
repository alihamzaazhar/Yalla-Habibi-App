import React, { PropsWithChildren, useLayoutEffect } from "react";
import { useNavigation, useRouter } from "expo-router";
import { View, Text, StatusBar } from "react-native";
import { Button } from "@/ui/Button";
import Entypo from "@expo/vector-icons/Entypo";
import { Theme } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { cn } from "@/lib/common/utils";
import BackIcon from "../shared/BackIcon";

type Props = {
  title: string;
  className?: string;
  headerClassName?: string;
  leftIcon?: React.ReactNode;
  showDismissButton?: boolean;
  onDismiss?: () => void;
};

const StackScreenLayout = ({
  title,
  children,
  leftIcon,
  headerClassName,
  onDismiss,
  showDismissButton = false,
}: PropsWithChildren<Props>) => {
  const navigation = useNavigation();
  const router = useRouter()
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <View
          className={cn("bg-gray-100 flex-row items-center", headerClassName)}
        >
          <SafeAreaView
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flex: 1,
              paddingVertical: 16,
              paddingHorizontal: 18,
            }}
          >
            {leftIcon ?? <BackIcon />}
            <Text className="text-2xl font-bold">{title}</Text>
            {showDismissButton ? (
              <View>
                <Button variant={"ghost"} onPress={() => {
                  if (onDismiss) {
                    onDismiss();
                  } else {
                    router.dismissAll();
                  }
                }}>
                  <Entypo
                    name="cross"
                    size={20}
                    color={`hsl(${Theme.colors.muted.foreground})`}
                  />
                </Button>
              </View>
            ) : <View></View>}
          </SafeAreaView>
        </View>
      ),
    });
  }, [headerClassName, showDismissButton]);
  return <View style={{ flex: 1 }}>{children}</View>;
};

export default StackScreenLayout;
