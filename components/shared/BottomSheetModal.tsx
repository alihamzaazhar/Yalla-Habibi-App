import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal as BottomSheetModalPrimitive,
} from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Pressable, PressableProps } from "react-native";
import createGenericContext from "@/lib/common/create-generic-context";
import { Slot } from "expo-router";

interface BottomSheetModalContext {
  ref: BottomSheetModalMethods | null;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setRef: Dispatch<SetStateAction<BottomSheetModalMethods | null>>;
}
const [useBottomSheetContext, BottomSheetContextProvider] =
  createGenericContext<BottomSheetModalContext>();

export const BottomSheetModalRoot = (props: PropsWithChildren) => {
  const [ref, setRef] = useState<BottomSheetModalMethods | null>(null);
  const [open, setOpen] = useState(false);
  return (
    <BottomSheetContextProvider value={{ ref, open, setOpen, setRef }}>
      {props.children}
    </BottomSheetContextProvider>
  );
};

type Props = {
  render: (p: { onOpen: () => void }) => React.ReactNode;
};
export const BottomSheetModalTrigger = ({ render }: Props) => {
  const { ref: bottomSheetRef } = useBottomSheetContext();
  const onOpen = () => {
    if (bottomSheetRef) {
      bottomSheetRef.present();
    }
  };
  return <>{render({ onOpen })}</>;
};

export const BottomSheetModalContent = (
  props:
    | PropsWithChildren
    | { children: (props: { onClose: () => void }) => React.ReactNode }
) => {
  const containerRef = useRef<BottomSheetModalMethods | null>(null);
  const { ref, setRef } = useBottomSheetContext();
  const snapPoints = useRef(["25%", "40%", "100%"]);

  const onClose = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.dismiss();
    }
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      setRef(containerRef.current);
    }
    return () => {
      setRef(null);
    };
  }, []);

  return (
    <BottomSheetModalPrimitive
      ref={containerRef}
      index={1}
      snapPoints={snapPoints.current}
      stackBehavior="push"
    >
      {typeof props.children === "function"
        ? props.children({ onClose })
        : props.children}
    </BottomSheetModalPrimitive>
  );
};
BottomSheetModalContent.displayName = "BottomSheetModalContent";

interface SheetProps {
  trigger: (onOpen: () => void) => React.ReactNode;
  content: (onClose: () => void) => React.ReactNode;
  snapPoints?: Array<string>;
}
export const useBottomSheetImperative = ({
  content,
  trigger,
  snapPoints = ["25%", "40%", "100%"],
}: SheetProps) => {
  const containerRef = useRef<BottomSheetModalMethods | null>(null);
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
      {trigger(openModal)}
      <BottomSheetModalPrimitive
        ref={containerRef}
        index={1}
        snapPoints={snapPoints}
        backdropComponent={renderBackDrop}
        stackBehavior="push"
      >
        {content(closeModal)}
      </BottomSheetModalPrimitive>
    </>
  );
};
