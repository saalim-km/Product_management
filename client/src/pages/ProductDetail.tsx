"use client"

import { Heart, Minus, Plus, ArrowLeft } from "lucide-react"
import { useState } from "react"
import { IProduct } from "../types/types"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"

interface Breadcrumb {
  label: string
  onClick: () => void
}

interface ProductDetailProps {
  product: IProduct
  onBack: () => void
  onEdit: () => void
  onAddToWishlist: () => void
  isInWishlist: boolean
  breadcrumbs: Breadcrumb[]
}

export function ProductDetail({
  product,
  onBack,
  onEdit,
  onAddToWishlist,
  isInWishlist,
  breadcrumbs,
}: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const variant = product.variants[selectedVariant]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <span>›</span>}
              <button onClick={crumb.onClick} className="hover:text-gray-900 transition-colors">
                {crumb.label}
              </button>
            </div>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <img
                src="/laptop-computer-detailed-view.jpg"
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Card className="w-24 h-20">
              <CardContent className="p-2">
                <img
                  src="/modern-laptop-workspace.png"
                  alt="Thumbnail 1"
                  className="w-full h-full object-cover rounded"
                />
              </CardContent>
            </Card>
            <Card className="w-24 h-20">
              <CardContent className="p-2">
                <img src="/laptop-side-view.jpg" alt="Thumbnail 2" className="w-full h-full object-cover rounded" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">{product.name}</h1>
            <div className="text-3xl font-bold text-slate-900">${variant?.price}</div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-600">Availability:</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-600 font-medium">In stock</span>
            </div>
          </div>

          <div className="text-sm text-gray-600">Hurry up! only {variant?.qty} product left in stock!</div>

          {product.description && (
            <div className="text-gray-700">
              <p>{product.description}</p>
            </div>
          )}

          {/* RAM Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ram:</label>
            <div className="flex gap-2">
              {product.variants.map((variant, index) => (
                <Button
                  key={index}
                  variant={selectedVariant === index ? "default" : "outline"}
                  onClick={() => setSelectedVariant(index)}
                  className={selectedVariant === index ? "bg-orange-500 hover:bg-orange-600" : ""}
                >
                  {variant.ram}
                </Button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity:</label>
            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="mx-4 min-w-[3rem] text-center font-medium">{quantity}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setQuantity(Math.min(variant?.qty || 1, quantity + 1))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8" onClick={onEdit}>
              Edit product
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8">Buy it now</Button>
            <Button size="icon" variant="outline" onClick={onAddToWishlist}>
              <Heart className={`h-5 w-5 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
