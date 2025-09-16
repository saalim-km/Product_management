import { asyncHandler } from "../../shared/utils/helper/async-handler";
import { authController } from "../di/resolver";
import { decodeToken } from "../middlewares/auth.middleware";
import { authRateLimit, registrationRateLimit } from "../middlewares/rate-limit.middleware";
import { BaseRoute } from "./base.route";

export class AuthRoute extends BaseRoute {
    protected initializeRoutes(): void {
        this.router
        .post('/register',registrationRateLimit,asyncHandler(authController.register.bind(authController)))
        .post('/login',authRateLimit,asyncHandler(authController.login.bind(authController)))
        .post('/refresh-token',decodeToken,asyncHandler(authController.refreshToken.bind(authController)))
    }
}