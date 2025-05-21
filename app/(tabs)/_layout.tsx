import { Tabs, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Theme } from "@/constants";
import { addSaturationAndCommasInHsl } from "@/lib/common/utils";
import TabIconButton from "@/components/tabs/TabIconButton";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useVendorMe } from "@/api/hooks/vendor/me/queries";

export const TAB_BAR_HEIGHT = 70;
export default function TabLayout() {
  const router = useRouter();
  const { isLoading, data: session } = useVendorMe();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: `hsl(${addSaturationAndCommasInHsl(
          Theme.colors.primary.DEFAULT,
          "60%"
        )})`,
        tabBarInactiveTintColor: Theme.slate[400],
        tabBarItemStyle:{
          margin:0,
          padding:0,


        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBarStyle,
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabIconButton
              color={color}
              label="Home"
              showSkeleton={isLoading}
              LabelIcon={<AntDesign name="home" color={color} size={24} />}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="premium-ads"
        options={{
          title: "Premium Ads",
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBarStyle,
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabIconButton
              color={color}
              label="Premium"
              showSkeleton={isLoading}
              LabelIcon={
                <MaterialCommunityIcons
                  name="crown-outline"
                  color={color}
                  size={24}
                />
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="place-add-hack"
        options={{
          title: "Sell",
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBarStyle,

          tabBarIcon: ({ color }) => (
            <TabIconButton
              color={color}
              label="SELL"
              LabelIcon={
                <View
                  className="justify-center items-center rounded-full bg-primary mb-1"
                  style={{ width: 24, height: 24 }}
                >
                  <Feather
                    name="plus"
                    size={16}
                    strokeWidth={2}
                    color={`hsl(${Theme.colors.primary.foreground})`}
                  />
                </View>
              }
              showSkeleton={isLoading}
            />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            if (!session) return router.navigate("/(auth)/sign-in");
            router.navigate("/(modals)/place-add");
          },
        }}
      />
      <Tabs.Screen
        name="my-ads"
        options={{
          title: "My Ads",
          tabBarStyle: [styles.tabBarStyle, { opacity: 0 }],
          tabBarIcon: ({ color }) => (
            <TabIconButton
              color={color}
              label="My Ads"
              showSkeleton={isLoading}
              LabelIcon={<FontAwesome5 name="ad" color={color} size={24} />}
            />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            if (!session) return router.navigate("/(auth)/sign-in");
            router.navigate("/(tabs)/my-ads");
          },
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBarStyle,
          tabBarIcon: ({ color }) => (
            <TabIconButton
              color={color}
              label="Menu"
              showSkeleton={isLoading}
              LabelIcon={<Entypo name="menu" color={color} size={24} />}
            />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            if (!session) return router.navigate("/(auth)/sign-in");
            router.navigate("/(tabs)/menu");
          },
        }}
      />
    </Tabs>
  );
}

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
