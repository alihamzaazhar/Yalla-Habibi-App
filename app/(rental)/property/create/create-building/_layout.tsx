import React from "react";
import { Stack } from "expo-router";
import NoHeaderLayout from "@/components/layouts/NoHeaderLayout";

const CreateBuildingLayout = () => {
  return (
    <NoHeaderLayout>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="add-location" />
      </Stack>
    </NoHeaderLayout>
  );
};

export default CreateBuildingLayout;
