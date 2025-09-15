import { inject, injectable } from "tsyringe";
import { LoginUserInput, LoginUserOuput } from "../../domain/interfaces/usecase/types/auth.types";
import { IBcryptService } from "../../domain/interfaces/service/bcrypt-service.interface";
import { IEmailExistenceUsecase, IGetPresignedUrlUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constant";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { Mapper } from "../../shared/utils/mapper";
import { ILoginUsecase } from "../../domain/interfaces/usecase/auth-usecase.interface";

@injectable()
export class LoginUsecase implements ILoginUsecase {
    constructor(
        @inject('IEmailExistenceUsecase') private _emailExistenceUsecase : IEmailExistenceUsecase,
        @inject('IBcryptService') private _bcryptService : IBcryptService,
    ){}
    async login(input : LoginUserInput): Promise<LoginUserOuput> {
        const {email , password} = input;
        const client = await this._emailExistenceUsecase.doesEmailExist(email);
        if(!client.success){
            throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND , HTTP_STATUS.NOT_FOUND)
        }

        if(!client.data?.password){
            throw new CustomError(ERROR_MESSAGES.USER_LOGIN_WITHOUT_PASSWORD, HTTP_STATUS.BAD_REQUEST)
        }

        const isPassMatch = await this._bcryptService.compare(password , client.data.password)
        if(!isPassMatch){
            throw new CustomError(ERROR_MESSAGES.INVALID_PASSWORD, HTTP_STATUS.UNAUTHORIZED)
        }

        return Mapper.userMapper(client.data)
    }
}