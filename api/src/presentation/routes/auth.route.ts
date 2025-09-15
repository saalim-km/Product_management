import { asyncHandler } from "../../shared/utils/helper/async-handler";
import { authController } from "../di/resolver";
import { authRateLimit, registrationRateLimit } from "../middlewares/rate-limit.middleware";
import { BaseRoute } from "./base.route";

export class AuthRoute extends BaseRoute {
    protected initializeRoutes(): void {
        this.router
        .post('/register',registrationRateLimit,asyncHandler(authController.register))
        .post('/login',authRateLimit,asyncHandler(authController.login))
    }
}