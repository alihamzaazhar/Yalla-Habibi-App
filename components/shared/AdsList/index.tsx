import {
  VendorProductsGetRes,
  VendorProductsListParams,
} from "@/api/hooks/vendor/products/queries";
import CouponCardLarge from "@/components/coupons/CouponCardLarge";
import MotorCardLarge from "@/components/motors/MotorCardLarge";
import PropertyCardLarge from "@/components/property/PropertyCardLarge";
import React, { memo, useCallback, useState } from "react";
import { FlatList, FlatListProps, View } from "react-native";

type AdsData = VendorProductsGetRes["products"];
type FlatListRenderItem = NonNullable<
  FlatListProps<AdsData[number]>["renderItem"]
>;
const AdItem = memo(({ item: d, index }: Parameters<FlatListRenderItem>[0]) => {
  if (d.type === "coupon_ad") {
    return (
      <CouponCardLarge
        title={d.data_entity.title}
        id={d.data_entity_id}
        images={d.data_entity.images.map((i) => i.url)}
        thumbnail={d.data_entity.thumbnail}
        description={d.data_entity.description}
        collection={d.data_entity.collection?.title ?? ""}
        isFavourite={d.data_entity.is_favourite}
        price={d.data_entity.variants[0].prices[0].amount}
        discountPrice={d.data_entity.variants[0].prices[0].discount?.value!}
        createdAt={new Date(d.data_entity.created_at)}
        owner={{
          id: d.data_entity.owner.id,
          firstName: d.data_entity.owner.first_name,
          lastName: d.data_entity.owner.last_name,
          createdAt: d.data_entity.owner.created_at,
        }}
      />
    );
  } else if (d.type === "motor_ad") {
    return (
      <MotorCardLarge
        isPremium={false}
        id={d.data_entity_id}
        phoneNumber={d.data_entity.phone_number}
        location={
          d.data_entity.location
            ? {
                lng: d.data_entity.location.coordinates[0],
                lat: d.data_entity.location.coordinates[1],
              }
            : {
                lat: 0,
                lng: 0,
              }
        }
        images={d.data_entity.images.map((i) => i.url)}
        thumbnail={d.data_entity.thumbnail}
        price={d.data_entity.price}
        createdAt={new Date(d.data_entity.created_at)}
        categories={d.data_entity.categories}
        title={d.data_entity.title}
        kilometer={d.data_entity.kilometer}
        regionalSpec={d.data_entity.regional_spec}
        trim={d.data_entity.trim}
        year={d.data_entity.year}
        age={d.data_entity.age}
        length={d.data_entity.length}
        isFavourite={d.data_entity.is_favourite}
        owner={{
          firstName: d.data_entity.requested_by.first_name,
          lastName: d.data_entity.requested_by.last_name,
          created_at: d.data_entity.requested_by.created_at,
        }}
      />
    );
  } else if (d.type === "property_ad") {
    return (
      <PropertyCardLarge
        id={d.data_entity_id}
        location={
          d.data_entity.location
            ? {
                lng: d.data_entity.location.coordinates[0],
                lat: d.data_entity.location.coordinates[1],
              }
            : {
                lat: 0,
                lng: 0,
              }
        }
        images={d.data_entity.images.map((i) => i.url)}
        thumbnail={d.data_entity.thumbnail?.url ?? ""}
        saleType={d.data_entity.selling_mode}
        title={d.data_entity.title}
        isFavourite={d.data_entity.is_favourite}
        isPremium={d.data_entity.is_premium}
        baths={d.data_entity.bathroom_count}
        beds={d.data_entity.bedroom_count}
        area={d.data_entity.area ?? 0}
        price={d.data_entity.price}
        phoneNumber={d.data_entity.phone_number}
        created_at={new Date(d.data_entity.created_at)}
        owner={{
          firstName: d.data_entity.requested_by.first_name,
          lastName: d.data_entity.requested_by.last_name,
        }}
      />
    );
  }
  return null;
});

interface Props {
  data: AdsData;
  extraData: unknown;
}
const AdsList = ({ data, extraData }: Props) => {
  
  const renderItem = useCallback<FlatListRenderItem>(
    (props) => (
      <View key={props.index}>
        <AdItem {...props} />
      </View>
    ),
    []
  );
  return (
    <FlatList
      data={data}
      extraData={extraData}
      renderItem={renderItem}
      scrollEventThrottle={40}
      contentContainerClassName="gap-y-4 p-3"
    />
  );
};

export default AdsList;
