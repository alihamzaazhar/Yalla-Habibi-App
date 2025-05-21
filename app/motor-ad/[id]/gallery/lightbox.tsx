import { useMotorAd } from "@/api/hooks/marketplace/services/motors/queries";
import Error from "@/components/shared/templates/Error";
import LoadingDefault from "@/components/shared/templates/LoadingDefault";
import GalleryLightbox from "@/ui/GalleryLightbox";
import { useLocalSearchParams } from "expo-router";
import React from "react";

const LightBox = () => {
  const { id, indexToRender } = useLocalSearchParams();
  const { data, status } = useMotorAd({ id: id as string });
  if (status === "loading") return <LoadingDefault />;
  if (status === "error") return <Error />;
  if (!data) return null;

  return (
    <GalleryLightbox
      images={data.motorAd.images.map((i) => i.url)}
      initalNumToRender={parseInt(indexToRender as string)}
    />
  );
};

export default LightBox;
