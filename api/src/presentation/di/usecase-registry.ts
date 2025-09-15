import { container } from "tsyringe";
import { IGenerateTokenUsecase, ILoginUsecase, IRegisterUsecase } from "../../domain/interfaces/usecase/auth-usecase.interface";
import { LoginUsecase } from "../../application/auth/login.usecase";
import { RegisterUsecase } from "../../application/auth/signup.usecase";
import { GenerateTokenUsecase } from "../../application/auth/generate-token.usecase";
import { IEmailExistenceUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { EmailExistenceUsecase } from "../../application/common/email-existence.usecase";
import { ICategoryUsecasee } from "../../domain/interfaces/usecase/category-usecase.interface";
import { CategoryUsecase } from "../../application/category/category.usecase";
import { ISubCategoryUsecasee } from "../../domain/interfaces/usecase/subcategory-usecase.interface";
import { SubCategoryUsecase } from "../../application/category/sub-category.usecase";

export class UsecaseRegistry {
    static registerUsecases() {
        container.register<ILoginUsecase>('ILoginUsecase', {
            useClass : LoginUsecase
        })

        container.register<IRegisterUsecase>("IRegisterUsecase" , {
            useClass : RegisterUsecase
        })

        container.register<IGenerateTokenUsecase>("IGenerateTokenUsecase" , {
            useClass : GenerateTokenUsecase
        })

        container.register<IEmailExistenceUsecase>("IEmailExistenceUsecase" , {
            useClass : EmailExistenceUsecase
        })

        container.register<ICategoryUsecasee>("ICategoryUsecasee" , {
            useClass : CategoryUsecase
        })

        container.register<ISubCategoryUsecasee>("ISubCategoryUsecasee", {
            useClass : SubCategoryUsecase
        })
    }
}