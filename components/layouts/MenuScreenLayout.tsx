import { Theme } from "@/constants";
import { Button } from "@/ui/Button";
import { useNavigation, useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import React, { PropsWithChildren, useLayoutEffect } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cn } from "@/lib/common/utils";
import BackIcon from "../shared/BackIcon";

type Props = {
  title?: string;
  className?: string;
  headerClassName?: string;
  rightIcon?: React.ReactNode;
};

const MenuScreenLayout = (props: PropsWithChildren<Props>) => {
  const navigation = useNavigation();
  const router = useRouter();
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <View className={cn("bg-[#f9fafb] pt-4 pb-2", props.headerClassName)}>
          <SafeAreaView>
            <View className="px-2 flex-row justify-between items-center">
              <View className="p-2">
                {router.canGoBack() ? <BackIcon /> : null}
              </View>
              {props.title ? (
                <Text
                  className="font-semibold tracking-wider text-xl"
                  style={{ marginBottom: 1, marginEnd: 10 }}
                >
                  {props.title}
                </Text>
              ) : null}
              <View className="p-2">
                {props.rightIcon ? (
                  props.rightIcon
                ) : (
                  <View style={{ width: 16, height: 16 }} />
                )}
              </View>
            </View>
          </SafeAreaView>
        </View>
      ),
    });
  }, []);
  return (
    <View className={cn("flex-1 bg-[#f9fafb]", props.className)}>
      {props.children}
    </View>
  );
};

export default MenuScreenLayout;
