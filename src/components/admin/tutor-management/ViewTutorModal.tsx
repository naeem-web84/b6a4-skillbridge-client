// components/admin/tutor/ViewTutorModal.tsx
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
  GraduationCap, 
  Calendar, 
  DollarSign,
  Star,
  Award,
  BookOpen,
  Clock,
  ExternalLink,
  Copy,
  Edit,
  Briefcase,
  FileText
} from "lucide-react";
import type { TutorProfile } from "@/services/admin.service";
import { format } from "date-fns";

interface ViewTutorModalProps {
  tutor: TutorProfile;
  isOpen: boolean;
  onClose: () => void;
  onEditClick?: () => void;
}

export default function ViewTutorModal({
  tutor,
  isOpen,
  onClose,
  onEditClick,
}: ViewTutorModalProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy • hh:mm a");
    } catch {
      return dateString;
    }
  };

  const handleCopyTutorId = () => {
    navigator.clipboard.writeText(tutor.id);
    alert("Tutor ID copied to clipboard!");
  };

  const user = tutor.user || { name: "Unknown Tutor", email: "No email", status: "Unknown" };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Tutor Profile: {user.name}
          </DialogTitle>
          <DialogDescription>
            View complete tutor information and performance metrics
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tutor Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{user.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              <Badge variant="default" className="gap-1">
                <Star className="w-3 h-3 text-yellow-500" />
                {tutor.rating.toFixed(1)}/5 ({tutor.totalReviews} reviews)
              </Badge>
              <Badge variant="outline" className="gap-1">
                <DollarSign className="w-3 h-3" />
                ${tutor.hourlyRate}/hr
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
                  <span className="text-sm text-muted-foreground">Account Status</span>
                  <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                    {user.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Professional Headline</span>
                  <span className="font-medium text-right">{tutor.headline}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Tutor Details
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tutor ID</span>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                      {tutor.id.substring(0, 8)}...
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={handleCopyTutorId}
                      title="Copy Tutor ID"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(tutor.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Updated</span>
                  <span className="font-medium">
                    {formatDate(tutor.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <Separator />
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Professional Details
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Hourly Rate</span>
                <div className="flex items-center gap-1 p-3 bg-muted/30 rounded">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-lg font-bold">{tutor.hourlyRate}</span>
                  <span className="text-sm text-muted-foreground">/hour</span>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Rating</span>
                <div className="flex items-center gap-1 p-3 bg-muted/30 rounded">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-lg font-bold">{tutor.rating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">/5</span>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Experience</span>
                <div className="flex items-center gap-1 p-3 bg-muted/30 rounded">
                  <Award className="w-4 h-4" />
                  <span className="text-lg font-bold">{tutor.experienceYears}</span>
                  <span className="text-sm text-muted-foreground">years</span>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Sessions</span>
                <div className="flex items-center gap-1 p-3 bg-muted/30 rounded">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-lg font-bold">{tutor.completedSessions}</span>
                  <span className="text-sm text-muted-foreground">completed</span>
                </div>
              </div>
            </div>

            {/* Education & Certifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {tutor.education && (
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Education</span>
                  <p className="text-sm p-3 bg-muted/30 rounded">{tutor.education}</p>
                </div>
              )}
              {tutor.certifications && (
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Certifications</span>
                  <p className="text-sm p-3 bg-muted/30 rounded">{tutor.certifications}</p>
                </div>
              )}
            </div>

            {/* Bio */}
            {tutor.bio && (
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Bio & Introduction</span>
                <p className="text-sm p-3 bg-muted/30 rounded">{tutor.bio}</p>
              </div>
            )}
          </div>

          {/* Categories */}
          {tutor.categories && tutor.categories.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Teaching Categories
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tutor.categories.map((category) => (
                    <Badge key={category.id} variant="secondary">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Statistics */}
          {tutor.stats && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Performance Statistics
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2 text-center p-3 bg-muted/30 rounded">
                    <div className="text-2xl font-bold">{tutor.stats.bookings || 0}</div>
                    <div className="text-sm text-muted-foreground">Total Bookings</div>
                  </div>
                  <div className="space-y-2 text-center p-3 bg-muted/30 rounded">
                    <div className="text-2xl font-bold">{tutor.stats.reviews || 0}</div>
                    <div className="text-sm text-muted-foreground">Reviews</div>
                  </div>
                  <div className="space-y-2 text-center p-3 bg-muted/30 rounded">
                    <div className="text-2xl font-bold">{tutor.stats.availabilitySlots || 0}</div>
                    <div className="text-sm text-muted-foreground">Available Slots</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              className="gap-2 ml-auto"
              onClick={handleCopyTutorId}
            >
              <Copy className="w-4 h-4" />
              Copy Tutor ID
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}