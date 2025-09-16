import { container } from "tsyringe";
import { DependencyInjection } from ".";
import { AuthController } from "../controllers/auth.controller";
import { CategoryController } from "../controllers/category.controller";
import { ProductController } from "../controllers/product.controller";
import { WishListController } from "../controllers/wishlist.controller";

DependencyInjection.registerAll()

export const authController = container.resolve(AuthController)

export const categoryController = container.resolve(CategoryController)

export const productController = container.resolve(ProductController);

export const wishlistController = container.resolve(WishListController);