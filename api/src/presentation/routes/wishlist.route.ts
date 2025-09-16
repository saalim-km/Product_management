import { wishlistController } from "../di/resolver";
import { verifyAuth } from "../middlewares/auth.middleware";
import { BaseRoute } from "./base.route";

export class WishlistRoute extends BaseRoute {
    protected initializeRoutes(): void {
        this.router.get('/', verifyAuth,wishlistController.getWishlist.bind(wishlistController));
        this.router.post('/:productId',verifyAuth, wishlistController.addToWishlist.bind(wishlistController));
        this.router.delete('/:productId',verifyAuth, wishlistController.removeFromWishlist.bind(wishlistController));
    }
}