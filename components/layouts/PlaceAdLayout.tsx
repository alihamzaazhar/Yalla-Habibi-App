import React, { PropsWithChildren, useLayoutEffect } from "react";
import { useNavigation, useRouter } from "expo-router";
import { View, Text, StatusBar } from "react-native";
import { Button } from "@/ui/Button";
import Entypo from "@expo/vector-icons/Entypo";
import { Theme } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import BackIcon from "../shared/BackIcon";
import BorderlessButton from "@/ui/BorderlessButton";

type Props = {
  title: string;
  className?: string;
  showDismissButton?: boolean;
  onDismiss?: () => void;
};

const PlaceAdLayout = ({
  title,
  children,
  showDismissButton = false,
  onDismiss,
  className,
}: PropsWithChildren<Props>) => {
  const navigation = useNavigation();
  const router = useRouter();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <View className={"bg-gray-100 flex-row"}>
          <SafeAreaView
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              flex: 1,
              alignItems: "center",
              paddingTop: 20,
              paddingBottom: 24,
              paddingHorizontal: 12,
            }}
          >
            <View>
              <BackIcon />
            </View>
            <Text
              className="font-semibold text-slate-800"
              style={{ fontSize: 19, marginBottom: 1.5 }}
            >
              {title}
            </Text>
            {showDismissButton ? (
              <BorderlessButton
                onPress={() => {
                  if (onDismiss) {
                    onDismiss();
                  } else {
                    router.dismissAll();
                  }
                }}
              >
                <Entypo
                  name="cross"
                  size={20}
                  color={Theme.slate[800]}
                />
              </BorderlessButton>
            ) : (
              <View style={{ width: 20, height: 20 }}></View>
            )}
          </SafeAreaView>
        </View>
      ),
    });
  }, [showDismissButton]);
  return (
    <View style={{ flex: 1 }} className="bg-gray-100">
      {children}
    </View>
  );
};

export default PlaceAdLayout;
