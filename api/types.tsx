export type PaginatedResponse<T extends string, Response> = Record<
  T,
  Array<Response>
> & {
  count: number;
  offset: number;
  limit: number;
};

export type DateComparisonParams = {
  lt?: string;
  gt?: string;
  lte?: string;
  gte?: string;
};
export type NumericalComparisonParams = {
  gte?: number;
  lte?: number;
  gt?: number;
  lt?: number;
};
export type StringComparisonParams = DateComparisonParams & {
  contains?: string;
  starts_with?: string;
  ends_with?: string;
};

export type Category = {
  id: string;
  name: string;
  created_at: string;
  handle: string;
  parent_category_id: string;
};


export type VendorProductType = "coupon_ad" | "motor_ad" | "property_ad";
