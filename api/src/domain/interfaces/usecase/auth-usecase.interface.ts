import { JwtOutput, TJwtPayload } from "../../types/auth.types";
import { LoginUserInput, LoginUserOuput, RegisterUserInput } from "./types/auth.types";

export interface ILoginUsecase {
    login(input : LoginUserInput) : Promise<LoginUserOuput>
}


export interface IRegisterUsecase {
    register(input : RegisterUserInput) :  Promise<void>
}

export interface IGenerateTokenUsecase {
    generateToken (input : TJwtPayload) : Promise<JwtOutput>
}