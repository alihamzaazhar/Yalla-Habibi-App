import { useVendorMe } from "@/api/hooks/vendor/me/queries";
import { Theme } from "@/constants";
import BorderlessButton from "@/ui/BorderlessButton";
import { Skeleton } from "@/ui/Skeleton";
import Entypo from "@expo/vector-icons/Entypo";
import React from "react";

type Props = {
  adOwnerId: string;
  onPress?: () => void;
};

const EditButton = (props: Props) => {
  const { data, status } = useVendorMe();
  if (status === "loading") return <Skeleton className="w-9 h-9" />;
  if (status === "error") return null;
  if (!data) return null;
  if (data.user.id.split("__")[0] !== props.adOwnerId) return null;
  return (
    <BorderlessButton
      onPress={props.onPress}
      ButtonProps={{
        style: {
          backgroundColor: "white",
          borderRadius: 20,
          paddingHorizontal: 0,
          paddingVertical: 0,
        },
      }}
      className="rounded-full p-2"
    >
      <Entypo name="pencil" size={20} color={Theme.slate[500]} />
    </BorderlessButton>
  );
};

export default EditButton;
