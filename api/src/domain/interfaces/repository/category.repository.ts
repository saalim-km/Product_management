import { Types } from "mongoose";
import { ICategory } from "../../models/category";
import { IBaseRepository } from "./base.repository";

export interface ICategoryRepository extends IBaseRepository<ICategory> {
    deleteCategory(categoryId : Types.ObjectId) : Promise<void>
}