import { model, Schema } from "mongoose";
import { ISubCategory } from "../../../domain/models/sub-category";

const subCategorySchema = new Schema<ISubCategory>({
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  user : {type : Schema.Types.ObjectId, required : true , ref : 'User'}
});

export const SubCategory  = model<ISubCategory>('SubCategory', subCategorySchema);