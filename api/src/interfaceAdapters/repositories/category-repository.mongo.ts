import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { ICategory } from "../../domain/models/category";
import { ICategoryRepository } from "../../domain/interfaces/repository/category.repository";
import { Category } from "../database/schemas/category";
import { Types } from "mongoose";
import { SubCategory } from "../database/schemas/sub-category.schema";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constant";

@injectable()
export class CategoryRepository extends BaseRepository<ICategory> implements ICategoryRepository {
    constructor(){
        super(Category)
    }

    async deleteCategory(categoryId: Types.ObjectId): Promise<void> {
        const isSubcategoryLinked = await SubCategory.find({category : categoryId})
        console.log('subcategory linked : ' , isSubcategoryLinked);
        if(isSubcategoryLinked.length > 0) {
            throw new CustomError(ERROR_MESSAGES.SUBCATEGORY_ALREADY_LINKED,HTTP_STATUS.BAD_REQUEST)
        }

        await this.model.findByIdAndDelete(categoryId);
    }
}