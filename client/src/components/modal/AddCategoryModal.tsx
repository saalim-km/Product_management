"use client"

import type React from "react"

import { useState } from "react"
import { ICategory } from "../../types/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

interface AddCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (category: Omit<ICategory, "_id">) => void
}

export function AddCategoryModal({ open, onOpenChange, onAdd }: AddCategoryModalProps) {
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onAdd({ name: name.trim() })
      setName("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-gray-700">Add Category</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category-name" className="sr-only">
              Category name
            </Label>
            <Input
              id="category-name"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-center"
            />
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
