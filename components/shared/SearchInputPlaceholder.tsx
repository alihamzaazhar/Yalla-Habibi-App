import { forwardRef } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Theme } from "@/constants";
import { Skeleton } from "@/ui/Skeleton";

const SearchInputPlaceholder = forwardRef<
  React.ElementRef<typeof Pressable>,
  React.ComponentPropsWithoutRef<typeof Pressable> & { placeholder?: string }
>(({ placeholder, ...props }, ref) => {
  return (
    <Pressable className="relative" ref={ref} {...props}>
      <MaterialIcons
        name="search"
        style={{
          position: "absolute",
          top: "28%",
          left: 12,
          zIndex:20
        }}
        size={22}
        color={Theme.slate[400]}
      />
      <View
        className={
          "border border-slate-300 bg-slate-100 pl-12 pr-3 h-14 rounded-md justify-center"
        }
      >
        <Text className="text-slate-400">{placeholder}</Text>
      </View>
    </Pressable>
  );
});

export const SearchInputPlaceholderSkeleton = () => {
  return (
    <View className="relative">
      <Skeleton
        className={
          "border border-border pl-12 pr-3 h-12 rounded-md justify-center"
        }
      />
    </View>
  );
};

export default SearchInputPlaceholder;
