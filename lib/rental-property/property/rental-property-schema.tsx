import * as z from "zod";
import PhoneNumber from "../../common/phone-number";

//[Todo]: Merge this schema with creating-property/schema
export const RentalPropertySchema = z.object({
  building_id: z.string(),
  building: z
    .object({
      id: z.string(),
      name: z.string().min(1).max(100),
    })
    .optional(),
  name: z.string().min(1).max(100),
  floor_number: z.string().min(1).optional(),
  apartment_number: z.string().min(1).optional(),
  //   phone_number: z
  //     .string({ message: "Please enter a valid phone number" })
  //     .refine(
  //       (number) => {
  //         const code = PhoneNumber.getCountryCodeOfNumber(number);
  //         return PhoneNumber.isValidNumber(number, code);
  //       },
  //       { message: "This number doesn't seems to be valid. Please try again" }
  //     ),
  landlord_name: z.string().min(1).optional(),
  landlord_phone_number: z
    .string({ message: "Please enter a valid phone number" })
    .refine(
      (number) => {
        try {
          const code = PhoneNumber.getCountryCodeOfNumber(number);
          return PhoneNumber.isValidNumber(number, code);
        } catch (e) {
          return false;
        }
      },
      { message: "This number doesn't seems to be valid. Please try again" }
    ),
  landlord_email: z.string().email().optional(),
  landlord_address: z.string().min(1).optional(),
  variants: z
    .array(
      z.object({
        id: z.string().optional(),
        title: z.string().min(1).max(100),
        type: z.string().min(1).max(100),
        price: z.number().min(1),
        variant_parent_id: z.string().min(1).optional(),
        bookings: z
          .array(
            z.object({
              is_active: z.boolean(),
            })
          )
          .optional(),
      })
    )
    .optional(),
});

export type RentalPropertySchema = z.infer<typeof RentalPropertySchema>;
