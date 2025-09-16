import { inject, injectable } from "tsyringe";
import type { IProductUsecase } from "../../domain/interfaces/usecase/product-usecase.interface";
import { Request, Response } from "express";
import { createProductSchema } from "../../shared/utils/validation/product.validation";

@injectable()
export class ProductController {
  constructor(
    @inject("IProductUsecase") private _productUsecase: IProductUsecase
  ) {}

  async createProduct(req: Request, res: Response) {
    console.log('req body : ',req.body);
    console.log('req files : ',req.files);
    const payload = createProductSchema.parse({
      ...req.body,
      images: (
        req.files as { [fieldname: string]: Express.Multer.File[] } | undefined
      )?.images,
    });

    console.log('parsed data : ',payload);
  }
}
