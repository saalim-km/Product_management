import { z } from "zod";
import { objectIdSchema } from "./validators/validation";

const variantSchema = z.object({
  ram: z.string().min(1, "RAM is required"),
  price: z.number().positive("Price must be positive"),
  qty: z.number().int().nonnegative("Quantity must be >= 0"),
});

// [Object: null prototype] {
//   name: 'sample',
//   description: 'fdafda',
//   subCategory: '68c89661dd880c47cf9f1712',
//   variants: '[{"ram":"4 GB","price":529.99,"qty":1}]'
// }
// [Object: null prototype] {
//   images: [
//     {
//       fieldname: 'images',
//       originalname: 'image-9.webp',
//       encoding: '7bit',
//       mimetype: 'image/webp',
//       destination: 'uploads/',
//       filename: '18eda897-5e10-44c8-9f10-421bb998de15-1757998286596.webp',
//       path: 'uploads\\18eda897-5e10-44c8-9f10-421bb998de15-1757998286596.webp',
//       size: 87482
//     },
//     {
//       fieldname: 'images',
//       originalname: 'haircut.webp',
//       encoding: '7bit',
//       mimetype: 'image/webp',
//       destination: 'uploads/',
//       filename: '0d2617fd-c24b-49b5-a377-9a17094366c7-1757998286597.webp',
//       path: 'uploads\\0d2617fd-c24b-49b5-a377-9a17094366c7-1757998286597.webp',
//       size: 35702
//     }
//   ]
// }

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