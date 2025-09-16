import { Types } from "mongoose";

// One product variant
export interface IProductVariant {
  ram: string;
  price: number;
  qty: number;
}

// Main product object
export interface ICreateProductDTO {
  name: string;
  user : Types.ObjectId;
  description: string;
  subCategory: Types.ObjectId; // store ObjectId as string in DTO
  variants: IProductVariant[];
  images: Express.Multer.File[];
}

export interface IUpdateProductDTO extends ICreateProductDTO {}