import debounce from "lodash.debounce";
import React, { useState } from "react";
import { View, ScrollView, Text, ActivityIndicator } from "react-native";
import { SearchInput } from "../shared/SearchInput";
import { cn } from "@/lib/common/utils";
import RectButton from "@/ui/RectButton";
import { useMotorsCategories } from "@/api/hooks/marketplace/services/motors/queries";
import { Theme } from "@/constants";
import { Category } from "@/api/types";

type Props = {
  onCategorySelect: (category: Category, has_children?: boolean) => void;
  selectedCatageoryId?: string;
  savedCategoryId?: string;
  rootCategoryId: string;
  allOption?: boolean;
  onAllOptionSelect?: () => void;
};

const SelectNestedCategory_ = (props: Props & { q?: string }) => {
  const { data, status } = useMotorsCategories({
    parent_category_id: props.rootCategoryId,
    q: props.q,
  });

  if (status === "loading")
    return (
      <View className="p-4 flex justify-center items-center">
        <ActivityIndicator size={"large"} color={Theme.slate[600]} />
      </View>
    );

  if (status === "error")
    return (
      <View className="p-4 flex justify-center items-center">
        <Text>Error...</Text>
      </View>
    );
  if (!data) return null;
  return (
    <ScrollView className="py-4">
      {props.allOption && (
        <RectButton
          className={cn(
            "w-full items-start justify-between gap-4 px-8 py-5 border-b border-gray-200",
            props.selectedCatageoryId === props.rootCategoryId && "bg-gray-200"
          )}
          onPress={props.onAllOptionSelect}
        >
          <Text
            className={cn(
              "text-muted-foreground font-medium",
              props.selectedCatageoryId === props.rootCategoryId && "text-white"
            )}
          >
            All
          </Text>
        </RectButton>
      )}
      {data.motorAdsCategories.map((cat, idx) => (
        <RectButton
          className={cn(
            "w-full items-start justify-between gap-4 px-8 py-5 border-b border-gray-200",
            props.selectedCatageoryId === cat.id && "bg-gray-200",
            props.savedCategoryId === cat.id && "bg-primary"
          )}
          key={idx}
          onPress={() =>
            props.onCategorySelect(cat, Boolean(cat.category_children?.length))
          }
        >
          <Text
            className={cn(
              "text-muted-foreground font-medium",
              props.savedCategoryId === cat.id && "text-white"
            )}
          >
            {cat.name}
          </Text>
        </RectButton>
      ))}
    </ScrollView>
  );
};

const SelectNestedCategory = (props: Props) => {
  const [q, setQ] = useState<string | undefined>(undefined);

  return (
    <>
      <View className="p-4 flex-row justify-between">
        <SearchInput
          className="flex-1 h-14 text-xl"
          onChangeText={(t) => debounce(() => setQ(t), 150)()}
          placeholder="Search"
          style={{ fontSize: 16 }}
          iconSize={24}
        />
      </View>
      <SelectNestedCategory_ q={q} {...props} />
    </>
  );
};

export default SelectNestedCategory;
