import { useToggleFavourite } from "@/api/hooks/favourite/mutations";
import { useVendorMe } from "@/api/hooks/vendor/me/queries";
import { Theme } from "@/constants";
import { cn } from "@/lib/common/utils";
import BorderlessButton from "@/ui/BorderlessButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

type Props = {
  id: string;
  type: string;
  isFavourite: boolean;
  className?: string;
};

export const FavouriteButtonLarge = (props: Props) => {
  const { data } = useVendorMe();
  const { mutate, status } = useToggleFavourite();
  if (!data) return null;
  return (
    <BorderlessButton
      onStartShouldSetResponder={(event) => true}
      onTouchEnd={(e) => {
        e.stopPropagation();
      }}
      ButtonProps={{
        style: {
          backgroundColor: "white",
          borderRadius: 20,
          paddingHorizontal: 0,
          paddingVertical: 0,
        },
      }}
      onPress={() =>
        mutate({
          entity_type: props.type,
          entity_id: props.id,
        })
      }
      className={cn("rounded-full p-2", props.className)}
    >
      {status === "loading" ? (
        <ActivityIndicator color={`${Theme.slate[400]}`} />
      ) : props.isFavourite ? (
        <AntDesign
          name={"heart"}
          size={20}
          color={`hsl(${Theme.colors.primary.DEFAULT})`}
        />
      ) : (
        <AntDesign name={"hearto"} size={20} color={Theme.slate[400]} />
      )}
    </BorderlessButton>
  );
};

export const FavouriteButtonSmall = (props: Props) => {
  const { data } = useVendorMe();
  const { mutate, status } = useToggleFavourite();
  if (!data) return null;

  return (
    <View
      className={cn("absolute rounded-full", props.className)}
      onStartShouldSetResponder={(event) => true}
      style={{
        top: 6,
        right: 8,
      }}
      onTouchEnd={(e) => {
        e.stopPropagation();
      }}
    >
      <BorderlessButton
        onPress={() =>
          mutate({
            entity_type: props.type,
            entity_id: props.id,
          })
        }
      >
        {status === "loading" ? (
          <ActivityIndicator color={`${Theme.slate[400]}`} />
        ) : props.isFavourite ? (
          <AntDesign
            name={"heart"}
            size={18}
            color={`hsl(${Theme.colors.primary.DEFAULT})`}
          />
        ) : (
          <AntDesign name={"heart"} size={20} color={`rgba(1, 1, 1, 0.5)`} />
        )}
      </BorderlessButton>
    </View>
  );
};
