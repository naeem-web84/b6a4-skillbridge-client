// components/admin/user-management/view-user-modal.tsx
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
  User, 
  Mail, 
  Shield, 
  GraduationCap, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Edit,
  ExternalLink,
  BookOpen,
  DollarSign,
  Award,
  Star,
  Clock,
  Copy
} from "lucide-react";
import type { AdminUser } from "@/services/admin.service";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface ViewUserModalProps {
  user: AdminUser;
  isOpen: boolean;
  onClose: () => void;
  onEditClick?: () => void;
}

export default function ViewUserModal({
  user,
  isOpen,
  onClose,
  onEditClick,
}: ViewUserModalProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy • hh:mm a");
    } catch {
      return dateString;
    }
  };
 

  const handleCopyUserId = () => {
    navigator.clipboard.writeText(user.id);
    alert("User ID copied to clipboard!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            User Profile: {user.name}
          </DialogTitle>
          <DialogDescription>
            View complete user information and details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <User className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold">{user.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:ml-auto">
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
          </div>

          <Separator />

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <User className="w-4 h-4" />
                Basic Information
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Full Name</span>
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email Verified</span>
                  <Badge variant={user.emailVerified ? "default" : "outline"} className="gap-1">
                    {user.emailVerified ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        Unverified
                      </>
                    )}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(user.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Updated</span>
                  <span className="font-medium">
                    {formatDate(user.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Account Details
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">User ID</span>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                      {user.id.substring(0, 8)}...
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={handleCopyUserId}
                      title="Copy User ID"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Account Status</span>
                  <Badge
                    variant={
                      user.status === "Active"
                        ? "default"
                        : user.status === "Suspended"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {user.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Role</span>
                  <Badge
                    variant={
                      user.role === "ADMIN"
                        ? "destructive"
                        : user.role === "TUTOR"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {user.role}
                  </Badge>
                </div>
                {user.profile && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Profile Type</span>
                      <span className="font-medium">{user.role === "TUTOR" ? "Tutor" : "Student"} Profile</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Profile Information */}
          {user.profile && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {user.role === "TUTOR" ? "Tutor" : "Student"} Profile Details
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {user.profile.headline && (
                    <div className="col-span-2 space-y-2">
                      <span className="text-sm text-muted-foreground">Headline</span>
                      <p className="text-sm p-3 bg-muted/30 rounded">{user.profile.headline}</p>
                    </div>
                  )}
                  {user.profile.bio && (
                    <div className="col-span-2 space-y-2">
                      <span className="text-sm text-muted-foreground">Bio</span>
                      <p className="text-sm p-3 bg-muted/30 rounded">{user.profile.bio}</p>
                    </div>
                  )}
                  {user.profile.hourlyRate !== undefined && (
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Hourly Rate</span>
                      <div className="flex items-center gap-1 p-3 bg-muted/30 rounded">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-lg font-bold">{user.profile.hourlyRate}</span>
                        <span className="text-sm text-muted-foreground">/hour</span>
                      </div>
                    </div>
                  )}
                  {user.profile.rating !== undefined && (
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Rating</span>
                      <div className="flex items-center gap-1 p-3 bg-muted/30 rounded">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-lg font-bold">{user.profile.rating}</span>
                        <span className="text-sm text-muted-foreground">/5</span>
                      </div>
                    </div>
                  )}
                  {user.profile.experienceYears !== undefined && (
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Experience</span>
                      <div className="flex items-center gap-1 p-3 bg-muted/30 rounded">
                        <Award className="w-4 h-4" />
                        <span className="text-lg font-bold">{user.profile.experienceYears}</span>
                        <span className="text-sm text-muted-foreground">years</span>
                      </div>
                    </div>
                  )}
                  {user.profile.totalReviews !== undefined && (
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Reviews</span>
                      <div className="flex items-center gap-1 p-3 bg-muted/30 rounded">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-lg font-bold">{user.profile.totalReviews}</span>
                        <span className="text-sm text-muted-foreground">reviews</span>
                      </div>
                    </div>
                  )}
                  {user.profile.completedSessions !== undefined && (
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Sessions</span>
                      <div className="flex items-center gap-1 p-3 bg-muted/30 rounded">
                        <Clock className="w-4 h-4" />
                        <span className="text-lg font-bold">{user.profile.completedSessions}</span>
                        <span className="text-sm text-muted-foreground">completed</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Statistics */}
          {user._count && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Statistics
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {user._count.sessions !== undefined && (
                    <div className="space-y-2 text-center p-3 bg-muted/30 rounded">
                      <span className="text-sm text-muted-foreground">Active Sessions</span>
                      <div className="text-2xl font-bold">{user._count.sessions}</div>
                    </div>
                  )}
                  {user._count.accounts !== undefined && (
                    <div className="space-y-2 text-center p-3 bg-muted/30 rounded">
                      <span className="text-sm text-muted-foreground">Connected Accounts</span>
                      <div className="text-2xl font-bold">{user._count.accounts}</div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {onEditClick && (
              <Button
                variant="default"
                className="gap-2"
                onClick={onEditClick}
              >
                <Edit className="w-4 h-4" />
                Edit User
              </Button>
            )} 
            <Button
              variant="outline"
              className="gap-2 ml-auto"
              onClick={handleCopyUserId}
            >
              <Copy className="w-4 h-4" />
              Copy User ID
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}