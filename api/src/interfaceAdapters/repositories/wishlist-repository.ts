import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { IWishlist } from "../../domain/models/wishlist";
import { IWishlistRepository } from "../../domain/interfaces/repository/wishlist.repository";
import { Wishlist } from "../database/schemas/wishlist.schema";
import { Types } from "mongoose";
import { IProduct } from "../../domain/models/product";

@injectable()
export class WishlistRepository extends BaseRepository<IWishlist> implements IWishlistRepository {
    constructor(){
        super(Wishlist)
    }

    async isProductInWishlist(userId: Types.ObjectId, productId: Types.ObjectId): Promise<boolean> {
        const wishlist = await this.model.findOne({$and : [{user : userId}, {products : {$in : [productId]}}]});
        return !!wishlist;
    }

    async fetchWishList(userId: Types.ObjectId): Promise<IProduct[] | null> {
        const wishlist = await this.model.findOne({user : userId}).populate('products');
        return wishlist ? (wishlist.products as unknown as IProduct[]) : null;
    }
}