"use client"

import type React from "react"

import { useState } from "react"
import { ICategory, ISubCategory } from "../../types/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

interface AddSubCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (subCategory: Omit<ISubCategory, "_id">) => void
  categories: ICategory[]
}

export function AddSubCategoryModal({ open, onOpenChange, onAdd, categories }: AddSubCategoryModalProps) {
  const [name, setName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && selectedCategory) {
      onAdd({
        name: name.trim(),
        category: selectedCategory,
      })
      setName("")
      setSelectedCategory("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-gray-700">Add Sub Category</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="parent-category" className="sr-only">
                Parent category
              </Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id!}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subcategory-name" className="sr-only">
                Sub category name
              </Label>
              <Input
                id="subcategory-name"
                placeholder="Enter sub category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-center"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button type="submit" className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-8">
              ADD
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="px-8">
              DISCARD
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
