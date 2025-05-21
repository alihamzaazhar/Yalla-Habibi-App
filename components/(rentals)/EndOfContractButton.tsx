import { useRentalTenantEndContract } from "@/api/hooks/rental-properties/mutations";
import BaseButton from "@/ui/BaseButton";
import { Button } from "@/ui/Button";
import { useRouter } from "expo-router";
import React from "react";
import { Text } from "react-native";

interface Props {
  booking_id: string;
}
const EndOfContractButton = ({ booking_id }: Props) => {
  const { mutate: endContract, status: endContractStatus } =
    useRentalTenantEndContract();
  const router = useRouter();
  return (
    <BaseButton
      variant={"outline"}
      className="border border-red-500 px-4 py-2 h-10"
      loadingClassName="bg-red-600"
      isLoading={endContractStatus === "loading"}
      onPress={() =>
        endContract(
          {
            booking_id,
          },
          {
            onSuccess: () => {
              router.navigate("/(rental)/rent");
            },
          }
        )
      }
    >
      <Text className="font-medium text-red-500">End Contract</Text>
    </BaseButton>
  );
};

export default EndOfContractButton;
