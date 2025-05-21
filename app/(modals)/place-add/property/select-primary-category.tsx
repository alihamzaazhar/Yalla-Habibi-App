import { useRouter } from "expo-router";
import React from "react";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import { usePropertyAdStoreContext } from "@/lib/property-ad/property-ad-store-context";
import SelectPropertyAdCategory from "@/components/property/forms/SelectPropertyAdCategory";

const SelectPrimaryCategory = () => {
  const router = useRouter();
  const data = usePropertyAdStoreContext((store) => store.data);
  const appendDataToStore = usePropertyAdStoreContext(
    (store) => store.actions.updateData
  );
  const sellingType = data?.selling_mode;
  const choosenCategory = data?.parent_category;
  return (
    <PlaceAdLayout title="Select Category">
      <SelectPropertyAdCategory
        categoryFilters={{
          parent_type: sellingType === "rent" ? "to-rent" : "to-sell",
        }}
        focusedCategory={choosenCategory}
        pickCategory={(d) => {
          
          appendDataToStore({
            category_id: d.id,
            parent_category:d
          });
          if (d.category_children?.length) {
            router.navigate({
              pathname:
                "/(modals)/place-add/property/select-secondary-category",
              params: {
                primary_category_id: d.id,
              },
            });
          } else {
            router.navigate({
              pathname: "/(modals)/place-add/property/add-details",
            });
          }
        }}
      />
    </PlaceAdLayout>
  );
};

export default SelectPrimaryCategory;
