import TabIconButton from "@/components/tabs/TabIconButton";
import { Theme } from "@/constants";
import {
  addSaturationAndCommasInHsl,
  humanizeString,
} from "@/lib/common/utils";
import { Tabs as TabsPrimitive } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

export const TAB_BAR_HEIGHT = 60;
const ACTIVE_TAB_COLOR = `hsl(${addSaturationAndCommasInHsl(
  Theme.colors.primary.DEFAULT,
  "60%"
)})`;

interface TabScreenProps {
  name: string;
  title?: string;
  icon: ({ color }: { color: string }) => React.ReactNode;
}

export const RentalTabLayout = (props: { screens: Array<TabScreenProps> }) => {
  return (
    <TabsPrimitive
      screenOptions={{
        tabBarActiveTintColor: ACTIVE_TAB_COLOR,
      }}
    >
      {props.screens.map(({icon,name,title = humanizeString(name)}) => (
        <TabsPrimitive.Screen
          name={name}
          key = {name}
          options={{
            title: title,
            headerShown:false,
            tabBarShowLabel: false,
            tabBarStyle: styles.tabBarStyle,
            tabBarIcon: ({ color }) => (
              <TabIconButton
                color={color}
                label={title}
                LabelIcon={icon({ color })}
              />
            ),
          }}
        />
      ))}
    </TabsPrimitive>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    paddingTop: 2,
    height: TAB_BAR_HEIGHT,
  },
});
