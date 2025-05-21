import { MarketplaceCouponsListParams } from "@/api/hooks/marketplace/services/coupons/queries";
import { create } from "zustand";

interface State {
  filters: MarketplaceCouponsListParams;
  setFilters: (filters?: MarketplaceCouponsListParams) => void;
}
export const useCouponAdsFilters = create<State>()((set) => ({
  filters: {} as MarketplaceCouponsListParams,
  setFilters: (filters?: MarketplaceCouponsListParams) => {
    return set((state) => {
      const newFilters = filters ? { ...state.filters, ...filters } : {};
      Object.keys(newFilters).forEach((key) => {
        //@ts-expect-error
        if (newFilters[key] === undefined) {
          //@ts-expect-error
          delete newFilters[key];
        }
      });
      return {
        ...state,
        filters: newFilters,
      };
    });
  },
}));
