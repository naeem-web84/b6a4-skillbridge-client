// components/admin/bookings-review/EditBookingModal.tsx
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
import { 
  Calendar, 
  DollarSign,
  Clock,
  CreditCard,
  ExternalLink,
  Save,
  Copy
} from "lucide-react";
import type { Booking, UpdateBookingData } from "@/services/admin.service";
import { format } from "date-fns";

interface EditBookingModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onUpdateBooking: (bookingId: string, data: UpdateBookingData) => Promise<void>;
}

export default function EditBookingModal({
  booking,
  isOpen,
  onClose,
  onSuccess,
  onUpdateBooking,
}: EditBookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateBookingData>({
    status: booking.status,
    amount: booking.amount,
    isPaid: booking.isPaid,
    meetingLink: booking.meetingLink,
    notes: booking.notes,
  });

  // Update form data when booking changes
  useEffect(() => {
    setFormData({
      status: booking.status,
      amount: booking.amount,
      isPaid: booking.isPaid,
      meetingLink: booking.meetingLink,
      notes: booking.notes,
    });
  }, [booking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await onUpdateBooking(booking.id, formData);
      toast.success("Booking updated successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyBookingId = () => {
    navigator.clipboard.writeText(booking.id);
    toast.success("Booking ID copied to clipboard!");
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy • HH:mm");
    } catch {
      return dateString;
    }
  };

  const student = booking.studentUser || { name: "Unknown Student", email: "" };
  const tutor = booking.tutorUser || { name: "Unknown Tutor", email: "" };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Edit Booking: #{booking.id.substring(0, 8)}...
          </DialogTitle>
          <DialogDescription>
            Update booking status, payment, and session details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Form */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        <SelectItem value="RESCHEDULED">Rescheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meetingLink">Meeting Link</Label>
                  <Input
                    id="meetingLink"
                    value={formData.meetingLink || ""}
                    onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes || ""}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes about this booking..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                  <div className="space-y-0.5">
                    <Label htmlFor="isPaid" className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Payment Status
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle payment confirmation
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${formData.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                      {formData.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                    <Button
                      type="button"
                      variant={formData.isPaid ? "outline" : "default"}
                      size="sm"
                      onClick={() => setFormData({ ...formData, isPaid: !formData.isPaid })}
                    >
                      {formData.isPaid ? "Mark as Unpaid" : "Mark as Paid"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Booking Summary
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Booking ID</span>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                        {booking.id.substring(0, 8)}...
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={handleCopyBookingId}
                        title="Copy Booking ID"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Student</span>
                    <span className="font-medium">{student.name}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tutor</span>
                    <span className="font-medium">{tutor.name}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Session Date</span>
                    <span className="font-medium">{booking.bookingDate}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Time</span>
                    <span className="font-medium">{booking.startTime} - {booking.endTime}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Duration</span>
                    <span className="font-medium">{booking.duration} minutes</span>
                  </div>
                  
                  {booking.category && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Category</span>
                      <Badge variant="outline">{booking.category.name}</Badge>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Created</span>
                    <span className="text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(booking.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Current Status */}
              <div className="p-4 border rounded-lg bg-muted/30">
                <h4 className="font-semibold mb-2">Current Status</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <Badge 
                      variant={
                        booking.status === 'PENDING' ? 'outline' :
                        booking.status === 'CONFIRMED' ? 'default' :
                        booking.status === 'COMPLETED' ? 'default' :
                        booking.status === 'CANCELLED' ? 'destructive' : 'secondary'
                      }
                    >
                      {booking.status}
                    </Badge>
                    <div className="text-sm text-muted-foreground mt-1">
                      Previous status
                    </div>
                  </div>
                  <div>
                    <Badge variant={booking.isPaid ? "outline" : "secondary"}>
                      {booking.isPaid ? "Paid" : "Unpaid"}
                    </Badge>
                    <div className="text-sm text-muted-foreground mt-1">
                      Payment status
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