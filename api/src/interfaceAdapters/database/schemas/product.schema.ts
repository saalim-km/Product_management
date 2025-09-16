import { model, Schema } from "mongoose";
import { IProduct, IVarient } from "../../../domain/models/product";


const variantSchema = new Schema<IVarient>({
  ram: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
},{timestamps : true});

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: String,
  subCategory: { type: Schema.Types.ObjectId, ref: 'SubCategory', required: true },
  variants: [variantSchema],
  images : [{type : String , required : true}]
},{timestamps : true});

export const Product = model<IProduct>('Product', productSchema);