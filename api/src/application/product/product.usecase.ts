import { inject, injectable, injectAll } from "tsyringe";
import { IProductUsecase } from "../../domain/interfaces/usecase/product-usecase.interface";
import type { IProductRepository } from "../../domain/interfaces/repository/product.repository";
import { IProduct } from "../../domain/models/product";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { HTTP_STATUS } from "../../shared/constants/constant";
import { FilterQuery, Types } from "mongoose";
import { ICreateProductDTO } from "../../domain/types/product.type";
import { generateS3FileKey } from "../../shared/utils/helper/sw-filekey-generator";
import { config } from "../../shared/config/config";
import type { IAwsS3Service } from "../../domain/interfaces/service/aws-service.interface";
import logger from "../../shared/logger/logger";
import { cleanUpLocalFiles } from "../../shared/utils/helper/clean-local-file.helper";
import { unknown } from "zod";
import { GetPresignedUrlUsecase } from "../common/get-presigned-url.usecase";
import { ProductSearchParams } from "../../domain/interfaces/usecase/types/product.types";

@injectable()
export class ProductUsecase implements IProductUsecase {
  constructor(
    @inject("IProductRepository") private _productRepo: IProductRepository,
    @inject("IAwsS3Service") private _s3Service: IAwsS3Service,
    @inject("IGetPresignedUrlUsecase") private _presignedUrl : GetPresignedUrlUsecase
  ) {}

  async createProduct(data: ICreateProductDTO): Promise<IProduct> {
    const { description, images, name, subCategory, variants } = data;

    let filekeys: string[] = [];
    const uploadedkeys: string[] = [];

    try {
      filekeys = images.map((image) =>
        generateS3FileKey(config.s3.PRODUCTS, image.originalname)
      );

      const uploadedPromises = images.map(async (image, indx) => {
        const filekey = filekeys[indx];
        try {
          await this._s3Service.uploadFileToAws(filekey!, image.path);
          uploadedkeys.push(filekey!);
        } catch (error) {
          console.error(`Failed to upload ${image.originalname}:`, error);
          throw error;
        }
      });

      await Promise.all(uploadedPromises);

      const product = await this._productRepo.create({
        name,
        description,
        subCategory: new Types.ObjectId(subCategory),
        variants : variants as unknown as [{
          ram: string;
          price: number;
          qty: number;
        }],
        images: filekeys,
      });

      console.log('new product creaated : ',product);
      const presignedUrls = await Promise.all(product.images.map((key) =>this._presignedUrl.getPresignedUrl(key)));
      product.images = presignedUrls;
      console.log('presignedUrls : ',presignedUrls);
      return product;

    } catch (error) {
      if (uploadedkeys.length > 0) {
        logger.info(
          `Cleaning up ${uploadedkeys.length} uploaded files from S3`
        );
        await Promise.allSettled(
          uploadedkeys.map((key) => {
            return this._s3Service
              .deleteFileFromAws(key)
              .catch((err) => console.log(err));
          })
        );
      }

      throw error;
    } finally {
      await cleanUpLocalFiles(images)
    }
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

  async getAllProducts(input: ProductSearchParams): Promise<{ count: number; data: IProduct[]}> {
    const { search, page, limit , category , subCategory} = input;
    const skip = (page - 1) * limit;
    const filter : FilterQuery<IProduct> = {}
    if(search){
      filter.name = search.trim()
    }
    if(subCategory){
      filter['subCategory'] = subCategory
    }
    if(category){
      filter['category'] = category;
    }

    console.log(filter);
    let {data,count} =  await this._productRepo.fetchProducts({filter, skip, limit});
    data = await Promise.all(data.map(async (product)=> {
      product.images = await Promise.all(product.images.map((key) => this._presignedUrl.getPresignedUrl(key)))
      return product
    }))

    return {data,count};
  }
}
