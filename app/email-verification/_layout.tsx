import NoHeaderLayout from "@/components/layouts/NoHeaderLayout";
import { Stack } from "expo-router";
import React from "react";

type Props = {};

const Layout = (props: Props) => {
  return (
    <NoHeaderLayout>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="get-otp" />
        <Stack.Screen name="success" />
      </Stack>
    </NoHeaderLayout>
  );
};

export default Layout;
