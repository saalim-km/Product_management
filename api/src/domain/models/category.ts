import { Types } from "mongoose";

export interface ICategory {
  _id: Types.ObjectId;
  name: string;
  user : Types.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
}
