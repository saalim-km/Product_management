import { Types } from "mongoose";
import { ICategory } from "../../models/category";

export interface ISubCategoryUsecasee {
  addSubCategory(input : {categoryId : Types.ObjectId , name : string}): Promise<ICategory>;
  deleteSUbCategory(subCatId: Types.ObjectId): Promise<void>;
}
