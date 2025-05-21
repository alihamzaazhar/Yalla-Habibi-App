import { useYallahApiContext } from "@/api/yallah-api-context";
import { AdminUploadsRes } from "@medusajs/medusa";
import { useMutation } from "@tanstack/react-query";
import FormData from 'form-data'

export const useUploadFile = () => {
  const { client } = useYallahApiContext();
  return useMutation({
    mutationFn: async (files: Array<{ uri: string }>) => {
      const payload = new FormData();
      
      files.forEach((f) =>
        payload.append("files", {
          uri: f.uri,
          name: f.uri.split("/").pop(),
          type: `image/jpeg`,
        })
      );
      return await client.request<AdminUploadsRes>(
        "POST",
        "/marketplace/uploads",
        payload,
        {},
        {
          "Content-Type": "multipart/form-data",
        }
      );
    },
  });
};
