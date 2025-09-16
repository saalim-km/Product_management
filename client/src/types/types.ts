// Database model interfaces based on MongoDB schemas
export interface ICategory {
  _id?: string
  name: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ISubCategory {
  _id?: string
  name: string
  category: string // ObjectId reference
  createdAt?: Date
  updatedAt?: Date
}

export interface IVariant {
  _id?: string
  ram: string
  price: number
  qty: number
  createdAt?: Date
  updatedAt?: Date
}

export interface IProduct {
  _id?: string
  name: string
  description?: string
  subCategory: string // ObjectId reference
  variants: IVariant[]
  images?: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface IWishlist {
  _id?: string
  user: string // ObjectId reference
  products: string[] // ObjectId references
  createdAt?: Date
  updatedAt?: Date
}

// Extended interfaces for populated data
export interface IProductWithDetails extends Omit<IProduct, "subCategory"> {
  subCategory: ISubCategory & { category: ICategory }
}
