import { Types } from "mongoose";

export interface IVarient {
  _id?: Types.ObjectId;
  ram: string;
  price: number;
  qty: number;
}

export interface IProduct {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  subCategory: Types.ObjectId;
  images : string[];
  variants: [IVarient];
}
