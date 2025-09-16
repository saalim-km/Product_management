import { inject, injectable } from "tsyringe";
import type { IProductUsecase } from "../../domain/interfaces/usecase/product-usecase.interface";
import { Request, Response } from "express";
import { createProductSchema, getAllProductsSchema } from "../../shared/utils/validation/product.validation";
import { ResponseHandler } from "../../shared/utils/helper/response-handler";
import { SUCCESS_MESSAGES } from "../../shared/constants/constant";

@injectable()
export class ProductController {
  constructor(
    @inject("IProductUsecase") private _productUsecase: IProductUsecase
  ) {}

  async createProduct(req: Request, res: Response) {
    console.log("req body : ", req.body);
    console.log("req files : ", req.files);
    const payload = createProductSchema.parse({
      ...req.body,
      images: (
        req.files as { [fieldname: string]: Express.Multer.File[] } | undefined
      )?.images,
    });

    const product = await this._productUsecase.createProduct(payload);
    ResponseHandler.success(res, SUCCESS_MESSAGES.CREATED, product);
  }

  async getAllProducts(req: Request, res: Response) {
    const parsed = getAllProductsSchema.parse(req.query)
    const products = await this._productUsecase.getAllProducts(parsed);
    ResponseHandler.success(res,SUCCESS_MESSAGES.DATA_RETRIEVED,products)
  }
}
