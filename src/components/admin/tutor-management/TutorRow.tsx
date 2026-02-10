// components/admin/tutor/TutorRow.tsx
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
  User,
  Mail,
  Star,
  DollarSign,
  Award,
  BookOpen,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { TutorProfile } from "@/services/admin.service";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import EditTutorModal from "./EditTutorModal";
import ViewTutorModal from "./ViewTutorModal";

interface TutorRowProps {
  tutor: TutorProfile;
  onUpdateTutor: (tutorId: string, data: any) => Promise<void>;
  onDeleteTutor: (tutorId: string) => Promise<void>;
  onRefresh?: () => void;
}

// Rating badge component
const RatingBadge = ({ rating }: { rating: number }) => {
  return (
    <Badge variant={rating >= 4 ? "default" : rating >= 3 ? "secondary" : "outline"} className="gap-1">
      <Star className="w-3 h-3" />
      {rating.toFixed(1)}
    </Badge>
  );
};

// Price badge component
const PriceBadge = ({ price }: { price: number }) => {
  return (
    <Badge variant="outline" className="gap-1">
      <DollarSign className="w-3 h-3" />
      {price}/hr
    </Badge>
  );
};

export default function TutorRow({ tutor, onUpdateTutor, onDeleteTutor, onRefresh }: TutorRowProps) {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  // Handle quick actions
  const handleUpdateRating = (newRating: number) => {
    onUpdateTutor(tutor.id, { rating: newRating });
  };

  const handleUpdateHourlyRate = (newRate: number) => {
    onUpdateTutor(tutor.id, { hourlyRate: newRate });
  };

  const handleModalSuccess = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const user = tutor.user || { name: "Unknown Tutor", email: "No email", status: "Unknown" };

  return (
    <>
      <TableRow>
        <TableCell>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {user.email}
              </div>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="font-medium line-clamp-2 max-w-[200px]">
            {tutor.headline}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <PriceBadge price={tutor.hourlyRate} />
            <RatingBadge rating={tutor.rating} />
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Award className="w-3 h-3" />
              {tutor.experienceYears}y
            </Badge>
            <Badge variant="outline" className="gap-1">
              <BookOpen className="w-3 h-3" />
              {tutor.completedSessions}
            </Badge>
          </div>
        </TableCell>
        <TableCell>
          <div className="text-sm">
            {formatDate(tutor.createdAt)}
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
              <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => setShowViewModal(true)}>
                <Eye className="w-4 h-4 mr-2" />
                View Profile
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel>Quick Updates</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleUpdateRating(5)}>
                <Star className="w-4 h-4 mr-2" />
                Set Rating to 5.0
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateRating(4)}>
                <Star className="w-4 h-4 mr-2" />
                Set Rating to 4.0
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => handleUpdateHourlyRate(20)}>
                <DollarSign className="w-4 h-4 mr-2" />
                Set Price to $20/hr
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateHourlyRate(30)}>
                <DollarSign className="w-4 h-4 mr-2" />
                Set Price to $30/hr
              </DropdownMenuItem> 
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => onDeleteTutor(tutor.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Tutor
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {/* View Tutor Modal */}
      <ViewTutorModal
        tutor={tutor}
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        onEditClick={() => {
          setShowViewModal(false);
          setShowEditModal(true);
        }}
      />

      {/* Edit Tutor Modal */}
      <EditTutorModal
        tutor={tutor}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={handleModalSuccess}
      />
    </>
  );
}