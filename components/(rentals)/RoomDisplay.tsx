import { Theme } from "@/constants";
import { formatPrice } from "@/lib/common/prices";
import { cn, humanizeString } from "@/lib/common/utils";
import { Button } from "@/ui/Button";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useCallback, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useBottomSheetImperative } from "../shared/BottomSheetModal";
import RoomInputForm, { RoomInputFormSchema } from "./RoomInputForm";
import * as z from "zod";
import Animated, {
  runOnJS,
  useAnimatedReaction,
} from "react-native-reanimated";
import { AccordionTrigger } from "@/ui/Accordion";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import RippleButton from "@/ui/animations/RippleButton";
import BorderlessButton from "@/ui/BorderlessButton";
import Entypo from "@expo/vector-icons/Entypo";
import RectButton from "@/ui/RectButton";
import {
  BottomSheetBackdrop,
  BottomSheetModal as BottomSheetModalPrimitive,
} from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

type Props = {
  name: string;
  rent_per_month: number;
  type: "room" | "partition" | "bed";
  subType?: "room"| "partition" | "bed";
  parent_crumbs: Array<string>;
  has_children: boolean;
  subActionTitle?: string;
  badgeClassName?: string;
  onSubAction?: (values: z.infer<typeof RoomInputFormSchema>) => void;
  onUpdate?: (values: z.infer<typeof RoomInputFormSchema>) => void;
  onDelete?: () => void;
};
const BadgeColor = {
  room: "bg-gray-400",
  partition: "bg-orange-400",
  bed: "bg-red-400",
};
const RoomDisplay = ({
  name,
  parent_crumbs,
  type,
  subType = "room",
  has_children,
  rent_per_month,
  badgeClassName = `${BadgeColor[type]}`,
  subActionTitle,
  onSubAction,
  onUpdate,
  onDelete,
}: Props) => {
  const [otherActions, setOtherActionsVisibility] = useState(false);
  const addMoreSubSpaceModal = useBottomSheetImperative({
    content: (onClose) => {
      return (
        <View className="px-4 gap-2 flex-1">
          {parent_crumbs.length ? (
            <View className="gap-1 flex-row items-center">
              {parent_crumbs.map((crumb) => (
                <View key={crumb} className="flex-row items-center gap-1">
                  <Text>{crumb}</Text>
                  <Text>/</Text>
                </View>
              ))}
            </View>
          ) : null}
          <RoomInputForm
            type={subType}            
            onSave={(values) => {
              onSubAction?.(values);
              onClose();
            }}
          />
        </View>
      );
    },
    trigger: (onOpen) => {
      if (onSubAction) {
        return (
          <Button
            variant={"ghost"}
            className="items-center justify-center rounded-full gap-2 px-2 py-2 h-auto"
            rippleClassName="bg-blue-200"
            onPress={() => onOpen()}
          >
            <Feather name="plus" size={16} color={`${Theme.blue[600]}`} />
            <Text className="text-blue-600 text-center font-semibold text-sm">
              {subActionTitle ?? "Add"}
            </Text>
          </Button>
        );
      }
      return null;
    },
  });

  const containerRef = useRef<BottomSheetModalMethods | null>(null);
  const snapPoints = useRef(["25%", "40%", "100%"]);
  const renderBackDrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );
  const closeModal = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.dismiss();
    }
  }, []);

  const openModal = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.present();
    }
  }, []);
  return (
    <>
      <View className="flex-row items-center justify-center">
        <RectButton
          ButtonProps={{
            onLongPress: () => setOtherActionsVisibility(true),
            style:[{
                flex: 1,
            }]
          }}
          className="flex-1"
          onPress={() => {
            otherActions ? setOtherActionsVisibility(false) : openModal();
          }}
        >
          <View className="border-b flex-1 pt-2 pb-4 border-b-gray-300 flex-row justify-between items-center">
            <View className="gap-2 flex-row items-center">
              {has_children ? (
                <View className="flex-row items-center gap-1">
                  <AccordionTrigger />
                </View>
              ) : null}
              <View style={{
                paddingHorizontal: has_children ? 0 : 16,
              }}>
                <Text className="text-lg font-semibold">{name}</Text>
                <View className="flex-row gap-2 items-center">
                  <View
                    className={cn("rounded-md", badgeClassName)}
                    style={{ paddingHorizontal: 4, paddingVertical: 0.5 }}
                  >
                    <Text style={{ fontSize: 12 }} className="text-muted">
                      {humanizeString(type)}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <FontAwesome
                      name="money"
                      color={`${Theme.green[600]}`}
                      size={16}
                    />
                    <Text className="text-green-600 font-semibold text-sm">
                      {formatPrice({
                        amount: rent_per_month,
                        currency_code: "aed",
                      })}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View className="flex-row items-center gap-2">
              {addMoreSubSpaceModal}
            </View>
          </View>
        </RectButton>
        {otherActions ? (
          <View className="flex flex-row items-center justify-between px-4">
            <BorderlessButton
              onPress={() => {
                setOtherActionsVisibility(false);
                onDelete?.();
              }}
            >
              <FontAwesome name="trash" color={`${Theme.red[600]}`} size={20} />
            </BorderlessButton>
          </View>
        ) : null}
      </View>
      <BottomSheetModalPrimitive
        ref={containerRef}
        index={1}
        snapPoints={snapPoints.current}
        backdropComponent={renderBackDrop}
        stackBehavior="push"
      >
        <View className="px-4 gap-2 flex-1">
          {parent_crumbs.length ? (
            <View className="gap-1 flex-row items-center">
              {parent_crumbs.map((crumb) => (
                <View key={crumb} className="flex-row items-center gap-1">
                  <Text>{crumb}</Text>
                  <Text>/</Text>
                </View>
              ))}
            </View>
          ) : null}
          <RoomInputForm
            type={type}
            defaultValues={{
              name: name,
              rent_per_month: rent_per_month,
            }}
            onSave={(values) => {
              onUpdate?.(values);
              setOtherActionsVisibility(false);
              closeModal();
            }}
          />
        </View>
      </BottomSheetModalPrimitive>
    </>
  );
};

export default RoomDisplay;
