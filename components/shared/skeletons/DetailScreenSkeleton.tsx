import NoHeaderLayout from "@/components/layouts/NoHeaderLayout";
import { Skeleton } from "@/ui/Skeleton";
import { View, Animated } from "react-native";

const DetailScreenSkeleton = () => {
  return (
    <NoHeaderLayout>
      <View className="flex-1 bg-gray-100">
        <Skeleton style={{ width: "100%", height: 300 }} className="pb-24" />
        <View className="p-6 gap-y-8 bg-gray-100">
          <View className="gap-6">
            <Skeleton style={{ height: 20, width: 60 }} />
            <View className="gap-y-3">
              <View className="flex-row gap-4 flex-wrap">
                <View className="flex-row items-center gap-2">
                  <Skeleton style={{ height: 20, width: 20 }} />
                  <Skeleton style={{ height: 10, width: 60 }} />
                </View>
                <View className="flex-row items-center gap-2">
                  <Skeleton style={{ height: 20, width: 20 }} />
                  <Skeleton style={{ height: 10, width: 60 }} />
                </View>
                <View className="flex-row items-center gap-2">
                  <Skeleton style={{ height: 20, width: 20 }} />
                  <Skeleton style={{ height: 10, width: 60 }} />
                </View>
              </View>
            </View>
          </View>
          <View className="gap-2">
            <Skeleton style={{ height: 20, width: "100%" }} />
            <Skeleton style={{ height: 20, width: "80%" }} />
            <Skeleton style={{ height: 20, width: "60%" }} />
          </View>
          <View className="gap-2">
            <Skeleton style={{ height: 20, width: "60%" }} />
            <Skeleton style={{ height: 20, width: "60%" }} />
          </View>
          <View>
            <Skeleton style={{ height: 120, width: "100%" }} />
          </View>
        </View>
        <Animated.View
          className={
            "flex-row gap-6 absolute bottom-0 px-4 py-6 border-t border-border items-center justify-center bg-card"
          }
        >
          <Skeleton style={{ height: 40, flex: 1 }} />
          <Skeleton style={{ height: 40, flex: 1 }} />
        </Animated.View>
      </View>
    </NoHeaderLayout>
  );
};
export default DetailScreenSkeleton;
