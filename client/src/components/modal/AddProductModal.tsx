"use client";

import type React from "react";
import { Plus, Minus, Upload } from "lucide-react";
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
  onAdd: (product: Omit<IProduct, "_id"> | IProduct) => void;
  subCategories: ISubCategory[];
  editingProduct?: IProduct | null;
}

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

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setDescription(editingProduct.description || "");
      setSelectedSubCategory(editingProduct.subCategory);
      setVariants(
        editingProduct.variants.map((v) => ({
          ram: v.ram,
          price: v.price,
          qty: v.qty,
        }))
      );
      setImages([]); // Reset images for editing
      setImagePreviews(editingProduct.images || []); // Use existing images for previews
    } else {
      setName("");
      setDescription("");
      setSelectedSubCategory("");
      setVariants([{ ram: "4 GB", price: 529.99, qty: 1 }]);
      setImages([]);
      setImagePreviews([]);
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
    if (files.length + images.length > 3) {
      toast.error("You can upload a maximum of 3 images.");
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    // Generate base64 previews for raw files
    const previews = await Promise.all(
      files.map(async (file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      })
    );
    setImagePreviews([...imagePreviews, ...previews]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  // ...existing code...
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    // For new products, at least one image file is required
    if (images.length === 0 && !editingProduct?.images) {
      toast.error("At least one image is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    if (description.trim()) formData.append("description", description.trim());
    formData.append("subCategory", selectedSubCategory);
    formData.append(
      "variants",
      JSON.stringify(variants.filter((v) => v.ram && v.price > 0))
    );

    // Append raw image files (binary)
    images.forEach((image, index) => {
      formData.append("images", image); // 'images' key for each file
    });

    // If editing, send existing image URLs/IDs separately
    if (editingProduct?.images?.length) {
      formData.append("existingImages", JSON.stringify(editingProduct.images));
      formData.append("_id", editingProduct._id);
    }

    try {
      // Pass formData to your API handler
      onAdd(formData);
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
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to save product. Please try again.");
    }
  };
  // ...existing code...

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
              <Label htmlFor="product-name">Title :</Label>
              <Input
                id="product-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="HP AMD Ryzen 3"
              />
            </div>

            <div>
              <Label className="text-gray-500">Variants :</Label>
              <div className="space-y-3 mt-2">
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <Label className="text-sm text-gray-500">RAM:</Label>
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
                      <Label className="text-sm text-gray-500">Price:</Label>
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
                      <Label className="text-sm text-gray-500">QTY:</Label>
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
              <Label htmlFor="subcategory">Subcategory :</Label>
              <Select
                value={selectedSubCategory}
                onValueChange={setSelectedSubCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a subcategory" />
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
              <Label htmlFor="description">Description :</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="The Ryzen 7 is a more high-end processor that compares to the Int..."
                rows={3}
              />
            </div>

            <div>
              <Label>Upload Images (Max 3):</Label>
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
                      X
                    </Button>
                  </div>
                ))}
                {imagePreviews.length < 3 && (
                  <label
                    htmlFor="image-upload"
                    className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50"
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
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8"
            >
              {editingProduct ? "UPDATE" : "ADD"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-8"
            >
              DISCARD
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
