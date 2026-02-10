// components/admin/user-management/EditUserModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { adminService, type AdminUser, type UpdateUserData } from "@/services/admin.service";
import {
  User,
  Mail,
  Shield,
  GraduationCap,
  Calendar,
  CheckCircle,
  XCircle,
  Save,
  ExternalLink,
  Star,
} from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface EditUserModalProps {
  user: AdminUser;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditUserModal({
  user,
  isOpen,
  onClose,
  onSuccess,
}: EditUserModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateUserData>({
    name: user.name,
    role: user.role,
    status: user.status,
    emailVerified: user.emailVerified,
  });

  // Update form data when user changes
  useEffect(() => {
    setFormData({
      name: user.name,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
    });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await adminService.users.updateUser(user.id, formData);
      if (response.success) {
        toast.success("User updated successfully");
        onSuccess();
        onClose();
      } else {
        toast.error(response.message || "Failed to update user");
      }
    } catch (error) {
      toast.error("Failed to update user");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await adminService.users.deleteUser(user.id);
      if (response.success) {
        toast.success("User deleted successfully");
        onSuccess();
        onClose();
      } else {
        toast.error(response.message || "Failed to delete user");
      }
    } catch (error) {
      toast.error("Failed to delete user");
      console.error(error);
    }
  };

  const handleViewFullProfile = () => {
    onClose();
    router.push(`/admin/users/${user.id}`);
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Edit User: {user.name}
          </DialogTitle>
          <DialogDescription>
            Update user details, role, status, and email verification
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md border bg-muted/50">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STUDENT">Student</SelectItem>
                        <SelectItem value="TUTOR">Tutor</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-verified" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Verification
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle email verification status
                    </p>
                  </div>
                  <Switch
                    id="email-verified"
                    checked={formData.emailVerified}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, emailVerified: checked })
                    }
                  />
                </div>
              </div>

              {user.profile && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Profile Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {user.profile.headline && (
                        <div className="col-span-2 space-y-2">
                          <Label className="text-muted-foreground">Headline</Label>
                          <p className="text-sm p-2 bg-muted/50 rounded">{user.profile.headline}</p>
                        </div>
                      )}
                      {user.profile.hourlyRate !== undefined && (
                        <div className="space-y-2">
                          <Label className="text-muted-foreground">Hourly Rate</Label>
                          <div className="flex items-center gap-1">
                            <span className="text-lg font-semibold">${user.profile.hourlyRate}</span>
                            <span className="text-sm text-muted-foreground">/hour</span>
                          </div>
                        </div>
                      )}
                      {user.profile.rating !== undefined && (
                        <div className="space-y-2">
                          <Label className="text-muted-foreground">Rating</Label>
                          <div className="flex items-center gap-1">
                            <span className="text-lg font-semibold">{user.profile.rating}</span>
                            <span className="text-sm text-muted-foreground">/5</span>
                            <Star className="w-4 h-4 text-yellow-500 ml-1" />
                          </div>
                        </div>
                      )}
                      {user.profile.experienceYears !== undefined && (
                        <div className="space-y-2">
                          <Label className="text-muted-foreground">Experience</Label>
                          <p className="text-lg font-semibold">{user.profile.experienceYears} years</p>
                        </div>
                      )}
                      {user.profile.totalReviews !== undefined && (
                        <div className="space-y-2">
                          <Label className="text-muted-foreground">Total Reviews</Label>
                          <p className="text-lg font-semibold">{user.profile.totalReviews}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right Column - Summary */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="w-4 h-4" />
                  User Summary
                </h3>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-12 h-12 rounded-full" />
                    ) : (
                      <User className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{user.name}</h4>
                    <p className="text-sm text-muted-foreground truncate max-w-[200px]">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Role</span>
                    <Badge
                      variant={
                        user.role === "ADMIN"
                          ? "destructive"
                          : user.role === "TUTOR"
                          ? "default"
                          : "secondary"
                      }
                      className="gap-1"
                    >
                      {user.role === "ADMIN" && <Shield className="w-3 h-3" />}
                      {user.role === "TUTOR" && <GraduationCap className="w-3 h-3" />}
                      {user.role === "STUDENT" && <User className="w-3 h-3" />}
                      {user.role}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge
                      variant={
                        user.status === "Active"
                          ? "default"
                          : user.status === "Suspended"
                          ? "destructive"
                          : "secondary"
                      }
                      className="gap-1"
                    >
                      {user.status === "Active" && <CheckCircle className="w-3 h-3" />}
                      {user.status === "Suspended" && <XCircle className="w-3 h-3" />}
                      {user.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Email Verified</span>
                    <Badge variant={user.emailVerified ? "default" : "outline"}>
                      {user.emailVerified ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          Unverified
                        </span>
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Member Since</span>
                    <span className="text-sm flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleViewFullProfile}
                >
                  <ExternalLink className="w-4 h-4" />
                  View Full Profile
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full"
                  onClick={handleDelete}
                >
                  Delete User
                </Button>
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