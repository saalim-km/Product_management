import { inject } from "tsyringe";
import { ILoginUsecase, IRegisterUsecase } from "../../domain/interfaces/usecase/auth-usecase.interface";

export class AuthController {
    constructor(
        @inject('ILoginUsecase') private _loginUsecase : ILoginUsecase,
        @inject("IRegisterUsecase") private _registerUsecase : IRegisterUsecase
    ){}

    
}