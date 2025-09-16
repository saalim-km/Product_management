import { inject, injectable } from "tsyringe";
import type { IProductUsecase } from "../../domain/interfaces/usecase/product-usecase.interface";
import { Request, Response } from "express";

@injectable()
export class ProductController {
    constructor(
        @inject("IProductUsecase") private _productUsecase: IProductUsecase
    ){}

    async createProduct(req : Request , res : Response){
        console.log(req.body);
        console.log(req.files);
        console.log(req.file);
    }
}