import { useRentalTenantPayRent, useUpdateRentalTenant } from "@/api/hooks/rental-properties/mutations";
import { Button } from "@/ui/Button";
import { useRouter } from "expo-router";
import React from "react";
import { Text } from "react-native";
type Props = {
  booking_id: string;
};

const AddRentButton = (props: Props) => {
  const { mutate: payRent, status: payRentStatus } = useUpdateRentalTenant();
  const router = useRouter();
  return (
    <Button
      variant={"default"}
      rippleBorderRadius={2}
      className="px-6 py-2.5 h-auto"
      isLoading={payRentStatus === "loading"}
      onPress={() => {
        // payRent(
        //   {
        //     id: props.id,
        //     data:{
        //       rent_paid:
        //     }
        //   },
        //   {
        //     onSuccess: () => {
        //       router.navigate("/(rental)/rent");
        //     },
        //   }
        // )
      }
        
      }
    >
      <Text className="font-medium text-white">Add Rent</Text>
    </Button>
  );
};

export default AddRentButton;
