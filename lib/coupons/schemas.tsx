import * as z from "zod";

export const CouponAdSchema = z.object({
  title: z.string({ message: "Please enter a valid title" }),
  collection_id: z.string(),
  description: z.string({ message: "Please enter a valid description" }),
  price: z.number({ message: "Please enter a valid price" }),
  discount_price: z.number({ message: "Please enter a valid price" }),
  coupon_code: z.string({ message: "Please enter a valid coupon code" }),
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
    .min(1, { message: "Please upload at least one image" }),
});

export type CouponAdSchema = z.infer<typeof CouponAdSchema>;
