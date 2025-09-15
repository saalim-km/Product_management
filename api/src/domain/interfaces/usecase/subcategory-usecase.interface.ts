import { Types } from "mongoose";
import { ICategory } from "../../models/category";

export interface ISubCategoryUsecasee {
  addSubCategory(categoryName: string): Promise<ICategory>;
  deleteSUbCategory(categoryId: Types.ObjectId): Promise<void>;
  getSpecificSubCategory(): Promise<ICategory[]>;
}
