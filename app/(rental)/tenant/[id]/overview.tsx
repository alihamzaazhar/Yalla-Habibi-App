import { useRentalPropertyBookingsAnalytics } from "@/api/hooks/bookings/queries";
import {
  useRentalProperty,
  useRentalTenant,
  useRentalTenantExpenses,
  useRentalTenantPayments,
} from "@/api/hooks/rental-properties/queries";
import { DateComparisonParams } from "@/api/types";
import DepositAnalytics from "@/components/(rentals)/DepositAnalytics";
import RentDueAnalytics from "@/components/(rentals)/RentDueAnalytics";
import SavingAnalytics from "@/components/(rentals)/SavingAnalytics";
import NoHeaderLayout from "@/components/layouts/NoHeaderLayout";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import BackIcon from "@/components/shared/BackIcon";
import Error from "@/components/shared/templates/Error";
import LoadingDefault from "@/components/shared/templates/LoadingDefault";
import NoDataFound from "@/components/shared/templates/NoDataFound";
import { Theme, globalStyles } from "@/constants";
import { formatPrice } from "@/lib/common/prices";
import { useRefreshOnFocus } from "@/lib/hooks/useRefreshOnFocus";
import BaseButton from "@/ui/BaseButton";
import BorderlessButton from "@/ui/BorderlessButton";
import { Skeleton } from "@/ui/Skeleton";
import DateRangeFilter from "@/ui/filters/DateRangeFilter";
import Feather from "@expo/vector-icons/Feather";
import { DateComparisonOperator } from "@medusajs/medusa";
import { endOfMonth, formatDate, startOfMonth } from "date-fns";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

interface DateFilterProps {
  created_at?: DateComparisonOperator;
}
interface Props extends DateFilterProps {
  id: string;
}

const BookingSavingsTotal = (props: Props) => {
  const { data, status, refetch } = useRentalPropertyBookingsAnalytics(props);
  useRefreshOnFocus(refetch);
  if (status === "loading") return <PaymentListSkeleton />;
  if (status === "error") return <Error />;

  return (
    <View className="py-4 border-t border-gray-200 gap-2">
      <Text className="font-medium px-8">TOTAL SUMMARY</Text>
      <View className="px-8 py-2">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-sm">{"Payments"}</Text>
          <Text className="text-sm text-gray-600">
            {formatPrice({
              amount: data.analytics.paymentsTotal,
              currency_code: "aed",
            })}
          </Text>
        </View>
        <View className="flex flex-row items-center justify-between">
          <Text className="text-sm">{"Expenses"}</Text>
          <Text className="text-sm text-gray-600">
            {formatPrice({
              amount: data.analytics.expensesTotal,
              currency_code: "aed",
            })}
          </Text>
        </View>
      </View>
      <View className="flex flex-row items-center justify-between border-t border-gray-200 py-4 px-8">
        <Text className="text-sm">{"Savings"}</Text>
        <Text className="text-md font-semibold text-gray-800">
          {formatPrice({
            amount: data.analytics.savings,
            currency_code: "aed",
          })}
        </Text>
      </View>
    </View>
  );
};

const BookingPayments = (props: Props) => {
  const {
    data: payments,
    status: paymentsStatus,
    refetch,
  } = useRentalTenantPayments({
    rental_property_booking_id: props.id,
    created_at: props.created_at,
  });
  useRefreshOnFocus(refetch);
  const router = useRouter();
  if (paymentsStatus === "loading") return <PaymentListSkeleton />;
  if (paymentsStatus === "error") return <Error />;
  if (!payments) return <NoDataFound />;
  const allPayments = payments.pages.map((d) => d.payments).flat();
  return (
    <View className="gap-3 pr-4 pl-6">
      <View className="flex-row justify-between items-center">
        <Text className="font-semibold text-gray-800 text-lg">
          {"Payments"}
        </Text>
        <BorderlessButton
          className="flex-row items-center gap-2"
          onPress={() => {
            router.navigate({
              pathname: `/(rental)/tenant/[id]/all-payments`,
              params: {
                id: props.id,
              },
            });
          }}
        >
          <Text className="text-primary font-bold text-sm border-b border-primary mb-0.5">
            View All
          </Text>
        </BorderlessButton>
      </View>
      {allPayments.map((payment) => {
        return (
          <View
            className="flex-row justify-between items-center pr-2"
            key={payment.id}
          >
            <View>
              <Text className="text-slate-600">{payment.items[0]?.title}</Text>
              <Text className="text-sm text-slate-400">
                {formatDate(payment.created_at, "MMM yyyy hh:mm a")}
              </Text>
            </View>
            <Text>
              {formatPrice({
                amount: payment.total,
                currency_code: "aed",
              })}
            </Text>
          </View>
        );
      })}
    </View>
  );
};
const BookingExpenses = (props: Props) => {
  const {
    data: expense,
    status: expenseStatus,
    refetch,
  } = useRentalTenantExpenses({
    rental_property_booking_id: props.id,
    created_at: props.created_at,
  });
  useRefreshOnFocus(refetch);
  const router = useRouter();
  if (expenseStatus === "loading") return <PaymentListSkeleton />;
  if (expenseStatus === "error") return <Error />;
  if (!expense) return <NoDataFound />;
  const allExpenses = expense.pages.map((d) => d.expenses).flat();
  return (
    <View className="gap-3 pr-4 pl-6">
      <View className="flex-row justify-between items-center">
        <Text className="font-semibold text-gray-800 text-lg">
          {"Expenses"}
        </Text>
        <BorderlessButton
          className="flex-row items-center gap-2"
          onPress={() => {
            router.navigate({
              pathname: `/(rental)/tenant/[id]/all-expenses`,
              params: {
                id: props.id,
              },
            });
          }}
        >
          <Text className="text-primary font-bold text-sm border-b border-primary mb-0.5">
            View All
          </Text>
        </BorderlessButton>
      </View>
      {allExpenses.map((payment) => {
        return (
          <View
            className="flex-row justify-between items-center pr-2"
            key={payment.id}
          >
            <View>
              <Text className="text-slate-600">{payment.title}</Text>
              <Text className="text-sm text-slate-400">
                {formatDate(payment.created_at, "MMM yyyy hh:mm a")}
              </Text>
            </View>
            <Text>
              {formatPrice({
                amount: payment.amount,
                currency_code: "aed",
              })}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const BookingOverview = (props: Props) => {
  const searchParams = useLocalSearchParams();
  const title = searchParams.title as string;
  return (
    <View className="relative flex-1">
      <ScrollView>
        <View className="gap-3 flex-row px-4 py-6"></View>
        <View className="gap-8">
          <BookingPayments {...props} />
          <BookingExpenses {...props} />
          <BookingSavingsTotal {...props} />
        </View>
        <View style={{ height: 60 }} />
      </ScrollView>
      <View className="px-4 absolute bottom-0 pb-4 pt-4 w-full">
        <Link
          href={{
            pathname: "/(rental)/tenant/[id]/add-expense",
            params: {
              id: props.id,
              title: title,
            },
          }}
          asChild
        >
          <BaseButton
            ButtonProps={{
              style: {
                backgroundColor: Theme.primary.DEFAULT,
                borderRadius: 8,
                overflow: "hidden",
                alignContent: "center",
                justifyContent: "center",
              },
            }}
            className="w-full"
          >
            <Text className="text-white font-semibold text-xl">
              {"Add Expense"}
            </Text>
          </BaseButton>
        </Link>
      </View>
    </View>
  );
};

const BookingOverviewScreen = () => {
  const params = useLocalSearchParams();
  const id = params.id as string;
  const title = params.title as string;
  const start_from = params.start_from as string;
  const end_to = params.end_to as string;
  const today = new Date();
  const [startFrom, setStartFrom] = React.useState<Date | undefined>(
    start_from ? new Date(start_from) : startOfMonth(today)
  );
  const [endTo, setEndTo] = React.useState<Date | undefined>(
    end_to ? new Date(end_to) : endOfMonth(today)
  );
  const createdAt = startFrom || endTo ? {} : undefined;
  //@ts-ignore
  if (startFrom) createdAt.gte = startFrom;
  //@ts-ignore
  if (endTo) createdAt.lte = endTo;
  return (
    <NoHeaderLayout>
      <View className="flex-1">
        <SafeAreaView style={{ backgroundColor: Theme.white }}>
          <View className="px-4 pt-8 pb-6 items-start gap-3">
            <View className="flex-row items-center gap-2">
              <BackIcon />
              <Text className="text-3xl font-semibold text-gray-800">
                {title}
              </Text>
            </View>
            <View className="pl-4">
              <DateRangeFilter
                from={startFrom}
                to={endTo}
                onChange={(from, to) => {
                  setStartFrom(from);
                  setEndTo(to);
                }}
              />
            </View>
          </View>
        </SafeAreaView>
        <View style={{ backgroundColor: Theme.gray[100], flex: 1 }}>
          <BookingOverview id={id} created_at={createdAt} />
        </View>
      </View>
    </NoHeaderLayout>
  );
};

const PaymentListSkeleton = () => {
  return (
    <View className="gap-3 pr-4 pl-6">
      <View className="flex-row justify-between items-center">
        <Skeleton style={{ width: 80, height: 24.5 }} />
        <Skeleton style={{ width: 45, height: 18 }} />
      </View>
      <PaymentListItemSkeleton />
    </View>
  );
};
const PaymentListItemSkeleton = () => {
  return (
    <View className="flex-row justify-between items-center">
      <View className="gap-1">
        <Skeleton style={{ width: 45, height: 15 }} />
        <Skeleton style={{ width: 80, height: 14 }} />
      </View>
      <Skeleton style={{ width: 180, height: 18 }} />
    </View>
  );
};
export default BookingOverviewScreen;
