import * as z from "zod";
import PhoneNumber from "../common/phone-number";

export const PROPERTY_SALE_TYPE_ENUM = ["sale", "rent", "off_plan"] as const;
export const LIMITED_COUNT_ENUM = [1, 2, 3, 4, 5, 6, 7, 8] as const;
export const LISTED_BY_ENUM = ["Agent", "Landlord", "Developer"] as const;
export const PROPERTY_TYPE_ENUM = [
  "residential",
  "apartment",
  "villa",
  "townhouse",
] as const;
export const FURNISHED_OPTIONS_ENUM = ["Furnished", "Unfurnished"] as const;
export const EXTRA_FEATURES_ENUM = [
  "maid_room",
  "study",
  "central_ac_&_heating",
  "concierge_service",
  "balcony",
  "private_garden",
  "private_pool",
  "private_gym",
  "private_jacuzzi",
  "shared_pool",
  "shared_spa",
  "shared_gym",
  "security",
  "maid_service",
  "covered_parking",
  "built_in_wardrobes",
  "walk_in_closet",
  "bult_in_kitchen_appliances",
  "view_of_water",
  "view_of_Landmark",
  "pets_allowed",
  "double_glazed_windows",
  "day_care_center",
  "electricity_backup",
  "first_aid_medical_center",
  "service_elevators",
  "prayer_room",
  "laundry_room",
  "broadband_internet",
  "satellite_/_cable_tv",
  "buisness_center",
  "intercom",
  "atm_facility",
  "kids_play_area",
  "reception_/_waiting_room",
  "maintenance_staff",
  "cctv_security",
  "cafeteria_or_canteen",
  "shared_kitchen",
  "facilities_for_disabled",
  "storage_areas",
  "cleaning_services",
  "barbeque_area",
  "lobby_in_building",
  "waste_disposal",
] as const;

export const PropertyAd1Schema = z.object({
  title: z.string({ message: "Please enter a valid title" }),
  description: z.string({ message: "Please enter a valid description" }),
  ready_at: z.date().optional(),
  price: z
    .number({ message: "Please enter a valid price" })
    .min(
      //Message is different because we are dividing by 100 to get the price in AED
      10000,
      "Price must be at least AED 100"
    )
    .max(1000000000, "Price must be at most AED 10,000,000"),
  area: z
    .number({
      message: "Please enter a valid area",
    })
    .min(1),
  phone_number: z
    .string({ message: "Please enter a valid phone number" })
    .refine(
      (number) => {
        const code = PhoneNumber.getCountryCodeOfNumber(number);
        return PhoneNumber.isValidNumber(number, code);
      },
      { message: "This number doesn't seems to be valid. Please try again" }
    ),
  images: z
    .array(
      z
        .object({
          uri: z.string().optional(),
          url: z.string().optional(),
        })
        .passthrough(),
      { required_error: "Please upload at least one image" }
    )
    .min(1, { message: "Please upload at least one image" })
    .max(20, { message: "You can only upload up to 20 images" }),
});

export const PropertyAd2Schema = z.object({
  bedroom_count: z
    .number({
      required_error: "Please select a bedroom count",
    })
    .min(1)
    .max(10),
  bathroom_count: z
    .number({
      required_error: "Please select a bathroom count",
    })
    .min(1)
    .max(10),
  is_furnished: z.boolean({
    required_error: "Please select a furnished option",
  }),
  listed_by: z.enum(LISTED_BY_ENUM, {
    required_error: "Please select a listed by option",
  }),
});

export const PropertyAd3Schema = z.object({
  extra_features: z.array(z.enum(EXTRA_FEATURES_ENUM)).optional().default([]),
});

export const PropertyAd4Schema = z.object({
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

export const PropertyAd5Schema = z.object({
  category_id: z.string(),
});
export const PropertyAd6Schema = z.object({
  selling_mode: z.enum(PROPERTY_SALE_TYPE_ENUM),
});
export type OneOfPropertyAd1Schema =
  | z.infer<typeof PropertyAd1Schema>
  | z.infer<typeof PropertyAd2Schema>
  | z.infer<typeof PropertyAd3Schema>
  | z.infer<typeof PropertyAd4Schema>
  | z.infer<typeof PropertyAd5Schema>
  | z.infer<typeof PropertyAd6Schema>;

export type PropertyAdInputSchema = z.infer<typeof PropertyAd1Schema> &
  z.infer<typeof PropertyAd2Schema> &
  z.infer<typeof PropertyAd3Schema> &
  z.infer<typeof PropertyAd4Schema> &
  z.infer<typeof PropertyAd5Schema> &
  z.infer<typeof PropertyAd6Schema>;
