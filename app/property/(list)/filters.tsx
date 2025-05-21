import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import {
  EXTRA_FEATURES_ENUM,
  LISTED_BY_ENUM,
  PROPERTY_SALE_TYPE_ENUM,
} from "@/lib/property-ad/schemas";
import { useNavigation } from "expo-router";
import { SELECTED_CURRENCY } from "@/constants/currencies";
import RangeInputFilter from "@/components/property/filters/RangeInputFilter";
import SingleSelectFilter from "@/components/property/filters/SingleSelectFilter";
import MultiSelectFilter from "@/components/property/filters/MultiSelectFilter";
import CategoryFilter from "@/components/property/filters/CategoryFilter";
import FilterScreenLayout from "@/components/layouts/FilterScreenLayout";
import { usePropertiesFilter } from "@/lib/property-ad/context/properties-filter";
import { CITIES } from "@/constants/enums";
import PostedWithinDateFilter from "@/components/property/filters/PostedWithinDateFilter";

const PropertyFiltersModal = () => {
  const { filters, setFilters } = usePropertiesFilter((store) => store);
  const {
    selling_mode,
    city,
    category_id,
    is_ready_to_sell,
    price,
    area,
    bathroom_count,
    bedroom_count,
    listed_by,
    extra_features,
    is_furnished,
  } = filters;
  const navigation = useNavigation();

  return (
    <FilterScreenLayout
      onReset={() => {
        setFilters();
        navigation.goBack();
      }}
    >
      <ScrollView
        contentContainerClassName="bg-background gap-6 py-6"
        scrollEnabled
      >
        <SingleSelectFilter
          filter={selling_mode}
          setFilter={(selling_mode) =>
            setFilters({ selling_mode, category_id: undefined })
          }
          options={PROPERTY_SALE_TYPE_ENUM}
          title="What you Looking For"
        />
        <SingleSelectFilter
          filter={city}
          setFilter={(city) =>
            setFilters({
              city:
                city === "All" ? undefined : (city as (typeof CITIES)[number]),
            })
          }
          options={["All", ...CITIES]}
          title="City"
        />
        {selling_mode ? (
          <CategoryFilter
            selectedCategoryId={category_id}
            selectCategoryId={(category_id) => setFilters({ category_id })}
            selling_mode={selling_mode === "rent" ? "to-rent" : "to-sell"}
          />
        ) : null}
        {selling_mode !== "rent" ? (
          <SingleSelectFilter
            filter={
              is_ready_to_sell !== undefined ? is_ready_to_sell : undefined
            }
            setFilter={(is_ready_to_sell) => setFilters({ is_ready_to_sell })}
            options={[
              {
                label: "All",
                value: undefined,
              },
              {
                label: "Ready",
                value: true,
              },
              // {
              //   label: "Off Plan",
              //   value: false,
              // },
            ]}
            title="Completion Status"
          />
        ) : null}
        <RangeInputFilter
          filter={price}
          setFilter={(price) => setFilters({ price })}
          prefix={SELECTED_CURRENCY.symbol}
          decimal_digits={SELECTED_CURRENCY.decimal_digits}
          title="Price"
        />
        <RangeInputFilter
          filter={area}
          setFilter={(area) => setFilters({ area })}
          prefix="Sq Ft"
          title="Area"
        />
        <MultiSelectFilter
          filter={bedroom_count}
          setFilter={(bedroom_count) => setFilters({ bedroom_count })}
          options={Array.from({ length: 10 }, (_, i) => i + 1)}
          title="Bedrooms"
        />
        <MultiSelectFilter
          filter={bathroom_count}
          setFilter={(bathroom_count) => setFilters({ bathroom_count })}
          options={Array.from({ length: 10 }, (_, i) => i + 1)}
          title="Bathrooms"
        />
        <MultiSelectFilter
          filter={extra_features}
          setFilter={(extra_features) => setFilters({ extra_features })}
          options={EXTRA_FEATURES_ENUM}
          title="Amenities"
        />
        <SingleSelectFilter
          filter={is_furnished !== undefined ? is_furnished : undefined}
          setFilter={(is_furnished) => setFilters({ is_furnished })}
          options={[
            {
              label: "Furnished",
              value: true,
            },
            {
              label: "Not Furnished",
              value: false,
            },
          ]}
          title="Furnished"
        />
        <MultiSelectFilter
          filter={listed_by}
          setFilter={(listed_by) => setFilters({ listed_by })}
          options={LISTED_BY_ENUM}
          title="Listed By"
        />
        <PostedWithinDateFilter
          filter={filters.created_at}
          setFilter={(created_at) => setFilters({ created_at })}
        />
      </ScrollView>
    </FilterScreenLayout>
  );
};

export default PropertyFiltersModal;
