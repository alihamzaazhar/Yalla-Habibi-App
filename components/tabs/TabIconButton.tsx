import { Theme } from "@/constants";
import BorderlessButton from "@/ui/BorderlessButton";
import { Button } from "@/ui/Button";
import { Skeleton } from "@/ui/Skeleton";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  LabelIcon: React.ReactNode;
  color: string;
  showSkeleton?: boolean;
};

const TabIconButton = ({ color, label, LabelIcon, showSkeleton }: Props) => {
  if (showSkeleton) {
    return (
      <View className="gap-1 items-center">
        <Skeleton className="w-9 h-9" />
        <Skeleton className="w-12 h-2" />
      </View>
    );
  }
  return (
    <BorderlessButton
      ButtonProps={{
        style: {
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          borderRadius: 400,
          paddingHorizontal: 0,
          alignSelf:'stretch',
          paddingVertical: 0,
        },
        rippleColor: Theme.slate[200],
      }}
      className="flex-col items-center p-0 m-0"
      
    >
      {LabelIcon}
      <Text
        className={`text-sm`}
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{ color }}
      >
        {label}
      </Text>
    </BorderlessButton>
  );
};

export default TabIconButton;
