// components/admin/category/CategoryRow.tsx
"use client";

import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tag,
  BookOpen,
  Users,
  Calendar,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Copy,
} from "lucide-react";
import type { Category } from "@/services/admin.service";
import { format } from "date-fns";
import EditCategoryModal from "./EditCategoryModal";
import ViewCategoryModal from "./ViewCategoryModal";

interface CategoryRowProps {
  category: Category;
  onUpdateCategory: (categoryId: string, data: any) => Promise<void>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
  onRefresh?: () => void;
}

export default function CategoryRow({ 
  category, 
  onUpdateCategory, 
  onDeleteCategory,
  onRefresh 
}: CategoryRowProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const handleCopyCategoryId = () => {
    navigator.clipboard.writeText(category.id);
    alert("Category ID copied to clipboard!");
  };

  const handleModalSuccess = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Tag className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-medium">{category.name}</div>
              {category.description && (
                <div className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]">
                  {category.description}
                </div>
              )}
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3 text-muted-foreground" />
              <Badge variant="outline" className="gap-1">
                {category._count?.tutorCategories || 0} tutors
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-3 h-3 text-muted-foreground" />
              <Badge variant="secondary" className="gap-1">
                {category._count?.bookings || 0} bookings
              </Badge>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="text-sm">
            {formatDate(category.createdAt)}
          </div>
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Category Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => setShowViewModal(true)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Category
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={handleCopyCategoryId}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Category ID
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => onDeleteCategory(category.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Category
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {/* View Category Modal */}
      <ViewCategoryModal
        category={category}
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        onEditClick={() => {
          setShowViewModal(false);
          setShowEditModal(true);
        }}
      />

      {/* Edit Category Modal */}
      <EditCategoryModal
        category={category}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={handleModalSuccess}
        onUpdateCategory={onUpdateCategory}
      />
    </>
  );
}