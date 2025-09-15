import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { IWishlist } from "../../domain/models/wishlist";
import { IWishlistRepository } from "../../domain/interfaces/repository/wishlist.repository";
import { Wishlist } from "../database/schemas/wishlist.schema";

@injectable()
export class WishlistRepository extends BaseRepository<IWishlist> implements IWishlistRepository {
    constructor(){
        super(Wishlist)
    }
}