import { inject, injectable } from "tsyringe";
import { IProductUsecase } from "../../domain/interfaces/usecase/product-usecase.interface";
import type { IProductRepository } from "../../domain/interfaces/repository/product.repository";
import { IProduct } from "../../domain/models/product";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { HTTP_STATUS } from "../../shared/constants/constant";
import { Types } from "mongoose";

@injectable()
export class ProductUsecase implements IProductUsecase {
  constructor(
    @inject("IProductRepository") private _productRepo: IProductRepository
  ) {}

  async createProduct(data: IProduct): Promise<IProduct> {
    const isProductExist = await this._productRepo.findOne({
      name: data.name.trim(),
    });
    if (isProductExist) {
      throw new CustomError(
        "Product with this name already exists",
        HTTP_STATUS.CONFLICT
      );
    }
    return await this._productRepo.create(data);
  }

  async updateProduct(
    id: Types.ObjectId,
    data: Partial<IProduct>
  ): Promise<any> {
    const isProductExist = await this._productRepo.findById(id);
    if (!isProductExist) {
      throw new CustomError("Product not found", HTTP_STATUS.NOT_FOUND);
    }
    return await this._productRepo.update(id, data);
  }

  async getAllProducts(input: {
    search: string;
    page: number;
    limit: number;
  }): Promise<{ count: number; data: IProduct[] }> {
    const { limit, page, search } = input;
    const skip = (page - 1) * limit;
    const filter = search ? { name: { $regex: search, $options: "i" } } : {};
    const [count, data] = await Promise.all([
      this._productRepo.count(filter),
      this._productRepo.findAll(filter, skip, limit, { name: 1 }),
    ]);

    return {
      count: count,
      data: data,
    };
  }
}
