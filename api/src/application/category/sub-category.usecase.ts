import { inject, injectable } from "tsyringe";
import { ISubCategoryUsecasee } from "../../domain/interfaces/usecase/subcategory-usecase.interface";
import type { ISubcategoryRepository } from "../../domain/interfaces/repository/subcategory.repository";
import { ICategory } from "../../domain/models/category";
import { Types } from "mongoose";
import { ISubCategory } from "../../domain/models/sub-category";
import type { IProductRepository } from "../../domain/interfaces/repository/product.repository";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { HTTP_STATUS } from "../../shared/constants/constant";

@injectable()
export class SubCategoryUsecase implements ISubCategoryUsecasee {
    constructor(
        @inject("ISubcategoryRepository") private _subCategoryRepo : ISubcategoryRepository,
        @inject("IProductRepository") private _productRepo : IProductRepository
    ){}

    async addSubCategory(input : {category : Types.ObjectId , name : string}): Promise<ICategory> {
        console.log("in usecase : ",input);
        return this._subCategoryRepo.create(input);
    }

    async deleteSUbCategory(subCatId: Types.ObjectId): Promise<void> {
        const isProductsLinked = await this._productRepo.findAll({subCategory : subCatId},0,1000,-1);
        if(isProductsLinked.length > 0){
            throw new CustomError("This subcategory cannot be deleted because it is associated with existing products",HTTP_STATUS.BAD_REQUEST)
        }
        await this._subCategoryRepo.delete(subCatId);
    }

    async getAllSubCategories(user : Types.ObjectId): Promise<ISubCategory[]> {
        return this._subCategoryRepo.findAll({user : user},0,100,-1);
    }
}