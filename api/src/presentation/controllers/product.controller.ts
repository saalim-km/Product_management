import { inject, injectable } from "tsyringe";
import type { IProductUsecase } from "../../domain/interfaces/usecase/product-usecase.interface";
import { Request, Response } from "express";
import {
  createProductSchema,
  getAllProductsSchema,
  updateProductSchema,
} from "../../shared/utils/validation/product.validation";
import { ResponseHandler } from "../../shared/utils/helper/response-handler";
import { SUCCESS_MESSAGES } from "../../shared/constants/constant";
import { objectIdSchema } from "../../shared/utils/validation/validators/validation";
import { CustomRequest } from "../middlewares/auth.middleware";

@injectable()
export class ProductController {
  constructor(
    @inject("IProductUsecase") private _productUsecase: IProductUsecase
  ) {}

  async createProduct(req: Request, res: Response) {
    const payload = createProductSchema.parse({
      ...req.body,
      images: (
        req.files as { [fieldname: string]: Express.Multer.File[] } | undefined
      )?.images,
    });

    const userId = objectIdSchema.parse((req as CustomRequest).user._id);
    const product = await this._productUsecase.createProduct({
      ...payload,
      user: userId,
    });
    ResponseHandler.success(res, SUCCESS_MESSAGES.CREATED, product);
  }

  async updateProduct(req: Request, res: Response) {
    const userId = objectIdSchema.parse((req as CustomRequest).user._id);
    const payload = updateProductSchema.parse({
      ...req.body,
      images: (
        req.files as { [fieldname: string]: Express.Multer.File[] } | undefined
      )?.images,
    });

    const product = await this._productUsecase.updateProduct({...payload,user:userId});
    ResponseHandler.success(res, SUCCESS_MESSAGES.UPDATE_SUCCESS , product);
  }

  async getAllProducts(req: Request, res: Response) {
    const userId = objectIdSchema.parse((req as CustomRequest).user._id);

    const parsed = getAllProductsSchema.parse(req.query);
    const products = await this._productUsecase.getAllProducts({
      ...parsed,
      user: userId,
    });
    ResponseHandler.success(res, SUCCESS_MESSAGES.DATA_RETRIEVED, products);
  }

  async deleteProduct(req: Request, res: Response) {
    const productId = objectIdSchema.parse(req.params.id);
    await this._productUsecase.deleteProduct(productId);
    ResponseHandler.success(res, SUCCESS_MESSAGES.DELETE_SUCCESS, null);
  }

  async getProduct(req: Request, res: Response) {
    const productId = objectIdSchema.parse(req.params.id)
    const product = await this._productUsecase.getProductById(productId);
    ResponseHandler.success(res,SUCCESS_MESSAGES.DATA_RETRIEVED,product);
  }
}
