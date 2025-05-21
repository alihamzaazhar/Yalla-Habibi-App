import BorderlessButton from "@/ui/BorderlessButton";
import React, { useRef, useState } from "react";
import { Text, View } from "react-native";

type Props = {
  children: string;
};

const TruncatedText = (props: Props) => {
  const textRef = useRef<Text>(null);
  const [isTruncated, setTruncated] = useState(true);
  const [totalLines, setTotalLines] = useState<number>(0);

  return (
    <View className="gap-y-2 flex-col items-start">
      <Text
        className="font-normal text-lg"
        numberOfLines={isTruncated ? 3 : 0}
        ref={textRef}
        onTextLayout={(e) => setTotalLines(e.nativeEvent.lines.length)}
      >
        {props.children}
      </Text>
      {totalLines > 3 && (
        <BorderlessButton onPress={() => setTruncated((prev) => !prev)}>
          <Text className="text-[#0082CE] font-medium">
            {isTruncated ? "Show More" : "Show Less"}
          </Text>
        </BorderlessButton>
      )}
    </View>
  );
};

export default TruncatedText;
