import { Types } from "mongoose";

export interface UpdateCategoryInput {
  _id: Types.ObjectId;
  name: string;
}
