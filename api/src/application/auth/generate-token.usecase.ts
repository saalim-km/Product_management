import { inject, injectable } from "tsyringe";
import type { IJwtservice } from "../../domain/interfaces/service/jwt-service.interface";
import { JwtOutput, TJwtPayload } from "../../domain/types/auth.types";
import { IGenerateTokenUsecase } from "../../domain/interfaces/usecase/auth-usecase.interface";

@injectable()
export class GenerateTokenUsecase implements IGenerateTokenUsecase {
    constructor(
        @inject("IJwtservice") private jwtService : IJwtservice  
    ) {}
    async generateToken(input: TJwtPayload): Promise<JwtOutput> {
        const accessToken = await this.jwtService.generateAccessToken(input);
        const refreshToken = await this.jwtService.generateRefreshToken(input);  
            
        console.log('got two tokens in generatetoken usecase : ',accessToken,refreshToken);
        return {
            accessToken,
            refreshToken
        }
    }
}