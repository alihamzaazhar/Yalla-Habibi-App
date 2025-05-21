import PhoneNumber from "@/lib/common/phone-number";
import * as z from "zod";

export const Schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string({ message: "Please enter a valid phone number" }).refine(
    (number) => {
      const code = PhoneNumber.getCountryCodeOfNumber(number);
      return PhoneNumber.isValidNumber(number, code);
    },
    { message: "This number doesn't seems to be valid. Please try again" }
  ),
  unit_price: z.number(),
  contract_starts_at: z.date().optional(),
  deposit: z.number().optional(),
  address: z.string(),
  total_keys: z.number(),
  total_kids: z.number(),
  total_tenants: z.number().min(1),
});

export type TenantSchema = z.infer<typeof Schema>;
