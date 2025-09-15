import { Types } from "mongoose";

export interface IWishlist {
    _id : Types.ObjectId;
    user : Types.ObjectId;
    products : [Types.ObjectId]
}