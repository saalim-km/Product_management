import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { IProduct } from "../../domain/models/product";
import { IProductRepository } from "../../domain/interfaces/repository/product.repository";
import { Product } from "../database/schemas/product.schema";

@injectable()
export class ProductRepository extends BaseRepository<IProduct> implements IProductRepository {
    constructor(){
        super(Product)
    }
}