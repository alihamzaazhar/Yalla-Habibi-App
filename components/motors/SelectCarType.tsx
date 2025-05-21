import debounce from "lodash.debounce";
import React, { useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { SearchInput } from "../shared/SearchInput";
import CarsData from "@/assets/cars.json";
import { Button } from "@/ui/Button";
import { cn } from "@/lib/common/utils";
import RectButton from "@/ui/RectButton";
const allCarsNames = CarsData.map((car) => car.name);

type Props = {
  onCarTypeSelect: (carName: string) => void;
  selectedCarName?: string;
  savedCarName?: string;
};

const SelectCarType = (props: Props) => {
  const [carFilters, setCarFilters] = useState(allCarsNames);

  return (
    <>
      <View className="p-4 flex-row justify-between">
        <SearchInput
          className="flex-1 h-14 text-xl"
          onChangeText={(t) =>
            debounce(
              () =>
                setCarFilters(
                  allCarsNames.filter((car) =>
                    car.toLocaleLowerCase().includes(t.toLocaleLowerCase())
                  )
                ),
              150
            )()
          }
          placeholder="Search car models"
          style={{ fontSize: 16 }}
          iconSize={24}
        />
      </View>
      <ScrollView className="py-4">
        {carFilters.map((carName, idx) => (
          <RectButton
            className={cn(
              "w-full items-start justify-between gap-4 px-8 py-5 border-b border-gray-200",
              props.selectedCarName === carName && "bg-gray-200",
              props.savedCarName === carName && "bg-primary",
              
            )}
            key={idx}
            onPress={() => props.onCarTypeSelect(carName)}
          >
            <Text
              className={cn(
                "text-muted-foreground font-medium",
                props.savedCarName === carName && "text-white"
              )}
            >
              {carName}
            </Text>
          </RectButton>
        ))}
      </ScrollView>
    </>
  );
};

export default SelectCarType;
