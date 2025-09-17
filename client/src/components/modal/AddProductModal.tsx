"use client";

import type React from "react";
import { Plus, Minus, Upload, X } from "lucide-react";
import { useState, useEffect } from "react";
import type { IProduct, ISubCategory, IVariant } from "../../types/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (product: FormData | Omit<IProduct, "_id">) => void | Promise<void>;
  subCategories: ISubCategory[];
  editingProduct?: IProduct | null;
}

// S3 Key extraction utility function
const extractS3KeyFromUrl = (url: string): string => {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  return pathname.startsWith("/") ? pathname.substring(1) : pathname; // Remove leading slash if present
};

// Valid image MIME types
const VALID_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/bmp",
];

// Maximum image size (2MB in bytes)
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

export function AddProductModal({
  open,
  onOpenChange,
  onAdd,
  subCategories,
  editingProduct,
}: AddProductModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [variants, setVariants] = useState<Omit<IVariant, "_id">[]>([
    { ram: "4 GB", price: 529.99, qty: 1 },
  ]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImageKeys, setExistingImageKeys] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    if (editingProduct && open) {
      setName(editingProduct.name);
      setDescription(editingProduct.description || "");
      setSelectedSubCategory((editingProduct.subCategory as any)._id);
      setVariants(
        editingProduct.variants.map((v) => ({
          ram: v.ram,
          price: v.price,
          qty: v.qty,
        }))
      );
      setImages([]);
      
      // Process existing images to extract S3 keys
      const processedExistingImageKeys = editingProduct.images
        ? editingProduct.images.map((url) => extractS3KeyFromUrl(url))
        : [];
      
      setExistingImageKeys(processedExistingImageKeys);
      setImagePreviews(editingProduct.images || []);
      setImagesToDelete([]); // Reset deletion tracking when opening
      setImageError(null);
    } else if (!editingProduct && open) {
      // Reset only when opening for new product
      setName("");
      setDescription("");
      setSelectedSubCategory("");
      setVariants([{ ram: "4 GB", price: 529.99, qty: 1 }]);
      setImages([]);
      setImagePreviews([]);
      setExistingImageKeys([]);
      setImagesToDelete([]);
      setImageError(null);
    }
  }, [editingProduct, open]);

  const addVariant = () => {
    setVariants([...variants, { ram: "", price: 0, qty: 1 }]);
  };

  const updateVariant = (
    index: number,
    field: keyof IVariant,
    value: string | number
  ) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate image count
    const totalImages = images.length + existingImageKeys.length - imagesToDelete.length + files.length;
    if (totalImages > 3) {
      toast.error("You can upload a maximum of 3 images.");
      setImageError("Maximum 3 images allowed");
      return;
    }

    // Validate image type and size
    const validFiles: File[] = [];
    for (const file of files) {
      if (!VALID_IMAGE_TYPES.includes(file.type)) {
        toast.error(`Invalid file type for ${file.name}. Only image files are allowed.`);
        setImageError("Only valid image files (JPEG, PNG, GIF, WebP, BMP) are allowed");
        continue;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(`File ${file.name} is too large. Maximum size is 2MB.`);
        setImageError("Each image must be under 2MB");
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setImages([...images, ...validFiles]);

    // Generate previews for valid files
    const previews = await Promise.all(
      validFiles.map(async (file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      })
    );
    setImagePreviews([...imagePreviews, ...previews]);
    setImageError(null);
  };

  const removeImage = (index: number) => {
    // Check if we're removing an existing image (from editing)
    if (editingProduct && index < existingImageKeys.length) {
      const imageKey = existingImageKeys[index];
      setImagesToDelete([...imagesToDelete, imageKey]);
      const newExistingImageKeys = existingImageKeys.filter((_, i) => i !== index);
      setExistingImageKeys(newExistingImageKeys);
    } else {
      // Remove from new images (adjust index for existing images offset)
      const newImageIndex = index - existingImageKeys.length + imagesToDelete.length;
      const newImages = images.filter((_, i) => i !== newImageIndex);
      setImages(newImages);
    }
    
    // Remove from previews
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    setImageError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation checks
    if (!name.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!selectedSubCategory) {
      toast.error("Please select a subcategory");
      return;
    }

    if (variants.length === 0 || variants.some((v) => !v.ram || v.price <= 0)) {
      toast.error("Please provide valid variants");
      return;
    }

    const totalImages = existingImageKeys.length - imagesToDelete.length + images.length;
    if (totalImages === 0) {
      toast.error("At least one image is required");
      return;
    }

    if (totalImages > 3) {
      toast.error("You can upload a maximum of 3 images.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim() || "");
    formData.append("subCategory", selectedSubCategory);
    formData.append(
      "variants",
      JSON.stringify(variants.filter((v) => v.ram && v.price > 0))
    );

    // Append existing image keys
    if (existingImageKeys.length > 0) {
      formData.append("existingImageKeys", JSON.stringify(existingImageKeys));
    }

    // Append images to delete (for editing only)
    if (editingProduct && imagesToDelete.length > 0) {
      formData.append("imagesToDelete", JSON.stringify(imagesToDelete));
    }

    // Append raw image files (binary)
    images.forEach((image) => {
      formData.append("images", image);
    });

    // If editing, send the product ID
    if (editingProduct) {
      formData.append("_id", editingProduct._id as string);
    }

    try {
      await onAdd(formData);
      toast.success(
        editingProduct
          ? "Product updated successfully!"
          : "Product added successfully!"
      );
      setName("");
      setDescription("");
      setSelectedSubCategory("");
      setVariants([{ ram: "4 GB", price: 529.99, qty: 1 }]);
      setImages([]);
      setImagePreviews([]);
      setExistingImageKeys([]);
      setImagesToDelete([]);
      setImageError(null);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to save product. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-gray-700">
            {editingProduct ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="product-name" className="text-gray-700">Title:</Label>
              <Input
                id="product-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="HP AMD Ryzen 3"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-gray-700">Variants:</Label>
              <div className="space-y-3 mt-2">
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50"
                  >
                    <div className="flex-1">
                      <Label className="text-sm text-gray-600">RAM:</Label>
                      <Input
                        value={variant.ram}
                        onChange={(e) =>
                          updateVariant(index, "ram", e.target.value)
                        }
                        placeholder="4 GB"
                        className="mt-1"
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="text-sm text-gray-600">Price:</Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <Input
                          type="number"
                          value={variant.price}
                          onChange={(e) =>
                            updateVariant(
                              index,
                              "price",
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                          className="pl-8"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div className="w-24">
                      <Label className="text-sm text-gray-600">QTY:</Label>
                      <div className="flex items-center mt-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateVariant(
                              index,
                              "qty",
                              Math.max(1, variant.qty - 1)
                            )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-3 min-w-[2rem] text-center">
                          {variant.qty}
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateVariant(index, "qty", variant.qty + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {variants.length > 1 && (
                      <Button
                        className="ml-10"
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeVariant(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addVariant}
                  className="w-full bg-gray-800 text-white hover:bg-gray-700"
                >
                  Add Variant
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-gray-700 mb-2" htmlFor="subcategory">Subcategory:</Label>
              <Select
                value={selectedSubCategory}
                onValueChange={setSelectedSubCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a subcategory">
                    {selectedSubCategory
                      ? subCategories.find(
                          (cat) => cat._id === selectedSubCategory
                        )?.name
                      : "Select a subcategory"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {subCategories.map((subCategory) => (
                    <SelectItem key={subCategory._id} value={subCategory._id!}>
                      {subCategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-700 mb-2" htmlFor="description">Description:</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="The Ryzen 7 is a more high-end processor that compares to the Int..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-gray-700">Upload Images (Max 3, 2MB each):</Label>
              <div className="flex gap-3 mt-2 flex-wrap">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg"
                  >
                    <img
                      src={preview}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute top-0 right-0 -mt-2 -mr-2 h-6 w-6 rounded-full"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {imagePreviews.length < 3 && (
                  <label
                    htmlFor="image-upload"
                    className={`w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 ${
                      imageError ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <Upload className="h-6 w-6 text-gray-400" />
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
              {imageError && (
                <p className="text-xs text-red-500 mt-2">{imageError}</p>
              )}
              {imagesToDelete.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {imagesToDelete.length} image(s) marked for deletion
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              type="submit"
              className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-8 rounded-lg"
            >
              {editingProduct ? "Update" : "Add"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-8 rounded-lg"
            >
              Discard
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
