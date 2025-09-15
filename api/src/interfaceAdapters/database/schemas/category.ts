import { model, Schema } from "mongoose";
import { ICategory } from "../../../domain/models/category";

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
},{timestamps : true});

export const Category = model<ICategory>('Category', categorySchema);