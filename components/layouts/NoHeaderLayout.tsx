import { useNavigation } from "expo-router";
import React, { PropsWithChildren, useLayoutEffect } from "react";


const NoHeaderLayout = (props: PropsWithChildren) => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return <>{props.children}</>;
};

export default NoHeaderLayout;
