import { model, Schema } from "mongoose";
import { ISubCategory } from "../../../domain/models/sub-category";

const subCategorySchema = new Schema<ISubCategory>({
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
});

export const SubCategory  = model<ISubCategory>('SubCategory', subCategorySchema);