import { useMutation } from "@tanstack/react-query";
import {
  useCreateMotorAd,
  useUpdateMotorAd,
} from "@/api/hooks/vendor/services/motor-ads/mutations";
import useUploadFilesNative from "@/lib/hooks/useUploadFilesNative";
import { MotorAdInputSchema } from "@/lib/motors-ad/schema";

interface Payload extends MotorAdInputSchema {
  id?: string;
}
const usePersistAdDataFromStore = () => {
  
  const { mutateAsync: createMotorAd } = useCreateMotorAd();
  const { mutateAsync: updateMotorAd } = useUpdateMotorAd();
  const { mutateAsync: uploadFiles } = useUploadFilesNative();
  return useMutation({
    mutationFn: async (payload: Payload) => {
      const { id, ...data } = payload;
      const { parsedForClient, parsedForServer } = await uploadFiles(
        data.images ?? []
      );
      const mapToServerPayload = {
        ...data,
        images: parsedForServer,
      };
      const updatedData = { 
        ...data, 
        id: id,
        images: parsedForClient 
      };
      if (id) {
        const updatedAd = await updateMotorAd({
          id,
          payload: mapToServerPayload,
        });
        updatedData.id = updatedAd.motorAd.id;
      } else {
        const createdAd = await createMotorAd(mapToServerPayload);        
        updatedData.id = createdAd.motorAd.id;
      }
      
      return updatedData;
    },
  });
};

export default usePersistAdDataFromStore;
