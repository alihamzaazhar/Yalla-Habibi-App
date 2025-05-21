import { Link, useNavigation } from "expo-router";
import React, { memo, useCallback } from "react";
import { ScrollView } from "react-native-gesture-handler";
import {
  BIKE_FINAL_DRIVE_SYSTEM,
  BIKE_WHEELS,
  MOTOR_BODY_TYPE,
  MOTOR_CATEGORIES_HANDLES,
  MOTOR_DRIVE_SYSTEM,
  MOTOR_FUEL_TYPE,
  MOTOR_STEERING_SIDE,
  MOTOR_TRANSMISSION_TYPE,
} from "@/lib/motors-ad/constants";
import FilterScreenLayout from "@/components/layouts/FilterScreenLayout";
import SingleSelectFilter from "@/components/property/filters/SingleSelectFilter";
import MultiSelectFilter from "@/components/property/filters/MultiSelectFilter";
import RangeInputFilter from "@/components/property/filters/RangeInputFilter";
import { SELECTED_CURRENCY } from "@/constants/currencies";
import { useMotorAdsFilter } from "@/lib/motors-ad/context/motor-ad-filters-context";
import { Dimensions, Text, View } from "react-native";
import SearchInputPlaceholder from "@/components/shared/SearchInputPlaceholder";
import { useGlobalMetaData } from "@/contexts/GlobalMetaDataContext";
import { Category } from "@/api/types";
import { CITIES } from "@/constants/enums";
import Tag from "@/ui/atoms/Tag";
import PostedWithinDateFilter from "@/components/property/filters/PostedWithinDateFilter";
import AmountInput from "@/ui/AmountInput";

const BikesFilters = () => {
  const { filters, setFilters } = useMotorAdsFilter((state) => state);
  const { metadata } = useGlobalMetaData();

  const RootCategory = filters.categories?.[0]
    ? (metadata[filters.categories?.[0]] as Category)
    : undefined;
  const firstChildCategory = filters.categories?.[1]
    ? (metadata[filters.categories?.[1]] as Category)
    : undefined;
  const secondChildCategory = filters.categories?.[2]
    ? (metadata[filters.categories?.[2]] as Category)
    : undefined;
  return (
    <>
      <SingleSelectFilter
        filter={filters.city}
        setFilter={(city) => setFilters({ city })}
        options={CITIES}
        title="City"
      />
      <View className="px-4 gap-2">
        <Text className="text-lg font-medium">{"Make or Model"}</Text>
        <View className="gap-4">
          <Link href={"/motor-ad/(list)/filters/search-categories"} asChild>
            <SearchInputPlaceholder
              placeholder={`Search ${
                RootCategory?.name ?? ""
              } by Make or Model`}
            />
          </Link>
          <View className="flex-row gap-2">
            {RootCategory ? <Tag label={RootCategory.name} /> : null}
            {RootCategory && firstChildCategory ? (
              <Tag
                label={firstChildCategory.name}
                onClear={() => setFilters({ categories: [RootCategory?.id] })}
              />
            ) : null}
            {RootCategory && firstChildCategory && secondChildCategory ? (
              <Tag
                label={secondChildCategory.name}
                onClear={() =>
                  setFilters({
                    categories: [RootCategory?.id, firstChildCategory?.id],
                  })
                }
              />
            ) : null}
          </View>
        </View>
      </View>
      <SingleSelectFilter
        filter={filters.final_drive_system}
        setFilter={(final_drive_system) => setFilters({ final_drive_system })}
        options={BIKE_FINAL_DRIVE_SYSTEM}
        title="Final Drive System"
      />
      <SingleSelectFilter
        filter={filters.wheels}
        setFilter={(wheels) => setFilters({ wheels })}
        options={BIKE_WHEELS}
        title="Wheels"
      />
      <SingleSelectFilter
        filter={filters.has_warranty}
        setFilter={(has_warranty) => setFilters({ has_warranty })}
        options={[
          {
            label: "Yes",
            value: true,
          },
          {
            label: "No",
            value: false,
          },
        ]}
        title="Has Warranty"
      />
      <RangeInputFilter
        filter={filters.price}
        setFilter={(price) => setFilters({ price })}
        prefix={SELECTED_CURRENCY.symbol}
        decimal_digits={SELECTED_CURRENCY.decimal_digits}
        title="Price"
      />
      <RangeInputFilter
        filter={filters.year}
        setFilter={(year) => setFilters({ year })}
        prefix="Year"
        title="Year"
      />
      <RangeInputFilter
        filter={filters.kilometer}
        setFilter={(kilometer) => setFilters({ kilometer })}
        prefix="KM"
        title="Kilometer"
      />
      <PostedWithinDateFilter
        filter={filters.created_at}
        setFilter={(created_at) => setFilters({ created_at })}
      />
    </>
  );
};

const NumberPlateFilters = () => {
  const { filters, setFilters } = useMotorAdsFilter((state) => state);
  return (
    <>
      <SingleSelectFilter
        filter={filters.city}
        setFilter={(city) => setFilters({ city })}
        options={CITIES}
        title="City"
      />

      <RangeInputFilter
        filter={filters.price}
        setFilter={(price) => setFilters({ price })}
        prefix={SELECTED_CURRENCY.symbol}
        decimal_digits={SELECTED_CURRENCY.decimal_digits}
        title="Price"
      />

      <PostedWithinDateFilter
        filter={filters.created_at}
        setFilter={(created_at) => setFilters({ created_at })}
      />
    </>
  );
};

const HeavyVehiclesFilters = () => {
  const { filters, setFilters } = useMotorAdsFilter((state) => state);
  return (
    <>
      <SingleSelectFilter
        filter={filters.city}
        setFilter={(city) => setFilters({ city })}
        options={CITIES}
        title="City"
      />

      <RangeInputFilter
        filter={filters.price}
        setFilter={(price) => setFilters({ price })}
        prefix={SELECTED_CURRENCY.symbol}
        decimal_digits={SELECTED_CURRENCY.decimal_digits}
        title="Price"
      />

      <PostedWithinDateFilter
        filter={filters.created_at}
        setFilter={(created_at) => setFilters({ created_at })}
      />
    </>
  );
};
const CarsFilters = () => {
  const { filters, setFilters } = useMotorAdsFilter((state) => state);
  const { metadata } = useGlobalMetaData();

  const RootCategory = filters.categories?.[0]
    ? (metadata[filters.categories?.[0]] as Category)
    : undefined;
  const firstChildCategory = filters.categories?.[1]
    ? (metadata[filters.categories?.[1]] as Category)
    : undefined;
  const secondChildCategory = filters.categories?.[2]
    ? (metadata[filters.categories?.[2]] as Category)
    : undefined;
  return (
    <>
      <SingleSelectFilter
        filter={filters.city}
        setFilter={(city) => setFilters({ city })}
        options={CITIES}
        title="City"
      />
      <View className="px-4 gap-2">
        <Text className="text-lg font-medium">{"Make or Model"}</Text>
        <View className="gap-4">
          <Link href={"/motor-ad/(list)/filters/search-categories"} asChild>
            <SearchInputPlaceholder
              placeholder={`Search ${
                RootCategory?.name ?? ""
              } by Make or Model`}
            />
          </Link>
          <View className="flex-row gap-2">
            {RootCategory ? <Tag label={RootCategory.name} /> : null}
            {RootCategory && firstChildCategory ? (
              <Tag
                label={firstChildCategory.name}
                onClear={() => setFilters({ categories: [RootCategory?.id] })}
              />
            ) : null}
            {RootCategory && firstChildCategory && secondChildCategory ? (
              <Tag
                label={secondChildCategory.name}
                onClear={() =>
                  setFilters({
                    categories: [RootCategory?.id, firstChildCategory?.id],
                  })
                }
              />
            ) : null}
          </View>
        </View>
      </View>

      <SingleSelectFilter
        filter={filters.body_type}
        setFilter={(body_type) => setFilters({ body_type })}
        options={MOTOR_BODY_TYPE}
        title="Body Type"
      />
      <SingleSelectFilter
        filter={filters.fuel_type}
        setFilter={(fuel_type) => setFilters({ fuel_type })}
        options={MOTOR_FUEL_TYPE}
        title="Fuel Type"
      />
      <SingleSelectFilter
        filter={filters.transmission_type}
        setFilter={(transmission_type) => setFilters({ transmission_type })}
        options={MOTOR_TRANSMISSION_TYPE}
        title="Transmission Type"
      />
      <MultiSelectFilter
        filter={filters.doors_count}
        setFilter={(doors_count) => setFilters({ doors_count })}
        options={Array.from({ length: 10 }, (_, i) => i + 1)}
        title="Doors Count"
      />
      <MultiSelectFilter
        filter={filters.cylinder_count}
        setFilter={(cylinder_count) => setFilters({ cylinder_count })}
        options={Array.from({ length: 10 }, (_, i) => i + 1)}
        title="Cylinder Count"
      />

      <MultiSelectFilter
        filter={filters.seats_count}
        setFilter={(seats_count) => setFilters({ seats_count })}
        options={Array.from({ length: 10 }, (_, i) => i + 1)}
        title="Seats Count"
      />
      <SingleSelectFilter
        filter={filters.drive_system}
        setFilter={(drive_system) => setFilters({ drive_system })}
        options={MOTOR_DRIVE_SYSTEM}
        title="Drive System"
      />
      <SingleSelectFilter
        filter={filters.steering_side}
        setFilter={(steering_side) => setFilters({ steering_side })}
        options={MOTOR_STEERING_SIDE}
        title="Steering Side"
      />
      <RangeInputFilter
        filter={filters.price}
        setFilter={(price) => setFilters({ price })}
        prefix={SELECTED_CURRENCY.symbol}
        decimal_digits={SELECTED_CURRENCY.decimal_digits}
        title="Price"
      />

      <RangeInputFilter
        filter={filters.year}
        setFilter={(year) => setFilters({ year })}
        prefix="Year"
        title="Year"
      />
      <RangeInputFilter
        filter={filters.kilometer}
        setFilter={(kilometer) => setFilters({ kilometer })}
        prefix="KM"
        title="Kilometer"
      />
      <SingleSelectFilter
        filter={filters.has_insurance}
        setFilter={(has_insurance) => setFilters({ has_insurance })}
        options={[
          {
            label: "Yes",
            value: true,
          },
          {
            label: "No",
            value: false,
          },
        ]}
        title="Has Insurance"
      />
      <PostedWithinDateFilter
        filter={filters.created_at}
        setFilter={(created_at) => setFilters({ created_at })}
      />
    </>
  );
};
const BoatsFilters = () => {
  const { filters, setFilters } = useMotorAdsFilter((state) => state);
  return (
    <>
      <SingleSelectFilter
        filter={filters.city}
        setFilter={(city) => setFilters({ city })}
        options={CITIES}
        title="City"
      />

      <RangeInputFilter
        filter={filters.price}
        setFilter={(price) => setFilters({ price })}
        prefix={SELECTED_CURRENCY.symbol}
        decimal_digits={SELECTED_CURRENCY.decimal_digits}
        title="Price"
      />

      <PostedWithinDateFilter
        filter={filters.created_at}
        setFilter={(created_at) => setFilters({ created_at })}
      />
    </>
  );
};

const AutoAccessoriesPartsFilters = () => {
  const { filters, setFilters } = useMotorAdsFilter((state) => state);
  return (
    <>
      <SingleSelectFilter
        filter={filters.city}
        setFilter={(city) => setFilters({ city })}
        options={CITIES}
        title="City"
      />

      <RangeInputFilter
        filter={filters.price}
        setFilter={(price) => setFilters({ price })}
        prefix={SELECTED_CURRENCY.symbol}
        decimal_digits={SELECTED_CURRENCY.decimal_digits}
        title="Price"
      />

      <PostedWithinDateFilter
        filter={filters.created_at}
        setFilter={(created_at) => setFilters({ created_at })}
      />
    </>
  );
};

const MotorFiltersModal = () => {
  const { filters, setFilters } = useMotorAdsFilter((state) => state);
  const navigation = useNavigation();
  const { metadata } = useGlobalMetaData();

  const RootCategory = filters.categories?.[0]
    ? (metadata[filters.categories?.[0]] as Category)
    : undefined;

  const SelectFilterComponent = useCallback(() => {
    if (!RootCategory) return null;
    if (
      RootCategory.handle.includes(
        MOTOR_CATEGORIES_HANDLES["cars-motor-ad-categories"]
      )
    ) {
      return <CarsFilters />;
    }
    if (
      RootCategory.handle.includes(
        MOTOR_CATEGORIES_HANDLES["motorcycles-motor-ad-categories"]
      )
    ) {
      return <BikesFilters />;
    } else if (
      RootCategory.handle.includes(
        MOTOR_CATEGORIES_HANDLES["auto-accessories-parts-motor-ad-categories"]
      )
    ) {
      return <AutoAccessoriesPartsFilters />;
    } else if (
      RootCategory.handle.includes(
        MOTOR_CATEGORIES_HANDLES["boats-motor-ad-categories"]
      )
    ) {
      return <BoatsFilters />;
    } else if (
      RootCategory.handle.includes(
        MOTOR_CATEGORIES_HANDLES["heavy-vehicles-motor-ad-categories"]
      )
    ) {
      return <HeavyVehiclesFilters />;
    } else if (
      RootCategory.handle.includes(
        MOTOR_CATEGORIES_HANDLES["number-plates-motor-ad-categories"]
      )
    ) {
      return <NumberPlateFilters />;
    }
    return null;
  }, [RootCategory]);

  return (
    <FilterScreenLayout
      onReset={() => {
        setFilters(undefined);
        navigation.goBack();
      }}
    >
      <ScrollView
        contentContainerClassName="bg-background gap-5 py-4"
        contentContainerStyle={{
          minHeight: Dimensions.get("window").height,
        }}
      >
        <SelectFilterComponent />
      </ScrollView>
    </FilterScreenLayout>
  );
};

export default MotorFiltersModal;
