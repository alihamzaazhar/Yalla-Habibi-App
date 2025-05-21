import { Theme } from "@/constants";
import { Button } from "@/ui/Button";
import { useNavigation, useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import React, { PropsWithChildren, useLayoutEffect } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BorderlessButton from "@/ui/BorderlessButton";
import BackIcon from "../shared/BackIcon";

type Props = { onReset?: () => void };

const FilterScreenLayout = (props: PropsWithChildren<Props>) => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <View className="bg-background">
          <SafeAreaView>
            <View className="p-4 flex-row justify-between items-center">
              <View>
                <BackIcon />
              </View>
              <Text
                className="font-semibold tracking-wider text-xl"
                style={{ marginBottom: 1, marginEnd: 10 }}
              >
                {"Filter"}
              </Text>
              <BorderlessButton
                onPress={props.onReset}
                className="items-center"
              >
                <Text>Reset</Text>
              </BorderlessButton>
            </View>
          </SafeAreaView>
        </View>
      ),
    });
  }, []);
  return <>{props.children}</>;
};

export default FilterScreenLayout;
