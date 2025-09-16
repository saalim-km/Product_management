import { Types } from "mongoose";
import { IWishlist } from "../../models/wishlist";
import { IProduct } from "../../models/product";

export interface IWishlistUsecase {
  addToWishlist(userId: Types.ObjectId, productId: Types.ObjectId): Promise<void>;
  removeFromWishlist(userId: Types.ObjectId, productId: Types.ObjectId): Promise<void>;
  getWishlist(userId: Types.ObjectId): Promise<IProduct[]>;
}