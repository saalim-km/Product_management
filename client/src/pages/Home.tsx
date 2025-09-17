"use client";

import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { ICategory, IProduct, ISubCategory } from "../types/types";
import { ItemsSidebar } from "./ItemSidebar";
import { AddProductModal } from "../components/modal/AddProductModal";
import { AddCategoryModal } from "../components/modal/AddCategoryModal";
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
import { ProductCard } from "../components/ProductCard";
import { AddSubCategoryModal } from "../components/modal/AddSubcategoryModal";
import { CategorySidebar } from "./CategorySidebar";

export default function ProductManagement() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [wishlistItems, setWishlistItems] = useState<IProduct[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
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
      await productService.createProduct(product);
      toast.success("Product added successfully!");
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
      const productId = editingProduct?._id;
      if (!productId) {
        toast.error("Product ID not found");
        return;
      }

      const res = await productService.updateProduct(productId, formData);

      setProducts(
        products.map((product) =>
          product._id === productId ? res.data : product
        )
      );

      setWishlistItems(
        wishlistItems.map((item) => (item._id === productId ? res.data : item))
      );

      setEditingProduct(null);
    } catch (error) {
      handleError(error);
      toast.error("Failed to update product");
    }
  };

  const getBreadcrumbs = () => {
    return [{ label: "Home", onClick: () => {} }];
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

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-blue-900 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold">Product Management</div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-blue-800 hover:text-white transition-colors"
                >
                  <User className="h-5 w-5 mr-2" />
                  {user ? user.name : "Guest"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-white border-blue-100"
              >
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-blue-900 hover:bg-blue-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              className="text-white hover:bg-blue-800 hover:text-white transition-colors"
              onClick={() => setShowItemsSidebar(true)}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Wishlist
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
          onCategorySelect={setSelectedCategory}
          onSubCategorySelect={setSelectedSubCategory}
          onDeleteCategory={handleDeleteCategory}
          onDeleteSubCategory={handleDeleteSubCategory}
        />

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Search Bar */}
          <div className="flex items-center gap-4 mb-6 max-w-md">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white text-blue-900 rounded-lg shadow-sm border-blue-200 focus:ring-blue-500 focus:border-blue-500"
            />
            <Button
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md"
              onClick={() => {
                setFixedSearchQuery(searchQuery);
                setCurrentPage(1);
              }}
            >
              Search
            </Button>
          </div>

          {/* Breadcrumb and Actions */}
          <div className="flex items-center justify-between mb-6">
            <nav className="flex items-center gap-2 text-sm text-blue-600">
              {getBreadcrumbs().map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && <span>›</span>}
                  <button
                    onClick={crumb.onClick}
                    className="hover:text-blue-900 transition-colors"
                  >
                    {crumb.label}
                  </button>
                </div>
              ))}
            </nav>
            <div className="flex gap-3">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md cursor-pointer"
                onClick={() => setShowAddCategory(true)}
              >
                Add Category
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md cursor-pointer"
                onClick={() => setShowAddSubCategory(true)}
              >
                Add Subcategory
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md cursor-pointer"
                onClick={() => setShowAddProduct(true)}
              >
                Add Product
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {totalProducts > 0 ? (
              products.map((product) => (
                  <ProductCard
                    product={product}
                    onEdit={() => setEditingProduct(product)}
                    onDelete={() => handleDeleteProduct(product._id!)}
                    onAddToWishlist={handleAddToWishlist}
                    isInWishlist={isInWishlist(product._id!)}
                  />
              ))
            ) : (
              <div className="col-span-full text-center text-blue-600">
                No products found.
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-600">Show</span>
              <select
                className="border border-blue-200 rounded-lg px-2 py-1 text-sm text-blue-900 focus:ring-blue-500 focus:border-blue-500"
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
          <div className="text-sm text-blue-600 mt-4">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, totalProducts)} of{" "}
            {totalProducts} items
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
    </div>
  );
}
