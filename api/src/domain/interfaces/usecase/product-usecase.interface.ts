import { Types } from "mongoose";
import { IProduct } from "../../models/product";
import { ICreateProductDTO } from "../../types/product.type";

export interface IProductUsecase {
  createProduct(data: ICreateProductDTO): Promise<IProduct>;
  getAllProducts(input : {search : string , page : number , limit : number}): Promise<{count : number , data : IProduct[]}>;
//   getProductById(id: string): Promise<any>;
  updateProduct(id: Types.ObjectId, data: Partial<IProduct>): Promise<any>;
//   deleteProduct(id: string): Promise<void>;
}