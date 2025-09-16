import { inject, injectable } from "tsyringe";
import { IWishlistUsecase } from "../../domain/interfaces/usecase/wishlist-usecase.interface";
import type { IWishlistRepository } from "../../domain/interfaces/repository/wishlist.repository";
import { Types } from "mongoose";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { HTTP_STATUS } from "../../shared/constants/constant";
import { IWishlist } from "../../domain/models/wishlist";
import { IProduct } from "../../domain/models/product";
import type { IGetPresignedUrlUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";

@injectable()
export class WishlistUsecase implements IWishlistUsecase {
    constructor(
        @inject('IWishlistRepository') private _wishListRepo : IWishlistRepository,
        @inject("IGetPresignedUrlUsecase") private _presignedUrl : IGetPresignedUrlUsecase
    ){}

    async addToWishlist(userId: Types.ObjectId, productId: Types.ObjectId): Promise<void> {
        const isProductInWishlist = await this._wishListRepo.isProductInWishlist(userId,productId)
        if (isProductInWishlist) {
            throw new CustomError('Product is already in the wishlist',HTTP_STATUS.CONFLICT);
        }
        const wishlist = await this._wishListRepo.findOne({user : userId});
        if(wishlist){
            wishlist.products.push(productId);
            await this._wishListRepo.update(wishlist._id!,wishlist);
        } else {
            await this._wishListRepo.create({user : userId, products : [productId]});
        }
    }

    async getWishlist(userId: Types.ObjectId): Promise<IProduct[]> {
        let products =  await this._wishListRepo.fetchWishList(userId) || [];
        products = await Promise.all(products.map(async (products)=> {
            products.images = await Promise.all(products.images.map(async (image) => {
                return await this._presignedUrl.getPresignedUrl(image);
            }));
            return products;
        }))
        return products;
    }

    async removeFromWishlist(userId: Types.ObjectId, productId: Types.ObjectId): Promise<void> {
        const wishlist = await this._wishListRepo.findOne({user : userId});
        if(!wishlist){
            throw new CustomError('Wishlist not found',HTTP_STATUS.NOT_FOUND);
        }
        const productIndex = wishlist.products.findIndex(p => p.toString() === productId.toString());
        if(productIndex === -1){
            throw new CustomError('Product not found in wishlist',HTTP_STATUS.NOT_FOUND);
        }
        wishlist.products.splice(productIndex,1);
        await this._wishListRepo.update(wishlist._id!,wishlist);
    }
}