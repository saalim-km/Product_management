import { Types } from "mongoose";

export interface ISubCategory {
  _id: Types.ObjectId;
  name: string;
  user : Types.ObjectId;
  category: Types.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
}
