import { inject, injectable } from "tsyringe";
import { ICategoryUsecasee } from "../../domain/interfaces/usecase/category-usecase.interface";
import type { ICategoryRepository } from "../../domain/interfaces/repository/category.repository";
import { ICategory } from "../../domain/models/category";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constant";
import { UpdateCategoryInput } from "../../domain/interfaces/usecase/types/category.types";
import { Types } from "mongoose";

@injectable()
export class CategoryUsecase implements ICategoryUsecasee {
  constructor(
    @inject("ICategoryRepository") private _categoryRepo: ICategoryRepository
  ){}

  async addCategory(
    categoryName: string,
    user: Types.ObjectId
  ): Promise<ICategory> {
    const iscatExists = await this._categoryRepo.findOne({
      name: categoryName.trim(),
      user : user
    });
    if (iscatExists) {
      throw new CustomError(
        ERROR_MESSAGES.CATEGORY_EXISTS,
        HTTP_STATUS.CONFLICT
      );
    }

    return await this._categoryRepo.create({ name: categoryName, user: user });
  }

  async updateCategory(input: UpdateCategoryInput): Promise<void> {
    const { _id, name } = input;
    const iscatExists = await this._categoryRepo.findById(_id);
    if (!iscatExists) {
      throw new CustomError(
        ERROR_MESSAGES.CATEGORY_NOT_FOUND,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await this._categoryRepo.update(_id, { name: name });
  }

  async deleteCategory(categoryId: Types.ObjectId): Promise<void> {
    await this._categoryRepo.deleteCategory(categoryId);
  }

  async getAllCategories(user: Types.ObjectId): Promise<ICategory[]> {
    return await this._categoryRepo.findAll({ user: user }, 0, 100, -1);
  }
}
