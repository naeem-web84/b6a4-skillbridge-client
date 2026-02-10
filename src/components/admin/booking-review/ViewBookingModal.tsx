// components/admin/bookings-review/ViewBookingModal.tsx
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
  Calendar, 
  User, 
  GraduationCap, 
  DollarSign,
  Clock,
  CreditCard,
  BookOpen,
  ExternalLink,
  Copy,
  Edit,
  MessageSquare,
} from "lucide-react";
import type { Booking } from "@/services/admin.service";
import { format } from "date-fns";

interface ViewBookingModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onEditClick?: () => void;
}

export default function ViewBookingModal({
  booking,
  isOpen,
  onClose,
  onEditClick,
}: ViewBookingModalProps) {
  const formatDateTime = (dateString: string, timeString: string) => {
    try {
      const date = new Date(`${dateString}T${timeString}`);
      return format(date, "MMM dd, yyyy • hh:mm a");
    } catch {
      return `${dateString} ${timeString}`;
    }
  };

  const handleCopyBookingId = () => {
    navigator.clipboard.writeText(booking.id);
    alert("Booking ID copied to clipboard!");
  };

  const statusConfig = {
    PENDING: { variant: "outline" as const, color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    CONFIRMED: { variant: "default" as const, color: "bg-blue-50 text-blue-700 border-blue-200" },
    COMPLETED: { variant: "default" as const, color: "bg-green-50 text-green-700 border-green-200" },
    CANCELLED: { variant: "destructive" as const, color: "bg-red-50 text-red-700 border-red-200" },
    RESCHEDULED: { variant: "secondary" as const, color: "bg-purple-50 text-purple-700 border-purple-200" },
  };

  const statusInfo = statusConfig[booking.status as keyof typeof statusConfig] || statusConfig.PENDING;

  const student = booking.studentUser || { name: "Unknown Student", email: "" };
  const tutor = booking.tutorUser || { name: "Unknown Tutor", email: "" };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Booking Details: #{booking.id.substring(0, 8)}...
          </DialogTitle>
          <DialogDescription>
            View complete booking information and session details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <h3 className="text-xl font-bold">Session Details</h3>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={statusInfo.variant} className={statusInfo.color}>
                  {booking.status}
                </Badge>
                <Badge variant={booking.isPaid ? "outline" : "secondary"} className="gap-1">
                  <CreditCard className="w-3 h-3" />
                  {booking.isPaid ? "Paid" : "Unpaid"}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">${booking.amount}</div>
              <div className="text-sm text-muted-foreground">
                {booking.duration} minutes
              </div>
            </div>
          </div>

          <Separator />

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <User className="w-4 h-4" />
                Student Information
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="font-medium">{student.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="font-medium">{student.email}</span>
                </div>
                {booking.studentProfile?.grade && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Grade</span>
                    <span className="font-medium">{booking.studentProfile.grade}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Tutor Information
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="font-medium">{tutor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="font-medium">{tutor.email}</span>
                </div>
                {booking.tutorProfile?.headline && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Headline</span>
                    <span className="font-medium text-right">{booking.tutorProfile.headline}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Session Details */}
          <Separator />
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Session Details
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Date</span>
                <div className="p-3 bg-muted/30 rounded">
                  <span className="font-medium">{booking.bookingDate}</span>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Start Time</span>
                <div className="p-3 bg-muted/30 rounded">
                  <span className="font-medium">{booking.startTime}</span>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">End Time</span>
                <div className="p-3 bg-muted/30 rounded">
                  <span className="font-medium">{booking.endTime}</span>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Duration</span>
                <div className="p-3 bg-muted/30 rounded">
                  <span className="font-medium">{booking.duration} mins</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {booking.category && (
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <div className="p-3 bg-muted/30 rounded">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span className="font-medium">{booking.category.name}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {booking.availabilitySlot && (
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Slot</span>
                  <div className="p-3 bg-muted/30 rounded">
                    <span className="font-medium">
                      {booking.availabilitySlot.date} • {booking.availabilitySlot.startTime}-{booking.availabilitySlot.endTime}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          {(booking.meetingLink || booking.notes || booking.review) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold">Additional Information</h4>
                
                {booking.meetingLink && (
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Meeting Link</span>
                    <div className="p-3 bg-muted/30 rounded">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{booking.meetingLink}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(booking.meetingLink, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Join
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {booking.notes && (
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Notes</span>
                    <div className="p-3 bg-muted/30 rounded">
                      <p className="text-sm">{booking.notes}</p>
                    </div>
                  </div>
                )}

                {booking.review && (
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Review
                    </span>
                    <div className="p-3 bg-muted/30 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Rating: {booking.review.rating}/5</span>
                      </div>
                      {booking.review.comment && (
                        <p className="text-sm italic">"{booking.review.comment}"</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Timestamps */}
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Created</span>
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">
                  {format(new Date(booking.createdAt), "MMM dd, yyyy • hh:mm a")}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <div className="p-3 bg-muted/30 rounded">
                <span className="font-medium">
                  {format(new Date(booking.updatedAt), "MMM dd, yyyy • hh:mm a")}
                </span>
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
                Edit Booking
              </Button>
            )}
            <Button
              variant="outline"
              className="gap-2 ml-auto"
              onClick={handleCopyBookingId}
            >
              <Copy className="w-4 h-4" />
              Copy Booking ID
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}