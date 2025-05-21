import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { InfiniteQueryObserverResult } from "@tanstack/react-query";

export function useFocusNotifyOnChangeProps(
  notifyOnChangeProps?: Array<keyof InfiniteQueryObserverResult> | "all"
) {
  const focusedRef = React.useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      focusedRef.current = true;

      return () => {
        focusedRef.current = false;
      };
    }, [])
  );

  if (!focusedRef.current) {
    return [];
  }
  return notifyOnChangeProps;
}
