import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { LatLng } from "react-native-maps";

type Props = {
  coordinates?: LatLng;
};
interface ClientReverseGeocodingRes {
  items: [
    {
      title: string;
      id: string;
      resultType: string;
      houseNumberType: string;
      address: {
        label: string;
        countryCode: string;
        countryName: string;
        stateCode: string;
        state: string;
        countyCode: string;
        county: string;
        city: string;
        district: string;
        street: string;
        postalCode: string;
        houseNumber: string;
      };
    }
  ];
}
export const clientReverseGeocoding = async (coordinates: LatLng) => {
  const response = await fetch(
    `https://geocode.search.hereapi.com/v1/revgeocode?at=${coordinates.latitude},${coordinates.longitude}&apiKey=${process.env.EXPO_PUBLIC_HERE_API_KEY}&lang=en`
  );
  let address = null as ClientReverseGeocodingRes | null;
  try {
    address = await response.json();
    return address?.items[0]?.address?.label ?? "";
  } catch (e) {
    return ""
  }
};
const useReverseGeocoding = ({ coordinates }: Props) => {
  const isFocused = useIsFocused();
  return useQuery({
    queryKey: ["reverse-geocoding", coordinates],
    keepPreviousData: true,
    enabled: isFocused,
    staleTime: Infinity,
    queryFn: async ({ queryKey }) => {
      const [_, coordinates] = queryKey as [string, LatLng];
      if (!coordinates) return "";
      return await clientReverseGeocoding(coordinates);
    },
  });
};

export default useReverseGeocoding;
