import BorderlessButton from "@/ui/BorderlessButton";
import React from "react";
import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

type Props<T> = {
  data: Array<T>;
  renderItem: React.ComponentPropsWithoutRef<typeof FlatList<T>>["renderItem"];
};

const MAX_ALWAYS_VISIBLE_ITEMS = 6;
const TruncatedFlatList = <T,>(props: Props<T>) => {
  const [isTruncated, setTruncated] = React.useState(true);
  const limitedData = props.data.slice(
    0,
    isTruncated ? MAX_ALWAYS_VISIBLE_ITEMS : undefined
  );
  return (
    <View className="flex items-center justify-center">
      <FlatList
        data={limitedData}
        numColumns={2}
        scrollEnabled={false}
        contentContainerClassName="gap-2"
        renderItem={props.renderItem}
        extraData={isTruncated}
      />
      {props.data.length > MAX_ALWAYS_VISIBLE_ITEMS ? (
        <View className="flex-row justify-between items-center pt-6 pb-4">
          <BorderlessButton onPress={() => setTruncated((prev) => !prev)}>
            <Text className="text-[#0082CE] font-medium">
              {isTruncated ? "Show More" : "Show Less"}
            </Text>
          </BorderlessButton>
        </View>
      ) : null}
    </View>
  );
};

export default TruncatedFlatList;
