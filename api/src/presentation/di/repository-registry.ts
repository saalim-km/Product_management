import { container } from "tsyringe";
import { IUserRepository } from "../../domain/interfaces/repository/user.repository";
import { UserRepository } from "../../interfaceAdapters/repositories/user-repository.mongo";
import { ICategoryRepository } from "../../domain/interfaces/repository/category.repository";
import { CategoryRepository } from "../../interfaceAdapters/repositories/category-repository.mongo";
import { IProductRepository } from "../../domain/interfaces/repository/product.repository";
import { ProductRepository } from "../../interfaceAdapters/repositories/product-repository.mongo";
import { ISubcategoryRepository } from "../../domain/interfaces/repository/subcategory.repository";
import { SubcategoryRepository } from "../../interfaceAdapters/repositories/subcategory-repository.mongo";
import { IWishlistRepository } from "../../domain/interfaces/repository/wishlist.repository";
import { WishlistRepository } from "../../interfaceAdapters/repositories/wishlist-repository";

export class RepositoryRegistry {
  static registerRepositories(): void {
    container.register<IUserRepository>('IUserRepository' , {
        useClass : UserRepository
    })

    container.register<ICategoryRepository>("ICategoryRepository", {
      useClass : CategoryRepository
    })

    container.register<IProductRepository>('IProductRepository', {
      useClass : ProductRepository
    })

    container.register<ISubcategoryRepository>("ISubcategoryRepository", {
      useClass : SubcategoryRepository
    })

    container.register<IWishlistRepository>("IWishlistRepository" , {
      useClass : WishlistRepository
    })
  }
}
