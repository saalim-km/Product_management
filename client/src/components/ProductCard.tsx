"use client";

import { Heart, Edit, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { IProduct } from "../types/types";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: IProduct;
  onView?: (product: IProduct) => void;
  onEdit?: (product: IProduct) => void;
  onDelete?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
}

export function ProductCard({
  product,
  onView,
  onEdit,
  onDelete,
  onAddToWishlist,
  isInWishlist,
}: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const variant = product.variants[selectedVariant];

  const image =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/placeholder.png";
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="relative mb-4">
          <img
            src={image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onAddToWishlist?.(product._id!)}
          >
            <Heart
              className={`h-4 w-4 ${
                isInWishlist ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>
        </div>

        <h3 className="font-semibold text-lg mb-2 text-slate-800">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-slate-900">
            ${variant?.price}
          </span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} className="w-4 h-4 bg-gray-200 rounded-sm" />
            ))}
          </div>
        </div>

        {product.variants.length > 1 && (
          <div className="mb-3">
            <div className="flex gap-2">
              {product.variants.map((variant, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={selectedVariant === index ? "default" : "outline"}
                  onClick={() => setSelectedVariant(index)}
                  className="text-xs"
                >
                  {variant.ram}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Link
            className="flex-1 cursor-pointer"
            to={`/product/${product._id}`}
            key={product._id}
          >
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
              onClick={() => onView?.(product)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          </Link>
          <Button
            size="icon"
            variant="outline"
            onClick={() => onEdit?.(product)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="hover:bg-red-50 hover:text-red-600 bg-transparent"
            onClick={() => onDelete?.(product._id!)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
