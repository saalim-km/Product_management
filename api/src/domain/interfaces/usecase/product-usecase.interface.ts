import { Types } from "mongoose";
import { IProduct } from "../../models/product";
import {
  ICreateProductDTO,
  UpdateProductInput,
} from "../../types/product.type";
import { ProductSearchParams } from "./types/product.types";

export interface IProductUsecase {
  createProduct(data: ICreateProductDTO): Promise<IProduct>;
  getAllProducts(
    input: ProductSearchParams
  ): Promise<{ count: number; data: IProduct[] }>;
  deleteProduct(categoryId: Types.ObjectId): Promise<void>;
  updateProduct(data: UpdateProductInput): Promise<IProduct | undefined>;
  getProductById(productId: Types.ObjectId): Promise<IProduct>;
}
