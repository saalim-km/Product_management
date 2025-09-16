import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";

import type {
  IGenerateTokenUsecase,
  ILoginUsecase,
  IRegisterUsecase,
} from "../../domain/interfaces/usecase/auth-usecase.interface";
import {
  registerSchema,
  userLoginSchema,
} from "../../shared/utils/validation/auth.validation";
import {
  setAuthCookies,
  updateCookieWithAccessToken,
} from "../../shared/utils/helper/cookie-helper";
import { ResponseHandler } from "../../shared/utils/helper/response-handler";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../shared/constants/constant";
import { IAuthController } from "../../domain/interfaces/controller/auth-controller.interface";
import type { IRefreshTokenUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { CustomRequest } from "../middlewares/auth.middleware";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject("ILoginUsecase") private _loginUsecase: ILoginUsecase,
    @inject("IRegisterUsecase") private _registerUsecase: IRegisterUsecase,
    @inject("IGenerateTokenUsecase")
    private _generateToken: IGenerateTokenUsecase,
    @inject("IRefreshTokenUsecase") private _refreshTokenUsecase: IRefreshTokenUsecase
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    const payload = userLoginSchema.parse(req.body);
    console.log("parsed data");
    console.log(payload);
    console.log("logging the login usecase");
    console.log(this._loginUsecase);
    const user = await this._loginUsecase.login(payload);

    const tokens = await this._generateToken.generateToken({
      _id: user._id,
      email: user.email,
    });

    const accessTokenName = `user_AT`;
    const refreshTokenName = `user_RT`;

    setAuthCookies(
      res,
      tokens.accessToken,
      tokens.refreshToken,
      accessTokenName,
      refreshTokenName
    );

    ResponseHandler.success(res, SUCCESS_MESSAGES.LOGIN_SUCCESS, user);
  }

  async register(req: Request, res: Response): Promise<void> {
    const payload = registerSchema.parse(req.body);
    await this._registerUsecase.register(payload);
    ResponseHandler.success(res, SUCCESS_MESSAGES.CREATED, null, 201);
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const user = (req as CustomRequest).user;

    const accessToken = await this._refreshTokenUsecase.execute({
      _id: user._id,
      email: user.email,
      refreshToken: user.refresh_token,
    });

    updateCookieWithAccessToken(res, accessToken, "user_AT");

    ResponseHandler.success(res, SUCCESS_MESSAGES.REFRESH_TOKEN_SUCCESS, {
      accessToken,
    });
  }
}
