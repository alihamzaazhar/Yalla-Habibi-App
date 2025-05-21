import { Theme } from "@/constants";
import BorderlessButton from "@/ui/BorderlessButton";
import { Button } from "@/ui/Button";
import Entypo from "@expo/vector-icons/Entypo";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OtpInput } from "react-native-otp-entry";
import useCountdownTimer from "@/lib/hooks/useCountdownTimer";
import {
  useSendForgotPasswordOtp,
  useVerifyOtpAndUpdatePassword,
} from "@/api/hooks/auth/mutations";

const GetOtpScreen = () => {
  const router = useRouter();
  const { formattedTime, timerCount, resetTimer } = useCountdownTimer({
    secondsToCountDown: 90,
  });
  const {
    mutate: verifyOtpAndUpdatePassword,
    status: verifyOtpAndUpdatePasswordStatus,
  } = useVerifyOtpAndUpdatePassword();
  const {
    error,
    data: updatedOtpData,
    mutate: sendForgotPasswordOtp,
    status: sendForgotPasswordOtpStatus,
  } = useSendForgotPasswordOtp();
  const [otp, setOtp] = useState<string | undefined>(undefined);
  const params = useLocalSearchParams();
  const data = {
    email: params.email as string,
    token: updatedOtpData?.token ?? (params.token as string),
    otp: otp as string,
    password: params.password as string,
  };
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <View className={"bg-primary"}>
          <SafeAreaView>
            <View className="px-2 flex-row justify-between items-center">
              <View className="p-2">
                <BorderlessButton onPress={() => navigation.goBack()}>
                  <Entypo name="chevron-left" size={18} color={Theme.white} />
                </BorderlessButton>
              </View>
            </View>
          </SafeAreaView>
        </View>
      ),
    });
  }, []);

  return (
    <View className="flex-1 bg-primary">
      <View className="flex flex-col w-full p-4 flex-1 gap-8">
        <View className="gap-2">
          <Text className="text-3xl font-semibold text-white text-center">
            Enter OTP
          </Text>
          <Text
            className="font-semibold text-white text-center"
            style={{ opacity: 0.8 }}
          >
            {`Please enter the OTP sent to ${data.email}`}
          </Text>
        </View>
        <View className="gap-4 items-center flex-1 w-full">
          <OtpInput
            numberOfDigits={4}
            focusColor="white"
            focusStickBlinkingDuration={500}
            onTextChange={(text) => {
              setOtp(text);
            }}
            textInputProps={{
              accessibilityLabel: "One-Time Password",
            }}
            theme={{
              containerStyle: {
                gap: 16,
                justifyContent: "center",
              },
              pinCodeTextStyle: {
                color: Theme.white,
              },
            }}
            autoFocus={false}
          />
          <View className="py-6 flex-col">
            <Text className="text-xl text-white">Didn't receive OTP?</Text>
            <View className="flex-row items-center">
              <BorderlessButton
                disabled={timerCount !== 0}
                onPress={() => {
                  sendForgotPasswordOtp(
                    {
                      email: data.email,
                    },
                    {
                      onSuccess: () => {
                        resetTimer();
                      },
                    }
                  );
                }}
                isLoading={sendForgotPasswordOtpStatus === "loading"}
                ButtonProps={{
                  rippleColor: Theme.white,
                }}
              >
                <Text className="text-lg text-white">Resend</Text>
              </BorderlessButton>
              <Text className="text-lg text-white">{`in ${formattedTime.minutes}:${formattedTime.seconds}`}</Text>
            </View>
          </View>
        </View>
      </View>
      <View className="absolute bottom-0 px-8 py-12 w-full bg-primary">
        <Button
          className="w-full bg-white py-4 h-auto"
          onPress={() => {
            if (!otp) return;
            verifyOtpAndUpdatePassword(data, {
              onSuccess: () => {
                router.replace({
                  pathname: "/(auth)/sign-in",
                  params: {},
                });
              },
              onError: ({ response }) => {
                Alert.alert(
                  "Error",
                  typeof response?.data === "string"
                    ? response.data
                    : "Something went wrong, Please try again."
                );
              },
            });
          }}
          loadingClassName="bg-primary"
          disabled={!otp || verifyOtpAndUpdatePasswordStatus === "loading"}
          isLoading={verifyOtpAndUpdatePasswordStatus === "loading"}
        >
          <Text className="text-primary font-bold text-xl">
            {"Verify And Proceed"}
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default GetOtpScreen;
