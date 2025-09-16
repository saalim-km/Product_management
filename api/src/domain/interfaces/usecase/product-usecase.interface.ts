import { Types } from "mongoose";
import { IProduct } from "../../models/product";
import { ICreateProductDTO } from "../../types/product.type";
import { ProductSearchParams } from "./types/product.types";

export interface IProductUsecase {
  createProduct(data: ICreateProductDTO): Promise<IProduct>;
  getAllProducts(input : ProductSearchParams): Promise<{count : number , data : IProduct[]}>;
  deleteProduct(categoryId : Types.ObjectId): Promise<void>;
  updateProduct(id: Types.ObjectId, data: Partial<IProduct>): Promise<any>;
}