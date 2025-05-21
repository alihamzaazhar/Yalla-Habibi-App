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
  useVendorMeGenerateOtp,
  useVendorMeVerifyOtp,
} from "@/api/hooks/vendor/me/mutations";

const GetOtpScreen = () => {
  const router = useRouter();
  const { formattedTime, timerCount, resetTimer } = useCountdownTimer({
    secondsToCountDown: 90,
  });
  const { mutate: verifyEmailOtp, status: verifyEmailOtpStatus } =
    useVendorMeVerifyOtp();
  const {
    data: updatedOtpData,
    mutate: generateOtpMutate,
    status: generateOtpStatus,
  } = useVendorMeGenerateOtp();
  const [otp, setOtp] = useState<string | undefined>(undefined);
  const params = useLocalSearchParams();
  const email = params.email as string;
  const token = updatedOtpData?.token ?? (params.token as string);
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
            {`Please enter the OTP sent to ${email}`}
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
                  generateOtpMutate(undefined, {
                    onSuccess: () => {
                      resetTimer();
                    },
                  });
                }}
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
            verifyEmailOtp(
              {
                otp: otp!,
                token: token!,
              },
              {
                onSuccess: () => {
                  router.navigate({
                    pathname: "/email-verification/success",
                    params: {
                      email: params.email as string,
                    },
                  });
                },
                onError: ({ response }) => {
                  Alert.alert(
                    "Error",
                    response?.data ?? "Something went wrong, Please try again."
                  );
                },
              }
            );
          }}
          loadingClassName="bg-primary"
          disabled={otp === undefined || verifyEmailOtpStatus === "loading"}
          isLoading={verifyEmailOtpStatus === "loading"}
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
