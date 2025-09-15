"use client"

import { X } from "lucide-react"
import { Button } from "../components/ui/button"
import { IProduct } from "../types/types"
import { Card, CardContent } from "../components/ui/card"

interface ItemsSidebarProps {
  isOpen: boolean
  onClose: () => void
  items: IProduct[]
  onRemoveItem: (productId: string) => void
}

export function ItemsSidebar({ isOpen, onClose, items, onRemoveItem }: ItemsSidebarProps) {
  if (!isOpen) return null

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg border-l border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">♥</span>
            </div>
            Items
          </h2>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto h-full pb-20">
        {items.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">No items in your list</div>
        ) : (
          items.map((item) => (
            <Card key={item._id} className="relative">
              <CardContent className="p-3">
                <div className="flex gap-3">
                  <img src="/modern-laptop-workspace.png" alt={item.name} className="w-16 h-12 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-slate-800 truncate">{item.name}</h3>
                    <div className="text-sm font-semibold text-slate-900">${item.variants[0]?.price}</div>
                    <div className="flex gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="w-3 h-3 bg-gray-200 rounded-sm" />
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={() => onRemoveItem(item._id!)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
