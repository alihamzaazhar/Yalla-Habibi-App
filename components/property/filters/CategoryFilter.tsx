import {
  usePropertiesCategories,
  usePropertiesCategory,
} from "@/api/hooks/marketplace/services/properties/queries";
import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import SingleSelectFilter from "./SingleSelectFilter";
import { ChipsSelectSkeleton } from "@/ui/ChipsSelect";
import { Skeleton } from "@/ui/Skeleton";
import { NonUndefined } from "react-hook-form";
interface SubCategoryFilterProps {
  parentCategoryId: string;
  parentCategoryName: string;
  filter?: string;
  setFilter: (v: string) => void;
}
const SubCategoryFilter = (props: SubCategoryFilterProps) => {
  const { data, status } = usePropertiesCategory(props.parentCategoryId);
  if (status === "error") return null;
  if (status === "loading")
    return (
      <View className="gap-2">
        <Skeleton style={{ height: 24, width: 80 }} />
        <ChipsSelectSkeleton />
      </View>
    );
  if (!data.propertyCategory.category_children.length) return null;
  const allOption = [
    {
      label: "All",
      value: props.parentCategoryId,
    },
  ];
  const categoryOptions = data.propertyCategory.category_children.map((c) => ({
    label: c.name,
    value: c.id,
  }));
  return (
    <SingleSelectFilter
      filter={props.filter ?? props.parentCategoryId}
      setFilter={(v) => props.setFilter(v ?? "")}
      options={[...allOption, ...categoryOptions]}
      title={props.parentCategoryName + " Categories"}
      clearable={false}
    />
  );
};

type Props = {
  selectedCategoryId?: string;
  selectCategoryId: (v: string | undefined) => void;
  selling_mode: "to-rent" | "to-sell";
};
type CategoryType = NonUndefined<
  ReturnType<typeof usePropertiesCategories>["data"]
>["propertyCategories"][number];

const CategoryFilter_ = ({
  categories,
  selectCategoryId,
  selectedCategoryId,
}: Omit<Props, "selling_mode"> & { categories: CategoryType[] }) => {
  const allCategories = useMemo(() => {
    return categories
      .map((c) =>
        c.category_children
          ? [{ ...c, parent_category_id: null }, ...c.category_children]
          : [{ ...c, parent_category_id: null }]
      )
      .flat() as Array<CategoryType>;
  }, [categories]);
  const selectedCategory = allCategories.find(
    (c) => c.id === selectedCategoryId
  );
  const selectedParentCategory = selectedCategory?.parent_category_id
    ? categories.find((c) => c.id === selectedCategory.parent_category_id)
    : selectedCategory;

  const selectedChildCategory =
    selectedCategory?.parent_category_id === null ? null : selectedCategory;
  const parentCategoryOptions = categories.map((c) => ({
    label: c.name,
    value: c.id,
  }));
  const childrenCategoriesOptionsToShow = (
    selectedParentCategory?.category_children ?? []
  ).map((o) => ({
    label: o.name,
    value: o.id,
  }));
  return (
    <View className="gap-4">
      <SingleSelectFilter
        filter={selectedParentCategory?.id}
        setFilter={(v) => {
          selectCategoryId(v ?? "");
        }}
        options={[
          { value: undefined as string | undefined, label: "All" },
        ].concat(parentCategoryOptions)}
        title="Property Type"
      />
      {childrenCategoriesOptionsToShow.length ? (
        <SingleSelectFilter
          filter={selectedChildCategory?.id ?? selectedParentCategory?.id}
          setFilter={(v) => {
            selectCategoryId(
              typeof v === "string"
                ? v
                : selectedParentCategory?.id ?? undefined
            );
          }}
          options={[
            {
              label: "All",
              value: selectedParentCategory?.id,
            },
            ...childrenCategoriesOptionsToShow,
          ]}
          clearable={false}
          title={selectedParentCategory?.name + " Categories"}
        />
      ) : null}
    </View>
  );
};

const CategoryFilter = ({ selling_mode, ...props }: Props) => {
  const { data, status } = usePropertiesCategories({
    parent_type: selling_mode,
  });

  if (status === "error") return null;
  if (status === "loading") return <CategoryFilterSkeleton />;
  if (data.propertyCategories.length === 0) return null;

  return <CategoryFilter_ {...props} categories={data.propertyCategories} />;
};

const CategoryFilterSkeleton = () => {
  return (
    <View className="gap-6">
      <View className="gap-2 px-4">
        <Skeleton style={{ height: 24, width: 80 }} />
        <ChipsSelectSkeleton />
      </View>
      <View className="gap-2 px-4">
        <Skeleton style={{ height: 24, width: 80 }} />
        <ChipsSelectSkeleton />
      </View>
    </View>
  );
};
export default CategoryFilter;
