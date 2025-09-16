import { Types } from 'mongoose';

export interface ProductSearchParams {
    search?: string;
    page: number;
    limit: number;
    category?: Types.ObjectId | undefined;
    subCategory?: Types.ObjectId | undefined;
}