import { ParamListBase, StackNavigationState } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React, { PropsWithChildren, useLayoutEffect } from "react";
import { NativeStackNavigationOptions } from "react-native-screens/lib/typescript/native-stack/types";

type Props = PropsWithChildren<{
  title?: string;
}>;

const StackScreenWithTitleLayout = (props: Props) => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: props.title,
    } as NativeStackNavigationOptions);
  }, [props.title]);

  return <>{props.children}</>;
};

export default StackScreenWithTitleLayout;
