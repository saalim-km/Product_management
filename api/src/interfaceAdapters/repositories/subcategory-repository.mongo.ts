import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { ISubCategory } from "../../domain/models/sub-category";
import { ISubcategoryRepository } from "../../domain/interfaces/repository/subcategory.repository";
import { SubCategory } from "../database/schemas/sub-category.schema";

@injectable()
export class SubcategoryRepository extends BaseRepository<ISubCategory> implements ISubcategoryRepository {
    constructor(){
        super(SubCategory)
    }
}