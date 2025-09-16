import { inject, injectable } from "tsyringe";
import type { ICategoryUsecasee } from "../../domain/interfaces/usecase/category-usecase.interface";
import {
  nameSchema,
  objectIdSchema,
} from "../../shared/utils/validation/validators/validation";
import { SUCCESS_MESSAGES } from "../../shared/constants/constant";
import { ResponseHandler } from "../../shared/utils/helper/response-handler";
import { Request, Response } from "express";
import type { ISubCategoryUsecasee } from "../../domain/interfaces/usecase/subcategory-usecase.interface";
import { CustomRequest } from "../middlewares/auth.middleware";

@injectable()
export class CategoryController {
  constructor(
    @inject("ICategoryUsecasee") private _categoryUsecase: ICategoryUsecasee,
    @inject("ISubCategoryUsecasee")
    private _subcategoryUsecase: ISubCategoryUsecasee
  ) {}

  async getAllCategories(req: Request, res: Response): Promise<void> {
    console.log('in get all categories');
    const userId = objectIdSchema.parse((req as CustomRequest).user._id);
    console.log('user id',userId);
    const categories = await this._categoryUsecase.getAllCategories(userId);
    ResponseHandler.success(res, SUCCESS_MESSAGES.DATA_RETRIEVED, categories);
  }

  async addCategory(req: Request, res: Response): Promise<void> {
    const categoryName = req.body.name as string;
    const userId = objectIdSchema.parse((req as CustomRequest).user._id);

    const category = await this._categoryUsecase.addCategory(
      categoryName,
      userId
    );
    ResponseHandler.success(res, SUCCESS_MESSAGES.CREATED, category, 201);
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    const catId = objectIdSchema.parse(req.params.id);
    console.log(catId);
    await this._categoryUsecase.deleteCategory(catId);
    ResponseHandler.success(res, SUCCESS_MESSAGES.DELETE_SUCCESS);
  }

  async getallSubCategories(req: Request, res: Response): Promise<void> {
    const userId = objectIdSchema.parse((req as CustomRequest).user._id);

    const subCategories = await this._subcategoryUsecase.getAllSubCategories(
      userId
    );
    ResponseHandler.success(
      res,
      SUCCESS_MESSAGES.DATA_RETRIEVED,
      subCategories
    );
  }

  async addSubCategory(req: Request, res: Response): Promise<void> {
    const userId = objectIdSchema.parse((req as CustomRequest).user._id);

    const category = await this._subcategoryUsecase.addSubCategory({
      ...req.body,
      user: userId,
    });

    ResponseHandler.success(res, SUCCESS_MESSAGES.CREATED, category, 201);
  }

  async deleteSubCategory(req: Request, res: Response): Promise<void> {
    const subCatId = objectIdSchema.parse(req.params.id);
    console.log("category id", subCatId);
    await this._subcategoryUsecase.deleteSUbCategory(subCatId);
    ResponseHandler.success(res, SUCCESS_MESSAGES.DELETE_SUCCESS);
  }
}
