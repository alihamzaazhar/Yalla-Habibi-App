import { useUploadFile } from "@/api/hooks/uploads/mutations";
import { useMutation } from "@tanstack/react-query";

type Payload = Array<{
  uri?: string;
  url?: string;
}>;
const useUploadFilesNative = () => {
  const { mutateAsync: uploadFiles } = useUploadFile();
  return useMutation({
    mutationFn: async (payload: Payload) => {
      const pendingUploads = payload?.filter((i) => i.uri && !i.url) as
        | Array<{ uri: string }>
        | undefined;
      let uploadedImages = payload?.filter((i) => i.url) as
        | Array<{ url: string }>
        | undefined;

      let parsedForServer = uploadedImages?.map((i) => i.url) ?? [];
      let parsedForClient = uploadedImages as Payload;
      if (pendingUploads?.length) {
        const newUploadedImages = await uploadFiles(pendingUploads);
        parsedForServer = parsedForServer.concat(
          newUploadedImages.uploads.map((i) => i.url)
        );
        
        parsedForClient = parsedForClient.concat(
          newUploadedImages.uploads.map((i, idx) => {
            return {
              url: i.url,
              uri: pendingUploads[idx].uri,
            };
          })
        );
      }
      return {
        parsedForServer,
        parsedForClient,
      };
    },
  });
};

export default useUploadFilesNative;
