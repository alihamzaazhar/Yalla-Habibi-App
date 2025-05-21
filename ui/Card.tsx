import { cn } from "@/lib/common/utils";
import React, { PropsWithChildren } from "react";
import { View, ViewProps } from "react-native";

type Props = PropsWithChildren<ViewProps>;

const Card = ({ className, ...props }: Props) => {
  return (
    <View
      className={cn(
        "bg-card px-4 py-3 rounded-md border border-border",
        className
      )}
      {...props}
    />
  );
};

export default Card;
