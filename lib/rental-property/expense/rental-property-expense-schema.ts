import * as z from "zod";
export const RentalPropertyExpenseSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  amount: z.number().min(1),
  categories_ids: z.array(z.string()).min(1),
  attachemnts: z
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

export type RentalPropertyExpenseSchema = z.infer<
  typeof RentalPropertyExpenseSchema
>;
