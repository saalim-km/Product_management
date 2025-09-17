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
    <div className="w-64 bg-white border-r border-blue-100 p-4">
      <h2 className="font-semibold text-lg mb-4 text-blue-900">Categories</h2>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-blue-900">
          <input
            type="checkbox"
            checked={!selectedCategory}
            onChange={() => onCategorySelect("")}
            className="h-4 w-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium">All categories</span>
        </label>

        {categories.map((category) => {
          const categorySubCategories = getCategorySubCategories(category._id!)
          const isExpanded = expandedCategories.has(category._id!)
          const hasSubCategories = categorySubCategories.length > 0

          return (
            <div key={category._id} className="space-y-1">
              <div className="flex items-center group">
                <label className="flex-1 flex items-center gap-2 text-blue-900">
                  <input
                    type="checkbox"
                    checked={selectedCategory === category._id}
                    onChange={() => {
                      onCategorySelect(
                        selectedCategory === category._id ? "" : category._id!
                      )
                      if (selectedCategory === category._id) {
                        onSubCategorySelect("")
                      }
                    }}
                    className="h-4 w-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">{category.name}</span>
                </label>

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
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => toggleCategory(category._id!)}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {isExpanded && hasSubCategories && (
                <div className="ml-6 space-y-1">
                  {categorySubCategories.map((subCategory) => (
                    <div key={subCategory._id} className="flex items-center group">
                      <label className="flex-1 flex items-center gap-2 text-blue-800">
                        <input
                          type="checkbox"
                          checked={selectedSubCategory === subCategory._id}
                          onChange={() =>
                            onSubCategorySelect(
                              selectedSubCategory === subCategory._id
                                ? ""
                                : subCategory._id!
                            )
                          }
                          className="h-4 w-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm">{subCategory.name}</span>
                      </label>
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