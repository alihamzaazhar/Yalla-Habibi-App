import { useYallahApiContext } from "@/api/yallah-api-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VendorGetCurrentUserRes, vendorMeKey } from "./queries";
import { AxiosError } from "axios";

interface VendorPostUserMeReq {
  vendor_account_capability?: boolean;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  profile_image?: string;
}
type VendorPostUserMeRes = VendorGetCurrentUserRes;
export const useVendorRefreshStripe = () => {
  const { client } = useYallahApiContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: VendorPostUserMeReq) => {
      return await client.request<VendorPostUserMeRes>(
        "POST",
        "/vendor/users/me",
        payload
      );
    },
    onSuccess: () => {
      return queryClient.refetchQueries({
        queryKey: vendorMeKey.all,
      });
    },
    onError: (err: AxiosError) => void 0,
  });
};

export const useVendorMeEdit = () => {
  const { client } = useYallahApiContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: VendorPostUserMeReq) => {
      return await client.request<VendorPostUserMeRes>(
        "POST",
        "/vendor/users/me",
        payload
      );
    },
    onSuccess: () => {
      return queryClient.refetchQueries({
        queryKey: vendorMeKey.all,
      });
    },
    onError: (err: AxiosError) => void 0,
  });
};

interface VendorPostUserMePasswordReq {
  oldPassword: string;
  password: string;
}

export const useUpdateMePassword = () => {
  const { client } = useYallahApiContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: VendorPostUserMePasswordReq) => {
      return await client.request<VendorPostUserMeRes>(
        "POST",
        "/vendor/users/me/password",
        payload
      );
    },
    onSuccess: () => {
      return queryClient.refetchQueries({
        queryKey: vendorMeKey.all,
      });
    },
    onError: (err: AxiosError) => void 0,
  });
};

interface VendorPostUserMeGenerateOtpRes {
  token: string;
}
export const useVendorMeGenerateOtp = () => {
  const { client } = useYallahApiContext();
  return useMutation({
    mutationFn: async () => {
      return await client.request<VendorPostUserMeGenerateOtpRes>(
        "POST",
        "/vendor/users/me/verification/otp"
      );
    },
    onError: (err: AxiosError) => void 0,
  });
};

interface VendorPostUserMeVerifyOtpReq {
  otp: string;
  token: string;
}
export const useVendorMeVerifyOtp = () => {
  const { client } = useYallahApiContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: VendorPostUserMeVerifyOtpReq) => {
      return await client.request<void>(
        "POST",
        "/vendor/users/me/verification",
        payload
      );
    },
    onSuccess: () => {
      return queryClient.refetchQueries({
        queryKey: vendorMeKey.all,
      });
    },
    onError: (err: AxiosError) => void 0,
  });
};
