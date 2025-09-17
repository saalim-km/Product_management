import { z } from "zod";
import {
  limitQuerySchema,
  objectIdSchema,
  pageQuerySchema,
} from "./validators/validation";
import { Types } from "mongoose";

const variantSchema = z.object({
  ram: z.string().min(1, "RAM is required"),
  price: z.number().positive("Price must be positive"),
  qty: z.number().int().nonnegative("Quantity must be >= 0"),
});

const optionalObjectIdSchema = z
  .string()
  .transform((val) => (val ? new Types.ObjectId(val) : undefined))
  .refine(
    (val) => val === undefined || Types.ObjectId.isValid(val.toString()),
    {
      message: "Invalid ObjectId",
    }
  )
  .optional();

export const createProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  subCategory: objectIdSchema,
  variants: z
    .string()
    .transform((val) => {
      try {
        return JSON.parse(val);
      } catch {
        throw new Error("Invalid JSON for variants");
      }
    })
    .pipe(z.array(variantSchema).min(1, "At least one variant is required")),
  images: z.preprocess(
    (val) => (Array.isArray(val) ? val : val ? [val] : []),
    z
      .array(z.custom<Express.Multer.File>())
      .min(1, "At least one media file is required")
  ),
});

export const getAllProductsSchema = z.object({
  search: z.string().optional().default(""),
  page: pageQuerySchema,
  limit: limitQuerySchema,
  category: optionalObjectIdSchema,
  subCategory: optionalObjectIdSchema,
});



export const updateProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  subCategory: objectIdSchema,
  variants: z
    .string()
    .transform((val) => {
      try {
        return JSON.parse(val);
      } catch {
        throw new Error("Invalid JSON for variants");
      }
    })
    .pipe(z.array(variantSchema).min(1, "At least one variant is required")),
  images: z
    .preprocess(
      (val) => (Array.isArray(val) ? val : val ? [val] : []),
      z.array(z.custom<Express.Multer.File>())
    )
    .optional(),
  existingImageKeys: z
    .preprocess(
      (val) => {
        try {
          return typeof val === "string" ? JSON.parse(val) : val;
        } catch {
          throw new Error("Invalid JSON for existingImageKeys");
        }
      },
      z.array(z.string()) // Changed from z.string().url() to z.string()
    )
    .optional(),
  imagesToDelete: z
    .preprocess(
      (val) => {
        try {
          return typeof val === "string" ? JSON.parse(val) : val;
        } catch {
          throw new Error("Invalid JSON for imagesToDelete");
        }
      },
      z.array(z.string()).optional() // Array of S3 keys (strings)
    )
    .optional(),
  _id: objectIdSchema, // Added _id field for product identification
});