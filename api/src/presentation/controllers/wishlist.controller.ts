import { inject, injectable } from "tsyringe";
import type { IWishlistUsecase } from "../../domain/interfaces/usecase/wishlist-usecase.interface";
import { objectIdSchema } from "../../shared/utils/validation/validators/validation";
import type { CustomRequest } from "../middlewares/auth.middleware";
import { Request, Response } from "express";
import { ResponseHandler } from "../../shared/utils/helper/response-handler";

@injectable()
export class WishListController {
    constructor(
        @inject("IWishlistUsecase") private _wishListUsecase : IWishlistUsecase
    ){}

    async addToWishlist(req: Request, res: Response) {
        const userId = objectIdSchema.parse((req as CustomRequest).user._id);
        const productId = objectIdSchema.parse(req.params.productId);
        await this._wishListUsecase.addToWishlist(userId,productId);
        ResponseHandler.success(res, 'Product added to wishlist');
    }

    async getWishlist(req: Request, res: Response) {
        const userId = objectIdSchema.parse((req as CustomRequest).user._id);
        const wishlist = await this._wishListUsecase.getWishlist(userId);
        ResponseHandler.success(res, 'Wishlist retrieved',wishlist);
    }

    async removeFromWishlist(req: Request, res: Response) {
        const userId = objectIdSchema.parse((req as CustomRequest).user._id);
        const productId = objectIdSchema.parse(req.params.productId);
        await this._wishListUsecase.removeFromWishlist(userId,productId);
        ResponseHandler.success(res, 'Product removed from wishlist');
    }
}