import mongoose, { model, Schema } from "mongoose";
import { ICategory } from "../../../domain/models/category";

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  user : {type : mongoose.Schema.Types.ObjectId, required : true , ref : 'User'}
},{timestamps : true});

export const Category = model<ICategory>('Category', categorySchema);