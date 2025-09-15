import { inject, injectable } from "tsyringe";
import type { ICategoryUsecasee } from "../../domain/interfaces/usecase/category-usecase.interface";
import { nameSchema, objectIdSchema } from "../../shared/utils/validation/validators/validation";
import { SUCCESS_MESSAGES } from "../../shared/constants/constant";
import { ResponseHandler } from "../../shared/utils/helper/response-handler";
import { Request, Response } from "express";
import type { ISubCategoryUsecasee } from "../../domain/interfaces/usecase/subcategory-usecase.interface";

@injectable()
export class CategoryController {
    constructor(
        @inject("ICategoryUsecasee") private _categoryUsecase: ICategoryUsecasee,
        @inject('ISubCategoryUsecasee') private _subcategoryUsecase : ISubCategoryUsecasee
    ){}

    async addCategory(req: Request, res: Response): Promise<void> {
        const payload = req.body.name as string;
        const category = await this._categoryUsecase.addCategory(payload);
        ResponseHandler.success(res, SUCCESS_MESSAGES.CREATED, category, 201);
    }

    async deleteCategory(req: Request, res: Response): Promise<void> {
        const catId = objectIdSchema.parse(req.params.id);
        await this._categoryUsecase.deleteCategory(catId);
        ResponseHandler.success(res, SUCCESS_MESSAGES.DELETE_SUCCESS);
    }

    async addSubCategory(req: Request, res: Response): Promise<void> {
        const categoryId = objectIdSchema.parse(req.params.id);
        const name = req.body.name as string;
        const category = await this._subcategoryUsecase.addSubCategory({categoryId, name});
        ResponseHandler.success(res, SUCCESS_MESSAGES.CREATED, category, 201);
    }

    async deleteSubCategory(req: Request, res: Response): Promise<void> {
        const subCatId = objectIdSchema.parse(req.params.id);
        await this._subcategoryUsecase.deleteSUbCategory(subCatId);
        ResponseHandler.success(res, SUCCESS_MESSAGES.DELETE_SUCCESS);
    }
}