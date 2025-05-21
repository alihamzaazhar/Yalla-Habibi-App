import debounce from "lodash.debounce";
import React, { useRef, useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { SearchInput } from "../shared/SearchInput";
import CarsData from "@/assets/cars.json";
import { Button } from "@/ui/Button";
import { cn } from "@/lib/common/utils";
import RectButton from "@/ui/RectButton";
type Props = {
  carType: string;
  selectedCarModel?: string;
  savedCarModel?: string;
  onCarModelSelect: (carModel: string) => void;
};

const SelectCarModelType = (props: Props) => {
  const { current: selectedCarModels } = useRef(
    CarsData.filter((car) => car.name === props.carType)?.[0]?.models ?? []
  );
  const [filteredModels, filterModels] = useState(selectedCarModels);

  return (
    <>
      <View className="p-4 flex-row justify-between">
        <SearchInput
          className="flex-1 h-14 text-xl"
          onChangeText={(t) =>
            debounce(
              () =>
                filterModels(
                  selectedCarModels.filter((car) =>
                    car.name.toLocaleLowerCase().includes(t.toLocaleLowerCase())
                  )
                ),
              150
            )()
          }
          placeholder="Search car types"
          style={{ fontSize: 16 }}
          iconSize={24}
        />
      </View>
      <ScrollView className="py-4">
        {filteredModels.map(({ name }, idx) => (
          <RectButton
            className={cn(
              "w-full items-start justify-between gap-4 px-8 py-5 border-b border-gray-200",
              props.selectedCarModel === name && "bg-gray-200",
              props.savedCarModel === name && "bg-primary"
            )}
            key={idx}
            onPress={() => props.onCarModelSelect(name)}
          >
            <Text
              className={cn(
                "text-muted-foreground font-medium",
                props.savedCarModel === name && "text-white"
              )}
            >
              {name}
            </Text>
          </RectButton>
        ))}
      </ScrollView>
    </>
  );
};

export default SelectCarModelType;
