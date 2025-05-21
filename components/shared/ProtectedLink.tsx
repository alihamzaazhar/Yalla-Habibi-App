import { useVendorMe } from "@/api/hooks/vendor/me/queries";
import { Link, LinkProps } from "expo-router";
import React from "react";

type Props<T extends string | object> = LinkProps<T>;

const ProtectedLink = <T extends string | object>(props: Props<T>) => {
  const { data, status } = useVendorMe();
  if (status === "loading") return <>{props.children}</>;
  if (status === "error") return <>{props.children}</>;
  if (!data) return <Link {...props} href={"/(auth)/sign-in"} />;
  return <Link {...props} />;
};

export default ProtectedLink;
