import { useProperty } from "@/api/hooks/marketplace/services/properties/queries";
import StackScreenWithTitleLayout from "@/components/layouts/StackScreenWithTitleLayout";
import Error from "@/components/shared/templates/Error";
import LoadingDefault from "@/components/shared/templates/LoadingDefault";
import { cn } from "@/lib/common/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const Gallery = () => {
  const propertyId = useLocalSearchParams().id as string;
  const router = useRouter();
  const { data, status } = useProperty({ id: propertyId });

  if (status === "loading") return <LoadingDefault />;
  if (status === "error") return <Error />;
  if (!data) return null;

  return (
    <StackScreenWithTitleLayout title="">
      <ScrollView contentContainerClassName="flex-row flex-wrap p-1 gap-1">
        {data.images.map((item, index) => {
          return (
            <Pressable
              key={index}
              className={cn(
                "border border-gray-200 rounded-md overflow-hidden"
              )}
              style={{
                maxWidth: index % 3 === 2 ? "100%" : "49.4%",
              }}
              onPress={() => {
                router.navigate({
                  pathname: "/property/[id]/gallery/lightbox",
                  params: {
                    id: propertyId,
                    indexToRender: index,
                  },
                });
              }}
            >
              <Image
                source={{ uri: item.url }}
                style={{ width: "100%", aspectRatio: 1 }}
              />
            </Pressable>
          );
        })}
      </ScrollView>
    </StackScreenWithTitleLayout>
  );
};

export default Gallery;
