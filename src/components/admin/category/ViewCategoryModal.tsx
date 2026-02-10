// components/admin/category/ViewCategoryModal.tsx
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Tag, 
  Calendar, 
  Users, 
  BookOpen,
  Copy,
  Edit,
  FileText
} from "lucide-react";
import type { Category } from "@/services/admin.service";
import { format } from "date-fns";

interface ViewCategoryModalProps {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
  onEditClick?: () => void;
}

export default function ViewCategoryModal({
  category,
  isOpen,
  onClose,
  onEditClick,
}: ViewCategoryModalProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy • hh:mm a");
    } catch {
      return dateString;
    }
  };

  const handleCopyCategoryId = () => {
    navigator.clipboard.writeText(category.id);
    alert("Category ID copied to clipboard!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Category Details: {category.name}
          </DialogTitle>
          <DialogDescription>
            View complete category information and statistics
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Category Header */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Tag className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Users className="w-3 h-3" />
                {category._count?.tutorCategories || 0} tutors
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <BookOpen className="w-3 h-3" />
                {category._count?.bookings || 0} bookings
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Basic Information
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Category Name</span>
                  <span className="font-medium">{category.name}</span>
                </div>
                {category.description && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Description</span>
                    <span className="font-medium text-right">{category.description}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Category ID</span>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                      {category.id.substring(0, 8)}...
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={handleCopyCategoryId}
                      title="Copy Category ID"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Timeline
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(category.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Updated</span>
                  <span className="font-medium">
                    {formatDate(category.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <Separator />
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Users className="w-4 h-4" />
              Usage Statistics
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-3xl font-bold">{category._count?.tutorCategories || 0}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" />
                  Associated Tutors
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Number of tutors offering this category
                </p>
              </div>
              <div className="space-y-2 text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-3xl font-bold">{category._count?.bookings || 0}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Total Bookings
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Number of bookings in this category
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {onEditClick && (
              <Button
                variant="default"
                className="gap-2"
                onClick={onEditClick}
              >
                <Edit className="w-4 h-4" />
                Edit Category
              </Button>
            )}
            <Button
              variant="outline"
              className="gap-2 ml-auto"
              onClick={handleCopyCategoryId}
            >
              <Copy className="w-4 h-4" />
              Copy Category ID
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}