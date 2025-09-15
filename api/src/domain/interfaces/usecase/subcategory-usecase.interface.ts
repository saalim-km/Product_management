import { Types } from "mongoose";
import { ICategory } from "../../models/category";
import { ISubCategory } from "../../models/sub-category";

export interface ISubCategoryUsecasee {
  addSubCategory(input : {category : Types.ObjectId , name : string}): Promise<ICategory>;
  deleteSUbCategory(subCatId: Types.ObjectId): Promise<void>;
  getAllSubCategories(): Promise<ISubCategory[]>;
}
