import { FilterQuery } from "mongoose";
import { IProduct } from "../../models/product";
import { IBaseRepository } from "./base.repository";

export interface IProductRepository extends IBaseRepository<IProduct> {
    fetchProducts(input : {filter: FilterQuery<any>, skip : number, limit: number}): Promise<{count: number, data: IProduct[]}>;
}