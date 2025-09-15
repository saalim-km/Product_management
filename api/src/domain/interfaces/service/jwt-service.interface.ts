import { TJwtPayload } from "../../types/auth.types";
import { JwtPayload } from "jsonwebtoken";


export interface IJwtservice {
    generateAccessToken (data : TJwtPayload) : string
    generateRefreshToken (data : TJwtPayload) : string
    verifyAccessToken (token : string) : TJwtPayload | null;
    verifyRefreshToken (token : string) : TJwtPayload | null;
    decodeRefreshToken(token : string) : JwtPayload | null;
}