import { useDeleteExpenseCategory } from "@/api/hooks/expense/mutations";
import { UseGetExpenseCategoriesData } from "@/api/hooks/expense/queries";
import { useRentalBuildings } from "@/api/hooks/rental-properties/queries";
import { Theme } from "@/constants";
import BorderlessButton from "@/ui/BorderlessButton";
import RectButton from "@/ui/RectButton";
import Feather from "@expo/vector-icons/Feather";
import { formatDate } from "date-fns";
import React from "react";
import { FlatListProps, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Reanimated from "react-native-reanimated";

type Props = Parameters<
  NonNullable<
    FlatListProps<
      NonNullable<UseGetExpenseCategoriesData>["pages"][number]["expenseCategories"][number]
    >["renderItem"]
  >
>[0] & {
  onPress: () => void;
};

const CategoryItem = ({
  item: category,
  onPress,
}: Omit<Props, "separators">) => {
  const { mutate: deleteCategory, isLoading: isDeleting } =
    useDeleteExpenseCategory();
  return (
    <View className="flex flex-row items-center justify-center">
      <Swipeable
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        containerStyle={{
          flex: 1,
        }}
        renderRightActions={() => (
          <Reanimated.View className={"flex items-center justify-center px-4"}>
            <BorderlessButton
              ButtonProps={{ rippleColor: Theme.red[200] }}
              isLoading={isDeleting}
              onPress={() => deleteCategory(category.id)}
            >
              <Feather name="trash-2" size={20} color={Theme.red[600]} />
            </BorderlessButton>
          </Reanimated.View>
        )}
      >
        <RectButton
          onPress={onPress}
          className="flex-row bg-white rounded-md p-4 justify-between"
        >
          <Text>{category.name}</Text>
          <Text className="text-sm font-medium text-muted-foreground">
            {formatDate(new Date(category.created_at), "MMM yyyy")}
          </Text>
        </RectButton>
      </Swipeable>
    </View>
  );
};

export default CategoryItem;
