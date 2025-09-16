"use client"

import { ChevronDown, ChevronRight, Trash2 } from "lucide-react"
import { useState } from "react"
import { ICategory, ISubCategory } from "../types/types"
import { Button } from "../components/ui/button"

interface CategorySidebarProps {
  categories: ICategory[]
  subCategories: ISubCategory[]
  selectedCategory?: string
  selectedSubCategory?: string
  onCategorySelect: (categoryId: string) => void
  onSubCategorySelect: (subCategoryId: string) => void
  onDeleteCategory: (categoryId: string) => void
  onDeleteSubCategory: (subCategoryId: string) => void
}

export function CategorySidebar({
  categories,
  subCategories,
  selectedCategory,
  selectedSubCategory,
  onCategorySelect,
  onSubCategorySelect,
  onDeleteCategory,
  onDeleteSubCategory,
}: CategorySidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const getCategorySubCategories = (categoryId: string) => {
    return subCategories.filter((sub) => sub.category === categoryId)
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h2 className="font-semibold text-lg mb-4 text-slate-800">Categories</h2>

      <div className="space-y-2">
        <Button
          variant={!selectedCategory ? "secondary" : "ghost"}
          className="w-full justify-start text-left"
          onClick={() => onCategorySelect("")}
        >
          All categories
        </Button>

        {categories.map((category) => {
          const categorySubCategories = getCategorySubCategories(category._id!)
          const isExpanded = expandedCategories.has(category._id!)
          const hasSubCategories = categorySubCategories.length > 0

          return (
            <div key={category._id}>
              <div className="flex items-center group">
                <Button
                  variant={selectedCategory === category._id ? "secondary" : "ghost"}
                  className="flex-1 justify-start text-left"
                  onClick={() => onCategorySelect(category._id!)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-800 rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{category.name.charAt(0).toUpperCase()}</span>
                    </div>
                    {category.name}
                  </div>
                </Button>

                <div className="flex items-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                    onClick={() => onDeleteCategory(category._id!)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>

                  {hasSubCategories && (
                    <Button size="sm" variant="ghost" onClick={() => toggleCategory(category._id!)}>
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
              </div>

              {isExpanded && hasSubCategories && (
                <div className="ml-6 mt-1 space-y-1">
                  {categorySubCategories.map((subCategory) => (
                    <div key={subCategory._id} className="flex items-center group">
                      <Button
                        variant={selectedSubCategory === subCategory._id ? "secondary" : "ghost"}
                        size="sm"
                        className="flex-1 justify-start text-left"
                        onClick={() => onSubCategorySelect(subCategory._id!)}
                      >
                        {subCategory.name}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                        onClick={() => onDeleteSubCategory(subCategory._id!)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
