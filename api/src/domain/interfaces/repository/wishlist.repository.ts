import { Types } from "mongoose";
import { IWishlist } from "../../models/wishlist";
import { IBaseRepository } from "./base.repository";
import { IProduct } from "../../models/product";

export interface IWishlistRepository extends IBaseRepository<IWishlist> {
    isProductInWishlist(userId: Types.ObjectId, productId: Types.ObjectId): Promise<boolean>;
    fetchWishList(userId: Types.ObjectId): Promise<IProduct[] | null>;
}