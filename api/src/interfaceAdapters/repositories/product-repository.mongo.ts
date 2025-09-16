import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { IProduct } from "../../domain/models/product";
import { IProductRepository } from "../../domain/interfaces/repository/product.repository";
import { Product } from "../database/schemas/product.schema";
import { FilterQuery, Types } from "mongoose";

@injectable()
export class ProductRepository
  extends BaseRepository<IProduct>
  implements IProductRepository
{
  constructor() {
    super(Product);
  }

  async fetchProducts(input: {
    filter: FilterQuery<any>;
    skip: number;
    limit: number;
  }): Promise<{ count: number; data: IProduct[] }> {
    console.log('filter in repo : ',input.filter);
    const { skip, limit } = input;
    const {category,subCategory,name} = input.filter;

    // Base filter (search support)
    let filter: any = {};
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    // SubCategory filter
    if (subCategory) {
      filter.subCategory = new Types.ObjectId(subCategory);
    }

    // If category filter is passed → use aggregation pipeline
    if (category) {
      const pipeline: any[] = [
        { $match: filter },
        {
          $lookup: {
            from: "subcategories",
            localField: "subCategory",
            foreignField: "_id",
            as: "subCategory",
          },
        },
        { $unwind: "$subCategory" },
        {
          $match: { "subCategory.category": new Types.ObjectId(category) },
        },
        { $skip: skip },
        { $limit: limit },
      ];

      console.log('filter options :',filter);
      const data = await Product.aggregate(pipeline);
      const countPipeline = [
        { $match: filter },
        {
          $lookup: {
            from: "subcategories",
            localField: "subCategory",
            foreignField: "_id",
            as: "subCategory",
          },
        },
        { $unwind: "$subCategory" },
        {
          $match: { "subCategory.category": new Types.ObjectId(category) },
        },
        { $count: "total" },
      ];

      const countRes = await Product.aggregate(countPipeline);
      const count = countRes[0]?.total || 0;

      return { count, data };
    }

    // Otherwise → Normal query with optional subCategory
    const [count, data] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter)
        .populate({
          path: "subCategory",
          populate: { path: "category" },
        })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return { count, data };
  }
}
