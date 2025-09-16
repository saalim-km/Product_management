import { Types } from "mongoose";
import { ICategory } from "../../models/category";
import { UpdateCategoryInput } from "./types/category.types";

export interface ICategoryUsecasee {
  addCategory(categoryName: string,user : Types.ObjectId): Promise<ICategory>;
  updateCategory(input: UpdateCategoryInput): Promise<void>;
  deleteCategory(categoryId: Types.ObjectId): Promise<void>;
  getAllCategories(user : Types.ObjectId): Promise<ICategory[]>;
}
