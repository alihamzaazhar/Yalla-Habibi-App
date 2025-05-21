import { useVendorMeEdit } from "@/api/hooks/vendor/me/mutations";
import { useVendorMe } from "@/api/hooks/vendor/me/queries";
import { Theme } from "@/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/Avatar";
import BorderlessButton from "@/ui/BorderlessButton";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { useBottomSheetImperative } from "../shared/BottomSheetModal";
import RectButton from "@/ui/RectButton";
import { Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import useUploadFilesNative from "@/lib/hooks/useUploadFilesNative";

type Props = {
  first_name?: string;
  profile_image?: string;
};

const ProfilePicture = (props: Props) => {
  const { mutate: uploadFiles, status: uploadStatus } = useUploadFilesNative();
  const { mutate: vendorMeEdit, status, error } = useVendorMeEdit();

  const updateProfilePicture = async (from_photo: boolean) => {
    let selectedImage = undefined as string | undefined;
    if (from_photo) {
      let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        alert("Permission to access camera is required!");
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        selectedImage = result.assets[0].uri;
      }
    } else {
      let permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert("Permission to access gallery is required!");
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        selectedImage = result.assets[0].uri;
      }
    }
    if (!selectedImage) return;
    uploadFiles(
      [
        {
          uri: selectedImage,
        },
      ],
      {
        onSuccess: ({ parsedForServer }) => {
          vendorMeEdit(
            {
              profile_image: parsedForServer[0],
            },
            {
              onSuccess: () => {},
            }
          );
        },
      }
    );
  };

  const imageOrCameraPickerSheet = useBottomSheetImperative({
    content: (onClose) => {
      return (
        <View className="gap-2 flex-1 justify-center">
          <RectButton
            className="w-full px-6 pt-4 pb-8"
            onPress={() => {
              updateProfilePicture(true);
              onClose();
            }}
          >
            <Text className="text-xl">Take a new Photo</Text>
          </RectButton>
          <RectButton
            className="w-full px-6 py-4"
            onPress={() => {
              updateProfilePicture(false);
              onClose();
            }}
          >
            <Text className="text-xl">Choose from your photo library</Text>
          </RectButton>
        </View>
      );
    },
    trigger: (onOpen) => {
      return (
        <BorderlessButton
          ButtonProps={{
            style: {
              backgroundColor: Theme.slate[400],
              width: 32,
              height: 32,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 20,
              overflow: "hidden",
            },
          }}
          onPress={() => onOpen()}
        >
          <Feather name="edit-2" size={16} color={Theme.slate[200]} />
        </BorderlessButton>
      );
    },
    snapPoints: ["15%", "25%"],
  });
  const isUploading = uploadStatus === "loading" || status === "loading";
  return (
    <View className="relative items-end">
      <Avatar
        style={{
          width: 120,
          height: 120,
          zIndex: 0,
        }}
      >
        {isUploading ? (
          <View className="border border-border bg-slate-100 flex-1 items-center justify-center rounded-full">
            <ActivityIndicator size={"large"} color={Theme.slate[600]} />
          </View>
        ) : props.profile_image ? (
          <AvatarImage src={props.profile_image} alt="Profile Picture" />
        ) : (
          <AvatarFallback
            textClassname="text-4xl"
            className="border border-border"
          >
            {props.first_name?.charAt(0).toLocaleUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>
      <View
        className="absolute"
        style={{
          zIndex: 997,
          backgroundColor: Theme.slate[200],
          borderRadius: 20,
          bottom: 0,
          right: 0,
        }}
      >
        {imageOrCameraPickerSheet}
      </View>
    </View>
  );
};

export default ProfilePicture;
