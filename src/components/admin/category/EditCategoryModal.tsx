// components/admin/category/EditCategoryModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Tag, 
  Calendar, 
  Users, 
  BookOpen, 
  Save,
  Copy
} from "lucide-react";
import type { Category, UpdateCategoryData } from "@/services/admin.service";
import { format } from "date-fns";

interface EditCategoryModalProps {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onUpdateCategory: (categoryId: string, data: UpdateCategoryData) => Promise<void>;
}

export default function EditCategoryModal({
  category,
  isOpen,
  onClose,
  onSuccess,
  onUpdateCategory,
}: EditCategoryModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateCategoryData>({
    name: category.name,
    description: category.description,
  });

  // Update form data when category changes
  useEffect(() => {
    setFormData({
      name: category.name,
      description: category.description,
    });
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name?.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);
      await onUpdateCategory(category.id, formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCategoryId = () => {
    navigator.clipboard.writeText(category.id);
    toast.success("Category ID copied to clipboard!");
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy • HH:mm");
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Edit Category: {category.name}
          </DialogTitle>
          <DialogDescription>
            Update category details and description
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Form */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter category name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what this category covers..."
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Category Summary
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
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
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Created</span>
                    <span className="text-sm flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(category.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Updated</span>
                    <span className="text-sm">
                      {formatDate(category.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Statistics */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Statistics
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 text-center p-3 bg-muted/20 rounded">
                    <div className="text-2xl font-bold">{category._count?.tutorCategories || 0}</div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                      <Users className="w-3 h-3" />
                      Tutors
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-center p-3 bg-muted/20 rounded">
                    <div className="text-2xl font-bold">{category._count?.bookings || 0}</div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      Bookings
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
              <Save className="w-4 h-4 ml-2" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}