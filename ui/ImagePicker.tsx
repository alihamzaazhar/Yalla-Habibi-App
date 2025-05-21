import { View } from "react-native";
import * as ImagePickerApi from "expo-image-picker";
import { Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Theme } from "@/constants";
import RippleButton from "./animations/RippleButton";
import { Button } from "./Button";
import { Image } from "expo-image";
import RectButton from "./RectButton";

interface Props {
  imagesSelected?: Array<ImagePickerApi.ImagePickerAsset & { url?: string }>;
  setSelectedImages: (
    images: Array<ImagePickerApi.ImagePickerAsset & { url?: string }>
  ) => void;
}

export default function ImagePicker({
  imagesSelected = [],
  setSelectedImages,
}: Props) {
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const selectedImages = await ImagePickerApi.launchImageLibraryAsync({
      mediaTypes: ImagePickerApi.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });
    if (selectedImages.assets)
      setSelectedImages([...imagesSelected, ...selectedImages.assets]);
  };
  const removeImage = (rmvIdx: number) => {
    setSelectedImages(imagesSelected.filter((_, idx) => idx !== rmvIdx));
  };
  return (
    <View className="flex-row gap-2.5 flex-wrap flex-1">
      <RectButton
        ButtonProps={{
          style: {
            width: "31%",
            borderWidth: 1,
            borderStyle: "dashed",
            borderColor: Theme.slate[500],
            backgroundColor: Theme.gray[200],
            borderRadius: 8,
            height: 140,
            alignItems: "center",
            justifyContent: "center",
          },
        }}
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={pickImage}
      >
        <MaterialIcons name="file-upload" color={Theme.gray[600]} size={20} />
        <Text className="text-xs font-medium text-muted-foreground">
          Upload Picture
        </Text>
      </RectButton>
      {imagesSelected.map((img, idx) => (
        <View
          className="items-center justify-center relative"
          style={{ width: "31%", height: 140 }}
          key={idx}
        >
          <Button
            variant={"ghost"}
            className="absolute z-50 -top-2 -right-2 bg-red-600 p-1 rounded-full"
            rippleClassName="rounded-full bg-red-400 overflow-hidden"
            rippleBorderRadius={100}
            onPress={() => removeImage(idx)}
          >
            <MaterialIcons name="cancel" size={16} color={Theme.white} />
          </Button>
          <Image
            source={{ uri: img.url ?? img.uri }}
            style={{
              width: "100%",
              height: 140,
              borderRadius: 8,
            }}
          />
        </View>
      ))}
    </View>
  );
}
