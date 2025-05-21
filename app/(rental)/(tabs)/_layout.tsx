import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { RentalTabLayout } from "@/components/layouts/(rental)";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import NoHeaderLayout from "@/components/layouts/NoHeaderLayout";

export default function TabLayout() {
  return (
    <NoHeaderLayout>
      <RentalTabLayout
        screens={[
          {
            name: "rent",
            title: "Rent",
            icon: ({ color }) => (
              <Feather name="shopping-bag" size={24} color={color} />
            ),
          },
          {
            name: "expense",
            title: "Expense",
            icon: ({ color }) => (
              <FontAwesome name="balance-scale" size={24} color={color} />
            ),
          },
          {
            name: "property",
            title: "Properties",
            icon: ({ color }) => (
              <FontAwesome name="building" size={20} color={color} />
            ),
          },
          {
            name: "tenant",
            title: "Tenants",
            icon: ({ color }) => (
              <FontAwesome6 name="people-roof" size={24} color={color} />
            ),
          },
        ]}
      />
    </NoHeaderLayout>
  );
}
