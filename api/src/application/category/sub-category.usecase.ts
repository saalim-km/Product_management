import { inject, injectable } from "tsyringe";
import { ISubCategoryUsecasee } from "../../domain/interfaces/usecase/subcategory-usecase.interface";
import type { ISubcategoryRepository } from "../../domain/interfaces/repository/subcategory.repository";
import { ICategory } from "../../domain/models/category";
import { Types } from "mongoose";
import { ISubCategory } from "../../domain/models/sub-category";

@injectable()
export class SubCategoryUsecase implements ISubCategoryUsecasee {
    constructor(
        @inject("ISubcategoryRepository") private _subCategoryRepo : ISubcategoryRepository
    ){}

    async addSubCategory(input : {category : Types.ObjectId , name : string}): Promise<ICategory> {
        console.log("in usecase : ",input);
        return this._subCategoryRepo.create(input);
    }

    async deleteSUbCategory(subCatId: Types.ObjectId): Promise<void> {
        await this._subCategoryRepo.delete(subCatId);
    }

    async getAllSubCategories(): Promise<ISubCategory[]> {
        return this._subCategoryRepo.findAll({},0,100,-1);
    }
}