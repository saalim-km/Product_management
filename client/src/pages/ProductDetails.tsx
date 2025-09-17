"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Minus, Plus, ArrowLeft } from "lucide-react";
import { IProduct, ISubCategory } from "../types/types";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "../components/ui/carousel";
import { Dialog, DialogContent } from "../components/ui/dialog";
import { productService } from "../services/product.service";
import { wishlistService } from "../services/wishlist.service";
import { handleError } from "../utils/error/error-handler.utils";
import { toast } from "sonner";
import { AddProductModal } from "../components/modal/AddProductModal";
import { CategoryService } from "../services/category.service";

interface Breadcrumb {
  label: string;
  onClick: () => void;
}

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxApi, setLightboxApi] = useState<CarouselApi>();
  const [isInWishlist, setIsInWishlist] = useState(false);

  const fetchProduct = async () => {
    try {
      if (productId) {
        const res = await productService.getProductById(productId);
        setProduct(res.data);
        // Check if product is in wishlist
        const wishlistRes = await wishlistService.getWishlist();
        setIsInWishlist(
          wishlistRes.data.some((item: IProduct) => item._id === productId)
        );
      }
    } catch (error) {
      handleError(error);
      toast.error("Failed to load product details");
    }
  };
  useEffect(() => {

    const fetchSubCategories = async () => {
      try {
        const res = await CategoryService.getallsubcategories();
        setSubCategories(res.data);
      } catch (error) {
        handleError(error);
      }
    };

    fetchSubCategories();
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (!carouselApi) return;

    setCurrentIndex(carouselApi.selectedScrollSnap());

    const handleSelect = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", handleSelect);

    return () => {
      carouselApi.off("select", handleSelect);
    };
  }, [carouselApi]);

  useEffect(() => {
    if (lightboxOpen && lightboxApi) {
      lightboxApi.scrollTo(currentIndex);
    }
  }, [lightboxOpen, lightboxApi, currentIndex]);

  const handleImageClick = () => {
    setLightboxOpen(true);
  };

  const handleEditProduct = async (formData: FormData) => {
    try {
      const productId = editingProduct?._id;
      if (!productId) {
        toast.error("Product ID not found");
        return;
      }

      await productService.updateProduct(productId, formData);
      fetchProduct()
      setEditingProduct(null);
    } catch (error) {
      handleError(error);
      toast.error("Failed to update product");
    }
  };

  const handleAddToWishlist = async () => {
    try {
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(productId!);
        setIsInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        await wishlistService.addToWishlist(productId!);
        setIsInWishlist(true);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleEdit = () => {
    setEditingProduct(product)
  };

  const getBreadcrumbs = (): Breadcrumb[] => [
    { label: "Home", onClick: () => navigate("/") },
    { label: "Product Details", onClick: () => {} },
  ];

  if (!product) {
    return <div className="text-center p-8">Loading...</div>;
  }

  const variant = product.variants[selectedVariant];
  const images = product.images ?? [];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-800 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold">Product Details</div>
          <Button
            variant="ghost"
            className="text-white hover:text-gray-200 transition-colors"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Products
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-8">
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          {getBreadcrumbs().map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <span>›</span>}
              <button
                onClick={crumb.onClick}
                className="hover:text-gray-900 transition-colors"
              >
                {crumb.label}
              </button>
            </div>
          ))}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <Carousel setApi={setCarouselApi} className="w-full">
              <CarouselContent>
                {images.length > 0 ? (
                  images.map((img, index) => (
                    <CarouselItem key={index}>
                      <Card className="shadow-lg">
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
                    <Card className="shadow-lg">
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
                  <CarouselPrevious className="bg-orange-600 hover:bg-orange-700" />
                  <CarouselNext className="bg-orange-600 hover:bg-orange-700" />
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
                      currentIndex === index
                        ? "opacity-100 border-2 border-orange-600"
                        : "opacity-70"
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
              <h1 className="text-3xl font-bold text-slate-800">
                {product.name}
              </h1>
              <div className="text-3xl font-bold text-slate-900">
                ${variant?.price}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-600">Availability:</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-600 font-medium">In stock</span>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Hurry up! only {variant?.qty} product left in stock!
            </div>

            {product.description && (
              <div className="text-gray-700 bg-gray-50 p-4 rounded-lg shadow-sm">
                <p>{product.description}</p>
              </div>
            )}

            {/* RAM Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RAM:
              </label>
              <div className="flex gap-2">
                {product.variants.map((variant, index) => (
                  <Button
                    key={index}
                    variant={selectedVariant === index ? "default" : "outline"}
                    onClick={() => setSelectedVariant(index)}
                    className={
                      selectedVariant === index
                        ? "bg-orange-600 hover:bg-orange-700 text-white"
                        : "border-gray-300"
                    }
                  >
                    {variant.ram}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity:
              </label>
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="border-gray-300"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="mx-4 min-w-[3rem] text-center font-medium">
                  {quantity}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setQuantity(Math.min(variant?.qty || 1, quantity + 1))
                  }
                  className="border-gray-300"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-lg cursor-pointer"
                onClick={handleEdit}
              >
                Edit Product
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 rounded-lg cursor-pointer">
                Buy it Now
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={handleAddToWishlist}
                className="border-gray-300"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isInWishlist ? "fill-red-500 text-red-500" : ""
                  }`}
                />
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
                    <CarouselItem
                      key={index}
                      className="flex items-center justify-center"
                    >
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
                  <CarouselPrevious className="bg-orange-600 hover:bg-orange-700 left-4" />
                  <CarouselNext className="bg-orange-600 hover:bg-orange-700 right-4" />
                </>
              )}
            </Carousel>
          </DialogContent>
        </Dialog>
      </div>

      {editingProduct && (
        <AddProductModal
          open={!!editingProduct}
          onOpenChange={() => setEditingProduct(null)}
          onAdd={handleEditProduct as any}
          subCategories={subCategories}
          editingProduct={editingProduct}
        />
      )}
    </div>
  );
}
