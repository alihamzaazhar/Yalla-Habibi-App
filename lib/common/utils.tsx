import { Category } from "@/api/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function addCommasInHsl(hslValue: string) {
  return hslValue.split(" ").join(",");
}

export function addSaturationAndCommasInHsl(
  hslValue: string,
  saturation: string
) {
  return hslValue.split(" ").slice(0, 2).join(",") + `,${saturation}`;
}

export function humanizeString<T extends unknown>(value: T) {
  if (typeof value === "undefined") return "All";
  if (typeof value === "number") return value.toString();
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string") {
    return value
      .split("_")
      .map((o) => o.charAt(0).toLocaleUpperCase() + o.slice(1))
      .join(" ")
      .split("-")
      .map((o) => o.charAt(0).toLocaleUpperCase() + o.slice(1))
      .join(" ");
  }
  return '';
}
export function camelCaseToHumanReadable(value: string) {
  return (
    value.charAt(0).toLocaleUpperCase() +
    value.slice(1).replace(/([A-Z])/g, " $1")
  );
}

export function generateKeysObjectForObject<T extends object>(obj: T) {
  return Object.keys(obj).reduce(
    (prev, key) => ({
      ...prev,
      [key]: key,
    }),
    {}
  ) as Record<keyof typeof obj, string>;
}

type Option = {
  value: string;
};
export function extractValuesAsEnum<T extends Option>(
  options: Array<T> | readonly T[]
) {
  if (!options.length) throw new Error("No options provided");
  return [
    options[0].value,
    ...options.slice(1).map((option) => option.value),
  ] as const;
}

export function convertObjectNullFieldsToUndefined<T extends object>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (value === null) return [key, undefined];
      return [key, value];
    })
  ) as {
    [K in keyof T]: Exclude<T[K], null> | undefined;
  };
}

export const sortCategoriesByParent = (categories: Array<Category>) => {
  return [...categories].sort((a, b) => {
    if (a.parent_category_id === b.id) {
      return 1;
    }
    return 0;
  });
};




export const addOpacityToHsl = (hslValue: string, opacity: number) => {
  const [h, s, l] = hslValue.split(" ")
  return `hsla(${h},${s},${l},${opacity})`;
};