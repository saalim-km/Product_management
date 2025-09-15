import { Types } from "mongoose";
import { ICategory } from "../../models/category";
import { UpdateCategoryInput } from "./types/category.types";

export interface ICategoryUsecasee {
  addCategory(categoryName: string): Promise<ICategory>;
  updateCategory(input: UpdateCategoryInput): Promise<void>;
  deleteCategory(categoryId: Types.ObjectId): Promise<void>;
  getAllCategories(): Promise<ICategory[]>;
}
