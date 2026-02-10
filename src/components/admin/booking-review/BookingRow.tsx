// components/admin/bookings-review/BookingRow.tsx
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
  Calendar,
  User,
  GraduationCap,
  DollarSign,
  Clock,
  MoreVertical,
  Eye,
  Edit,
  ExternalLink,
  CheckCircle,
  XCircle,
  CreditCard,
} from "lucide-react";
import type { Booking } from "@/services/admin.service";
import { format } from "date-fns"; 
import ViewBookingModal from "./ViewBookingModal";
import EditBookingModal from "./EditBookingModal";

interface BookingRowProps {
  booking: Booking;
  onUpdateBooking: (bookingId: string, data: any) => Promise<void>;
  onRefresh?: () => void;
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    PENDING: {
      variant: "outline" as const,
      icon: <Clock className="w-3 h-3" />,
      color: "text-yellow-600 bg-yellow-50 border-yellow-200",
    },
    CONFIRMED: {
      variant: "default" as const,
      icon: <CheckCircle className="w-3 h-3" />,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    COMPLETED: {
      variant: "default" as const,
      icon: <CheckCircle className="w-3 h-3" />,
      color: "text-green-600 bg-green-50 border-green-200",
    },
    CANCELLED: {
      variant: "destructive" as const,
      icon: <XCircle className="w-3 h-3" />,
      color: "text-red-600 bg-red-50 border-red-200",
    },
    RESCHEDULED: {
      variant: "secondary" as const,
      icon: <Calendar className="w-3 h-3" />,
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

  return (
    <Badge variant={config.variant} className={`gap-1 ${config.color}`}>
      {config.icon}
      {status}
    </Badge>
  );
};

// Payment badge component
const PaymentBadge = ({ isPaid }: { isPaid: boolean }) => {
  return isPaid ? (
    <Badge variant="outline" className="gap-1 bg-green-50 text-green-700 border-green-200">
      <CreditCard className="w-3 h-3" />
      Paid
    </Badge>
  ) : (
    <Badge variant="outline" className="gap-1 bg-yellow-50 text-yellow-700 border-yellow-200">
      <CreditCard className="w-3 h-3" />
      Unpaid
    </Badge>
  );
};

export default function BookingRow({ booking, onUpdateBooking, onRefresh }: BookingRowProps) {
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const formatDateTime = (dateString: string, timeString: string) => {
    try {
      const date = new Date(`${dateString}T${timeString}`);
      return format(date, "MMM dd, yyyy • hh:mm a");
    } catch {
      return `${dateString} ${timeString}`;
    }
  };

  const handleStatusChange = (newStatus: string) => {
    onUpdateBooking(booking.id, { status: newStatus });
  };

  const handlePaymentToggle = () => {
    const newStatus = !booking.isPaid;
    onUpdateBooking(booking.id, { isPaid: newStatus });
  };

  const handleModalSuccess = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const student = booking.studentUser || { name: "Unknown Student", email: "" };
  const tutor = booking.tutorUser || { name: "Unknown Tutor", email: "" };

  return (
    <>
      <TableRow>
        <TableCell>
          <div className="space-y-1">
            <div className="font-medium">Booking #{booking.id.substring(0, 8)}...</div>
            {booking.category && (
              <div className="text-sm text-muted-foreground">
                {booking.category.name}
              </div>
            )}
            {booking.notes && (
              <div className="text-xs text-muted-foreground line-clamp-1">
                {booking.notes}
              </div>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm font-medium">{student.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm font-medium">{tutor.name}</span>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="font-bold">${booking.amount}</span>
              <span className="text-sm text-muted-foreground">
                ({booking.duration} mins)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={booking.status} />
              <PaymentBadge isPaid={booking.isPaid} />
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="space-y-1">
            <div className="text-sm font-medium">
              {formatDateTime(booking.bookingDate, booking.startTime)}
            </div>
            <div className="text-xs text-muted-foreground">
              {booking.startTime} - {booking.endTime}
            </div>
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
              <DropdownMenuLabel>Booking Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => setShowViewModal(true)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Booking
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel>Update Status</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleStatusChange('CONFIRMED')}>
                <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
                Confirm Booking
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('COMPLETED')}>
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Mark as Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('CANCELLED')}>
                <XCircle className="w-4 h-4 mr-2 text-red-500" />
                Cancel Booking
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('RESCHEDULED')}>
                <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                Mark as Rescheduled
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel>Payment</DropdownMenuLabel>
              <DropdownMenuItem onClick={handlePaymentToggle}>
                {booking.isPaid ? (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Mark as Unpaid
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Mark as Paid
                  </>
                )}
              </DropdownMenuItem>
              
              {booking.meetingLink && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.open(booking.meetingLink, '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Join Meeting
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {/* View Booking Modal */}
      <ViewBookingModal
        booking={booking}
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        onEditClick={() => {
          setShowViewModal(false);
          setShowEditModal(true);
        }}
      />

      {/* Edit Booking Modal */}
      <EditBookingModal
        booking={booking}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={handleModalSuccess}
        onUpdateBooking={onUpdateBooking}
      />
    </>
  );
}