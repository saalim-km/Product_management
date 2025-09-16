"use client"

import { Heart, Minus, Plus, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { IProduct } from "../types/types"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "../components/ui/carousel"
import { Dialog, DialogContent } from "../components/ui/dialog"

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
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxApi, setLightboxApi] = useState<CarouselApi>()

  const variant = product.variants[selectedVariant]
  const images = product.images ?? []

  useEffect(() => {
    if (!carouselApi) return

    setCurrentIndex(carouselApi.selectedScrollSnap())

    const handleSelect = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap())
    }

    carouselApi.on("select", handleSelect)

    return () => {
      carouselApi.off("select", handleSelect)
    }
  }, [carouselApi])

  useEffect(() => {
    if (lightboxOpen && lightboxApi) {
      lightboxApi.scrollTo(currentIndex)
    }
  }, [lightboxOpen, lightboxApi, currentIndex])

  const handleImageClick = () => {
    setLightboxOpen(true)
  }

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
          <Carousel setApi={setCarouselApi} className="w-full">
            <CarouselContent>
              {images.length > 0 ? (
                images.map((img, index) => (
                  <CarouselItem key={index}>
                    <Card>
                      <CardContent className="p-4">
                        <img
                          src={img}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-96 object-cover rounded-lg cursor-zoom-in transition-transform duration-300 hover:scale-105"
                          onClick={handleImageClick}
                        />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem>
                  <Card>
                    <CardContent className="p-4">
                      <img
                        src="/placeholder.png"
                        alt={product.name}
                        className="w-full h-96 object-cover rounded-lg cursor-zoom-in transition-transform duration-300 hover:scale-105"
                        onClick={handleImageClick}
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              )}
            </CarouselContent>
            {images.length > 1 && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>

          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-24 h-24 object-cover rounded-md cursor-pointer transition-opacity duration-300 ${
                    currentIndex === index ? "opacity-100 border-2 border-orange-500" : "opacity-70"
                  }`}
                  onClick={() => carouselApi?.scrollTo(index)}
                />
              ))}
            </div>
          )}
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

      {/* Lightbox Modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-transparent border-none shadow-none">
          <Carousel setApi={setLightboxApi} className="w-full h-full">
            <CarouselContent className="h-[80vh]">
              {images.length > 0 ? (
                images.map((img, index) => (
                  <CarouselItem key={index} className="flex items-center justify-center">
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="max-w-full max-h-[80vh] object-contain"
                    />
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem className="flex items-center justify-center">
                  <img
                    src="/placeholder.png"
                    alt={product.name}
                    className="max-w-full max-h-[80vh] object-contain"
                  />
                </CarouselItem>
              )}
            </CarouselContent>
            {images.length > 1 && (
              <>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </>
            )}
          </Carousel>
        </DialogContent>
      </Dialog>
    </div>
  )
}