import mongoose, { model, Schema } from "mongoose";
import { IWishlist } from "../../../domain/models/wishlist";

export const WishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

export const Wishlist = model<IWishlist>("Wishlist", WishlistSchema);