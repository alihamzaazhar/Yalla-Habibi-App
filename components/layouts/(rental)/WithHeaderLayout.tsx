import { Href, useNavigation } from "expo-router";
import React, { PropsWithChildren, useLayoutEffect } from "react";
import Header from "./Header";
import { View, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  title: string;
  headerIconHref?: Href<string | object>;
};

const WithHeaderLayout = ({
  children,
  title,
  headerIconHref,
  ...props
}: ViewProps & Props) => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => <Header title={title} iconHref={headerIconHref} />,
    });
  });
  return <View {...props}>{children}</View>;
};

export default WithHeaderLayout;
