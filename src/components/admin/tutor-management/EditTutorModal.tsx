// components/admin/tutor/EditTutorModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { adminService, type TutorProfile, type UpdateTutorData } from "@/services/admin.service";
import {
  User,
  Mail,
  GraduationCap,
  Calendar,
  DollarSign,
  Star,
  Award,
  BookOpen,
  Save,
  ExternalLink,
  Briefcase,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface EditTutorModalProps {
  tutor: TutorProfile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditTutorModal({
  tutor,
  isOpen,
  onClose,
  onSuccess,
}: EditTutorModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateTutorData>({
    headline: tutor.headline,
    bio: tutor.bio,
    hourlyRate: tutor.hourlyRate,
    experienceYears: tutor.experienceYears,
    education: tutor.education,
    certifications: tutor.certifications,
    rating: tutor.rating,
    totalReviews: tutor.totalReviews,
    completedSessions: tutor.completedSessions,
  });

  // Update form data when tutor changes
  useEffect(() => {
    setFormData({
      headline: tutor.headline,
      bio: tutor.bio,
      hourlyRate: tutor.hourlyRate,
      experienceYears: tutor.experienceYears,
      education: tutor.education,
      certifications: tutor.certifications,
      rating: tutor.rating,
      totalReviews: tutor.totalReviews,
      completedSessions: tutor.completedSessions,
    });
  }, [tutor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await adminService.tutors.updateTutorProfile(tutor.id, formData);
      if (response.success) {
        toast.success("Tutor updated successfully");
        onSuccess();
        onClose();
      } else {
        toast.error(response.message || "Failed to update tutor");
      }
    } catch (error) {
      toast.error("Failed to update tutor");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this tutor? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await adminService.tutors.deleteTutor(tutor.id);
      if (response.success) {
        toast.success("Tutor deleted successfully");
        onSuccess();
        onClose();
      } else {
        toast.error(response.message || "Failed to delete tutor");
      }
    } catch (error) {
      toast.error("Failed to delete tutor");
      console.error(error);
    }
  };

  const handleViewFullProfile = () => {
    onClose();
    if (tutor.userId) {
      router.push(`/admin/users/${tutor.userId}`);
    }
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
            <GraduationCap className="w-5 h-5" />
            Edit Tutor: {tutor.user?.name || "Unknown Tutor"}
          </DialogTitle>
          <DialogDescription>
            Update tutor profile details, pricing, and experience
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="headline">Professional Headline *</Label>
                    <Input
                      id="headline"
                      value={formData.headline || ""}
                      onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                      placeholder="e.g., Expert Math Tutor with 5+ Years Experience"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="hourlyRate"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.hourlyRate}
                        onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) })}
                        className="pl-10"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio & Introduction</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio || ""}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell students about your teaching style, experience, and qualifications..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experienceYears">Years of Experience</Label>
                    <Input
                      id="experienceYears"
                      type="number"
                      min="0"
                      max="50"
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating (0-5)</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                      placeholder="0.0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="education">Education</Label>
                    <Input
                      id="education"
                      value={formData.education || ""}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      placeholder="e.g., MSc in Mathematics, University of..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="certifications">Certifications</Label>
                    <Input
                      id="certifications"
                      value={formData.certifications || ""}
                      onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                      placeholder="e.g., Certified Tutor, TEFL Certificate, etc."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalReviews">Total Reviews</Label>
                    <Input
                      id="totalReviews"
                      type="number"
                      min="0"
                      value={formData.totalReviews}
                      onChange={(e) => setFormData({ ...formData, totalReviews: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="completedSessions">Completed Sessions</Label>
                    <Input
                      id="completedSessions"
                      type="number"
                      min="0"
                      value={formData.completedSessions}
                      onChange={(e) => setFormData({ ...formData, completedSessions: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              {/* Categories Section */}
              {tutor.categories && tutor.categories.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Teaching Categories
                    </h3>
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
            </div>

            {/* Right Column - Summary */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Tutor Summary
                </h3>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">{tutor.user?.name || "Unknown Tutor"}</h4>
                    <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {tutor.user?.email || "No email"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current Rate</span>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">${tutor.hourlyRate}</span>
                      <span className="text-sm text-muted-foreground">/hour</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Experience</span>
                    <span className="font-semibold flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {tutor.experienceYears} years
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Rating</span>
                    <span className="font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {tutor.rating}/5 ({tutor.totalReviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sessions</span>
                    <span className="font-semibold flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {tutor.completedSessions} completed
                    </span>
                  </div>
                  {tutor.stats && (
                    <>
                      <Separator />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-center p-2 bg-muted/20 rounded">
                          <div className="text-2xl font-bold">{tutor.stats.bookings || 0}</div>
                          <div className="text-xs text-muted-foreground">Bookings</div>
                        </div>
                        <div className="text-center p-2 bg-muted/20 rounded">
                          <div className="text-2xl font-bold">{tutor.stats.reviews || 0}</div>
                          <div className="text-xs text-muted-foreground">Reviews</div>
                        </div>
                        <div className="text-center p-2 bg-muted/20 rounded col-span-2">
                          <div className="text-2xl font-bold">{tutor.stats.availabilitySlots || 0}</div>
                          <div className="text-xs text-muted-foreground">Availability Slots</div>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Member Since</span>
                    <span className="text-sm flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(tutor.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3"> 
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full"
                  onClick={handleDelete}
                >
                  Delete Tutor Profile
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
};