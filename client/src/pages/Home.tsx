"use client";

import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ShoppingCart, User, LogOut } from "lucide-react";
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
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { productService } from "../services/product.service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import Pagination from "../components/ui/pagination";
import { userLogout } from "../store/slices/user.slice";
import { wishlistService } from "../services/wishlist.service";

export default function ProductManagement() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [wishlistItems, setWishlistItems] = useState<IProduct[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [fixedSearchQuery, setFixedSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSubCategory, setShowAddSubCategory] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showItemsSidebar, setShowItemsSidebar] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => {
    if (state.user) return state.user.user;
    return null;
  });

  // Pagination
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const handleLogout = () => {
    dispatch(userLogout());
    toast.success("Logged out successfully!");
  };

  const handleAddCategory = async (category: Omit<ICategory, "_id">) => {
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
  };

  const handleAddProduct = async (product: Omit<IProduct, "_id">) => {
    try {
      const res = await productService.createProduct(product);
      setProducts([res.data, ...products]);
      toast.success("Product added successfully!");
    } catch (error) {
      handleError(error);
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    try {
      const res = await wishlistService.addToWishlist(productId);

      const product = products.find((p) => p._id === productId);
      if (product && !wishlistItems.find((item) => item._id === productId)) {
        setWishlistItems([...wishlistItems, product]);
      }

      toast.success(res.message);
    } catch (error) {
      handleError(error);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      const res = await wishlistService.removeFromWishlist(productId);
      setWishlistItems(wishlistItems.filter((item) => item._id !== productId));
      toast.success(res.message);
    } catch (error) {
      handleError(error);
    }
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

  const handleDeleteSubCategory = async (subCategoryId: string) => {
    try {
      const res = await CategoryService.deleteSubCategory(subCategoryId);
      toast.success(res.message);
      setSubCategories(
        subCategories.filter((sub) => sub._id !== subCategoryId)
      );
      setProducts(
        products.filter((product) => product.subCategory !== subCategoryId)
      );

      if (selectedSubCategory === subCategoryId) {
        setSelectedSubCategory("");
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const res = await productService.deleteProduct(productId);
      setProducts(products.filter((product) => product._id !== productId));
      setWishlistItems(wishlistItems.filter((item) => item._id !== productId));
      toast.success(res.message);
    } catch (error) {
      handleError(error);
    }
  };

  const handleEditProduct = async (formData: FormData) => {
    try {
      // Extract product ID from formData or use editingProduct ID
      const productId = editingProduct?._id;
      if (!productId) {
        toast.error("Product ID not found");
        return;
      }

      // Send the formData to your API
      const res = await productService.updateProduct(productId, formData);

      // Update the products state with the updated product
      setProducts(
        products.map((product) =>
          product._id === productId ? res.data : product
        )
      );

      // Also update wishlist if needed
      setWishlistItems(
        wishlistItems.map((item) => (item._id === productId ? res.data : item))
      );

      setEditingProduct(null);
      setSelectedProduct(null);
      toast.success("Product updated successfully!");
    } catch (error) {
      handleError(error);
      toast.error("Failed to update product");
    }
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
    const fetchCategories = async () => {
      try {
        const res = await CategoryService.getAllCategories();
        setCategories(res.data);
      } catch (error) {
        handleError(error);
      }
    };

    const fetchSubCategories = async () => {
      try {
        const res = await CategoryService.getallsubcategories();
        setSubCategories(res.data);
      } catch (error) {
        handleError(error);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await productService.getAllProduct({
          search: fixedSearchQuery,
          page: currentPage,
          limit: itemsPerPage,
          category: selectedCategory,
          subCategory: selectedSubCategory,
        });
        setTotalProducts(res.data.count);
        setProducts(res.data.data);
      } catch (error) {
        handleError(error);
      }
    };

    const fetchWishlist = async () => {
      try {
        const res = await wishlistService.getWishlist();
        setWishlistItems(res.data);
      } catch (error) {
        handleError(error);
      }
    };

    fetchWishlist();
    fetchProducts();
    fetchSubCategories();
    fetchCategories();
  }, [
    fixedSearchQuery,
    selectedCategory,
    selectedSubCategory,
    currentPage,
    itemsPerPage,
  ]);

  if (selectedProduct) {
    return (
      <>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-teal-700 text-white p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="text-xl font-semibold">Product Management</div>

              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-white hover:text-gray-200"
                    >
                      <User className="h-4 w-4 mr-2" />
                      {user ? user.name : "Guest"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="ghost"
                  className="text-white hover:text-gray-200"
                  onClick={() => setShowItemsSidebar(true)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
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
            onAdd={handleEditProduct as any} // This now expects FormData
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
              <Button
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => {
                  setFixedSearchQuery(searchQuery);
                  setCurrentPage(1); // Reset to first page on search
                }}
              >
                Search
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-white hover:text-gray-900"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {user ? user.name : "Guest"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                className="text-white hover:text-gray-900"
                onClick={() => setShowItemsSidebar(true)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                WishList
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
              {totalProducts > 0 ? (
                products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onView={setSelectedProduct}
                    onEdit={() => setEditingProduct(product)}
                    onDelete={() => handleDeleteProduct(product._id!)}
                    onAddToWishlist={handleAddToWishlist}
                    isInWishlist={isInWishlist(product._id!)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500">
                  No products found.
                </div>
              )}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, totalProducts)} of{" "}
                {totalProducts} items
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
        onAdd={handleAddProduct as any}
        subCategories={subCategories}
      />

      {editingProduct && (
        <AddProductModal
          open={!!editingProduct}
          onOpenChange={() => setEditingProduct(null)}
          onAdd={handleEditProduct as any}
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