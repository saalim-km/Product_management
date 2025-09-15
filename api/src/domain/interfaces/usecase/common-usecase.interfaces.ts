import { IUser } from "../../models/user";
import { IDecoded, IEmailCheckResult } from "./types/common.types";


export interface IEmailExistenceUsecase {
    doesEmailExist(email : string ) : Promise<IEmailCheckResult<IUser>>
}

export interface IGetPresignedUrlUsecase {
    getPresignedUrl(objectKey : string , ttlSecond ?: number): Promise<string>
}

export interface IRefreshTokenUsecase {
    execute(decoded : IDecoded) : string;
}