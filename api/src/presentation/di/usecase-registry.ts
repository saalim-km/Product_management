import { container } from "tsyringe";
import { IGenerateTokenUsecase, ILoginUsecase, IRegisterUsecase } from "../../domain/interfaces/usecase/auth-usecase.interface";
import { LoginUsecase } from "../../application/auth/login.usecase";
import { RegisterUsecase } from "../../application/auth/signup.usecase";
import { GenerateTokenUsecase } from "../../application/auth/generate-token.usecase";

export class UsecaseRegistry {
    static registerUsecases() {
        container.register<ILoginUsecase>('ILoginUser', {
            useClass : LoginUsecase
        })

        container.register<IRegisterUsecase>("IRegisterUsecase" , {
            useClass : RegisterUsecase
        })

        container.register<IGenerateTokenUsecase>("IGenerateTokenUsecase" , {
            useClass : GenerateTokenUsecase
        })
    }
}