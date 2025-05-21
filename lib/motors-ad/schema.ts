import * as z from "zod";
import PhoneNumber from "../common/phone-number";
import {
  MOTOR_FUEL_TYPE,
  MOTOR_BODY_TYPE,
  MOTOR_TRANSMISSION_TYPE,
  MOTOR_STEERING_SIDE,
  MOTOR_DRIVE_SYSTEM,
} from "./constants";

export const MotorAdInputSchema = z.object({
  title: z
    .string({
      message: "Please enter a valid title",
    })
    .min(1)
    .max(100),
  description: z
    .string({
      message: "Please enter a valid description",
    })
    .min(1)
    .max(1000),
  price: z.number({ message: "Please enter a valid price" }).min(
    //Message is different because we are dividing by 100 to get the price in AED
    10000,
    "Price must be at least AED 100"
  ),
  phone_number: z
    .string({ message: "Please enter a valid phone number" })
    .refine(
      (number) => {
        const code = PhoneNumber.getCountryCodeOfNumber(number);
        return PhoneNumber.isValidNumber(number, code);
      },
      { message: "This number doesn't seems to be valid. Please try again" }
    ),
  location: z
    .object({
      lat: z.number().min(1).max(10000),
      lng: z.number().min(1).max(10000),
    })
    .optional(),
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
  trim: z.string().optional(),
  regional_spec: z.string().optional(),
  year: z.number().optional(),
  kilometer: z.number().min(0).optional(),
  has_insurance: z.boolean().optional(),
  has_warranty: z.boolean().optional(),
  tour_url_360: z.string().min(1).max(100).optional(),
  fuel_type: z.enum(MOTOR_FUEL_TYPE).optional(),
  body_type: z.enum(MOTOR_BODY_TYPE).optional(),
  transmission_type: z.enum(MOTOR_TRANSMISSION_TYPE).optional(),
  steering_side: z.enum(MOTOR_STEERING_SIDE).optional(),
  drive_system: z.enum(MOTOR_DRIVE_SYSTEM).optional(),
  cylinder_count: z.number().min(1).max(10000).optional(),
  seats_count: z.number().min(1).max(10000).optional(),
  doors_count: z.number().min(1).max(10000).optional(),
  horsepower: z.number().min(1).max(10000).optional(),
  engine_size: z.number().min(1).max(10000).optional(),
  extra_features: z.object({}).optional(),
  categories: z.array(z.string()).optional(),
  exterior_color: z.string().optional(),
  interior_color: z.string().optional(),
  
  usage: z.string().optional(),
  final_drive_system: z.string().optional(),
  wheels: z.string().optional(),
  condition: z.string().optional(),
  body_condition: z.string().optional(),
  mechanical_condition: z.string().optional(),
  //@isn't used yet
  weight: z.string().optional(),
  age: z.string().optional(),
  plate_number: z.string().optional(),
  length: z.string().optional(),
});

export type MotorAdInputSchema = z.infer<typeof MotorAdInputSchema>;
