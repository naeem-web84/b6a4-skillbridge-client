// components/admin/user-management/user-row.tsx
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
  Mail,
  CheckCircle,
  XCircle,
  Shield,
  User as UserIcon,
  GraduationCap,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
} from "lucide-react";
import type { AdminUser } from "@/services/admin.service";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import EditUserModal from "./EditUserModal"; 
import ViewUserModal from "./ViewUserModal";

interface UserRowProps {
  user: AdminUser;
  onUpdateUser: (userId: string, data: any) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  onRefresh?: () => void;
}

// User status badge component
const UserStatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    Active: {
      variant: "default" as const,
      icon: <CheckCircle className="w-3 h-3 mr-1" />,
    },
    Inactive: {
      variant: "secondary" as const,
      icon: <XCircle className="w-3 h-3 mr-1" />,
    },
    Suspended: {
      variant: "destructive" as const,
      icon: <XCircle className="w-3 h-3 mr-1" />,
    },
    Pending: {
      variant: "outline" as const,
      icon: <CheckCircle className="w-3 h-3 mr-1" />,
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Inactive;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
      {config.icon}
      {status}
    </Badge>
  );
};

// Role badge component
const RoleBadge = ({ role }: { role: string }) => {
  const roleConfig = {
    ADMIN: {
      variant: "destructive" as const,
      icon: <Shield className="w-3 h-3 mr-1" />,
    },
    TUTOR: {
      variant: "default" as const,
      icon: <GraduationCap className="w-3 h-3 mr-1" />,
    },
    STUDENT: {
      variant: "secondary" as const,
      icon: <UserIcon className="w-3 h-3 mr-1" />,
    },
  };

  const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.STUDENT;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
      {config.icon}
      {role}
    </Badge>
  );
};

// Email verification badge
const EmailVerificationBadge = ({ verified }: { verified: boolean }) => {
  return verified ? (
    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
      <CheckCircle className="w-3 h-3 mr-1" />
      Verified
    </Badge>
  ) : (
    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800">
      <XCircle className="w-3 h-3 mr-1" />
      Unverified
    </Badge>
  );
};

export default function UserRow({ user, onUpdateUser, onDeleteUser, onRefresh }: UserRowProps) {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  // Handle status change
  const handleStatusChange = (newStatus: string) => {
    onUpdateUser(user.id, { status: newStatus });
  };

  // Handle role change
  const handleRoleChange = (newRole: string) => {
    onUpdateUser(user.id, { role: newRole });
  };

  // Handle email verification toggle
  const handleToggleEmailVerification = () => {
    const newStatus = !user.emailVerified;
    onUpdateUser(user.id, { emailVerified: newStatus });
  };

  // Handle success from modal
  const handleModalSuccess = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  

  return (
    <>
      <TableRow>
        <TableCell>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
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
          <RoleBadge role={user.role} />
        </TableCell>
        <TableCell>
          <UserStatusBadge status={user.status} />
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <EmailVerificationBadge verified={user.emailVerified} />
            {user.emailVerified ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={() => handleToggleEmailVerification()}
                title="Mark as unverified"
              >
                <XCircle className="w-3 h-3" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={() => handleToggleEmailVerification()}
                title="Mark as verified"
              >
                <CheckCircle className="w-3 h-3" />
              </Button>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="text-sm">
            {formatDate(user.createdAt)}
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
                View Profile (Modal)
              </DropdownMenuItem>
              
              
              <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Quick Edit
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => handleToggleEmailVerification()}>
                {user.emailVerified ? (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Mark as Unverified
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Verified
                  </>
                )}
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel>Change Role</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleRoleChange("STUDENT")}>
                <UserIcon className="w-4 h-4 mr-2" />
                Set as Student
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoleChange("TUTOR")}>
                <GraduationCap className="w-4 h-4 mr-2" />
                Set as Tutor
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoleChange("ADMIN")}>
                <Shield className="w-4 h-4 mr-2" />
                Set as Admin
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleStatusChange("Active")}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Set Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("Inactive")}>
                <XCircle className="w-4 h-4 mr-2" />
                Set Inactive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("Suspended")}>
                <XCircle className="w-4 h-4 mr-2" />
                Suspend User
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => onDeleteUser(user.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {/* View User Modal */}
      <ViewUserModal
        user={user}
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        onEditClick={() => {
          setShowViewModal(false);
          setShowEditModal(true);
        }}
      />

      {/* Edit User Modal */}
      <EditUserModal
        user={user}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={handleModalSuccess}
      />
    </>
  );
}