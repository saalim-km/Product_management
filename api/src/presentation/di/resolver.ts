import { container } from "tsyringe";
import { DependencyInjection } from ".";
import { AuthController } from "../controllers/auth.controller";
import { CategoryController } from "../controllers/category.controller";

DependencyInjection.registerAll()

export const authController = container.resolve(AuthController)

export const categoryController = container.resolve(CategoryController)