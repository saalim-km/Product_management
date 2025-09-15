"use client";

import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ShoppingCart, User } from "lucide-react";
import { ICategory, IProduct, ISubCategory } from "../types/types";
import { ProductDetail } from "./ProductDetail";
import { ItemsSidebar } from "./ItemSidebar";
import { AddProductModal } from "../components/modal/AddProductModal";
import { CategorySidebar } from "./CategorySidebar";
import { ProductCard } from "../components/ProductCard";
import { AddCategoryModal } from "../components/modal/AddCategoryModal";
import { AddSubCategoryModal } from "../components/modal/AddSubcategoryModal";
import { CategoryService } from "../services/category.service";
import { handleError } from "../utils/error/error-handler.utils";
import { toast } from "sonner";

// Dummy data
const dummyCategories: ICategory[] = [
  { _id: "1", name: "Laptop" },
  { _id: "2", name: "Tablet" },
  { _id: "3", name: "Headphones" },
];

const dummySubCategories: ISubCategory[] = [
  { _id: "1", name: "HP", category: "1" },
  { _id: "2", name: "Dell", category: "1" },
  { _id: "3", name: "Apple", category: "2" },
];

const dummyProducts: IProduct[] = [
  {
    _id: "1",
    name: "HP AMD Ryzen 3",
    description:
      "The Ryzen 7 is a more high-end processor that compares to the Intel Core i7 series.",
    subCategory: "1",
    variants: [
      { ram: "4 GB", price: 529.99, qty: 34 },
      { ram: "8 GB", price: 629.99, qty: 20 },
      { ram: "16 GB", price: 729.99, qty: 15 },
    ],
  },
  {
    _id: "2",
    name: "HP A MD Ryzen 3",
    description: "High-performance laptop for professional use.",
    subCategory: "1",
    variants: [
      { ram: "4 GB", price: 529.99, qty: 25 },
      { ram: "8 GB", price: 629.99, qty: 18 },
    ],
  },
  {
    _id: "3",
    name: "HP AMD Ryzen 3",
    description: "Reliable laptop for everyday computing.",
    subCategory: "1",
    variants: [
      { ram: "4 GB", price: 529.99, qty: 40 },
      { ram: "8 GB", price: 629.99, qty: 30 },
    ],
  },
  {
    _id: "4",
    name: "HP AMD Ryzen 3",
    description: "Budget-friendly option with great performance.",
    subCategory: "1",
    variants: [{ ram: "4 GB", price: 529.99, qty: 22 }],
  },
  {
    _id: "5",
    name: "HP AMD Ryzen 3",
    description: "Premium laptop with advanced features.",
    subCategory: "1",
    variants: [
      { ram: "8 GB", price: 629.99, qty: 12 },
      { ram: "16 GB", price: 729.99, qty: 8 },
    ],
  },
  {
    _id: "6",
    name: "HP AMD Ryzen 3",
    description: "Versatile laptop for work and entertainment.",
    subCategory: "1",
    variants: [
      { ram: "4 GB", price: 529.99, qty: 35 },
      { ram: "8 GB", price: 629.99, qty: 25 },
    ],
  },
];

export default function ProductManagement() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [wishlistItems, setWishlistItems] = useState<IProduct[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSubCategory, setShowAddSubCategory] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showItemsSidebar, setShowItemsSidebar] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  // Filter products based on selected category/subcategory and search
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (selectedSubCategory) {
      return product.subCategory === selectedSubCategory && matchesSearch;
    }

    if (selectedCategory) {
      const categorySubCategories = subCategories
        .filter((sub) => sub.category === selectedCategory)
        .map((sub) => sub._id);
      return (
        categorySubCategories.includes(product.subCategory) && matchesSearch
      );
    }

    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleAddCategory = async (category: Omit<ICategory, "_id">) => {
    console.log("new category", category);
    try {
      const res = await CategoryService.addCategory(category.name);
      setCategories([res.data, ...categories]);
      toast.success(res.message);
    } catch (error) {
      handleError(error);
    }
  };

  const handleAddSubCategory = async (
    subCategory: Omit<ISubCategory, "_id">
  ) => {
    console.log("new sub category", subCategory);
    try {
      const res = await CategoryService.addSubCategory(
        subCategory.category,
        subCategory.name
      );
      toast.success(res.message);
      setSubCategories([res.data, ...subCategories]);
    } catch (error) {
      handleError(error);
    }
    const newSubCategory = { ...subCategory, _id: Date.now().toString() };
    setSubCategories([...subCategories, newSubCategory]);
  };

  const handleAddProduct = (product: Omit<IProduct, "_id">) => {
    console.log("new product", product);
    const newProduct = { ...product, _id: Date.now().toString() };
    setProducts([...products, newProduct]);
  };

  const handleAddToWishlist = (productId: string) => {
    const product = products.find((p) => p._id === productId);
    if (product && !wishlistItems.find((item) => item._id === productId)) {
      setWishlistItems([...wishlistItems, product]);
    }
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlistItems(wishlistItems.filter((item) => item._id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const res = await CategoryService.deleteCategory(categoryId);
      toast.success(res.message);
      const categorySubCategories = subCategories.filter(
        (sub) => sub.category === categoryId
      );
      const subCategoryIds = categorySubCategories.map((sub) => sub._id!);

      setCategories(categories.filter((cat) => cat._id !== categoryId));
      setSubCategories(
        subCategories.filter((sub) => sub.category !== categoryId)
      );
      setProducts(
        products.filter(
          (product) => !subCategoryIds.includes(product.subCategory)
        )
      );

      if (selectedCategory === categoryId) {
        setSelectedCategory("");
        setSelectedSubCategory("");
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleDeleteSubCategory = (subCategoryId: string) => {
    setSubCategories(subCategories.filter((sub) => sub._id !== subCategoryId));
    setProducts(
      products.filter((product) => product.subCategory !== subCategoryId)
    );

    if (selectedSubCategory === subCategoryId) {
      setSelectedSubCategory("");
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((product) => product._id !== productId));
    setWishlistItems(wishlistItems.filter((item) => item._id !== productId));
  };

  const handleEditProduct = (updatedProduct: IProduct) => {
    setProducts(
      products.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      )
    );
    setEditingProduct(null);
    setSelectedProduct(null);
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { label: "Home", onClick: () => setSelectedProduct(null) },
    ];

    if (selectedProduct) {
      breadcrumbs.push({ label: "Product details", onClick: () => {} });
    }

    return breadcrumbs;
  };

  useEffect(() => {
    // Fetch categories, subcategories, and products from API
    const fetchCategories = async () => {
      try {
        const res = await CategoryService.getAllCategories();
        setCategories(res.data);
      } catch (error) {
        handleError(error);
      }
    };

    const fetchsubCategories = async () => {
      try {
        const res = await CategoryService.getallsubcategories();
        setSubCategories(res.data);
      } catch (error) {
        handleError(error);
      }
    };

    fetchsubCategories();
    fetchCategories();
  }, []);
  if (selectedProduct) {
    return (
      <>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-teal-700 text-white p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="text-xl font-semibold">Product Management</div>

              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  className="text-white hover:text-gray-200"
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign in
                </Button>
                <Button
                  variant="ghost"
                  className="text-white hover:text-gray-200"
                  onClick={() => setShowItemsSidebar(true)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                </Button>
              </div>
            </div>
          </header>

          <ProductDetail
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            onEdit={() => setEditingProduct(selectedProduct)}
            onAddToWishlist={() => handleAddToWishlist(selectedProduct._id!)}
            isInWishlist={isInWishlist(selectedProduct._id!)}
            breadcrumbs={getBreadcrumbs()}
          />
        </div>

        <ItemsSidebar
          isOpen={showItemsSidebar}
          onClose={() => setShowItemsSidebar(false)}
          items={wishlistItems}
          onRemoveItem={handleRemoveFromWishlist}
        />

        {editingProduct && (
          <AddProductModal
            open={!!editingProduct}
            onOpenChange={() => setEditingProduct(null)}
            onAdd={handleEditProduct}
            subCategories={subCategories}
            editingProduct={editingProduct}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-teal-700 text-white p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <Input
                placeholder="Search any things"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white text-gray-900"
              />
              <Button className="bg-orange-500 hover:bg-orange-600">
                Search
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-white hover:text-gray-200"
              >
                <User className="h-4 w-4 mr-2" />
                Sign in
              </Button>
              <Button
                variant="ghost"
                className="text-white hover:text-gray-200"
                onClick={() => setShowItemsSidebar(true)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
              </Button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <CategorySidebar
            categories={categories}
            subCategories={subCategories}
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            onCategorySelect={(categoryId) => {
              setSelectedCategory(categoryId);
              setSelectedSubCategory("");
              setCurrentPage(1);
            }}
            onSubCategorySelect={(subCategoryId) => {
              setSelectedSubCategory(subCategoryId);
              setCurrentPage(1);
            }}
            onDeleteCategory={handleDeleteCategory}
            onDeleteSubCategory={handleDeleteSubCategory}
          />

          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Breadcrumb and Actions */}
            <div className="flex items-center justify-between mb-6">
              <nav className="flex items-center gap-2 text-sm text-gray-600">
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

              <div className="flex gap-3">
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => setShowAddCategory(true)}
                >
                  Add category
                </Button>
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => setShowAddSubCategory(true)}
                >
                  Add sub category
                </Button>
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => setShowAddProduct(true)}
                >
                  Add product
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onView={setSelectedProduct}
                  onEdit={() => setEditingProduct(product)}
                  onDelete={() => handleDeleteProduct(product._id!)}
                  onAddToWishlist={handleAddToWishlist}
                  isInWishlist={isInWishlist(product._id!)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {startIndex + 1} of {filteredProducts.length} items
                </div>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        size="sm"
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                        className={
                          currentPage === page
                            ? "bg-orange-500 hover:bg-orange-600"
                            : ""
                        }
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Show</span>
                  <select
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={3}>3 rows</option>
                    <option value={6}>6 rows</option>
                    <option value={10}>10 rows</option>
                    <option value={20}>20 rows</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddCategoryModal
        open={showAddCategory}
        onOpenChange={setShowAddCategory}
        onAdd={handleAddCategory}
      />

      <AddSubCategoryModal
        open={showAddSubCategory}
        onOpenChange={setShowAddSubCategory}
        onAdd={handleAddSubCategory}
        categories={categories}
      />

      <AddProductModal
        open={showAddProduct}
        onOpenChange={setShowAddProduct}
        onAdd={handleAddProduct}
        subCategories={subCategories}
      />

      {editingProduct && (
        <AddProductModal
          open={!!editingProduct}
          onOpenChange={() => setEditingProduct(null)}
          onAdd={handleEditProduct}
          subCategories={subCategories}
          editingProduct={editingProduct}
        />
      )}

      <ItemsSidebar
        isOpen={showItemsSidebar}
        onClose={() => setShowItemsSidebar(false)}
        items={wishlistItems}
        onRemoveItem={handleRemoveFromWishlist}
      />
    </>
  );
}
