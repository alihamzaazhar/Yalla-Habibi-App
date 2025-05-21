import { useYallahApiContext } from "@/api/yallah-api-context";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
interface SendForgotPasswordOtpReq {
  email: string;
}
interface SendForgotPasswordOtpRes {
  token: string;
}
export const useSendForgotPasswordOtp = () => {
  const { client } = useYallahApiContext();
  return useMutation({
    mutationFn: async (payload: SendForgotPasswordOtpReq) => {
      return await client.request<SendForgotPasswordOtpRes>(
        "POST",
        "/marketplace/users/reset-password-token",
        payload
      );
    },

    onError: (err: AxiosError) => void 0,
  });
};

interface VerifyOtpAndUpdatePasswordReq {
  otp: string;
  password: string;
  token: string;
  email: string;
}
export const useVerifyOtpAndUpdatePassword = () => {
  const { client } = useYallahApiContext();
  return useMutation({
    mutationFn: async (payload: VerifyOtpAndUpdatePasswordReq) => {
      return await client.request<void>(
        "POST",
        "/marketplace/users/reset-password",
        payload
      );
    },
    onError: (err: AxiosError) => void 0,
  });
};
