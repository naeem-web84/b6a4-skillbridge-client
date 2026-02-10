"use client";

import React, { useState, useEffect } from "react";
import { adminService, type AdminUser } from "@/services/admin.service";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Shield,
  Calendar,
  CheckCircle,
  XCircle,
  Settings,
  Bell,
  Lock,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns"; 
// Removed EditUserModal import since we're not using it anymore

interface AdminProfileProps {
  compact?: boolean;
  showEditButton?: boolean; // You can remove this prop if not needed elsewhere
}

export default function AdminProfile({ 
  compact = false, 
  showEditButton = false // Changed default to false
}: AdminProfileProps) {
  const { user: authUser, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      // Wait for auth to load
      if (authLoading) {
        setLoading(true);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Check if user is authenticated
        if (!authUser) {
          setError("Please login to view profile");
          setLoading(false);
          return;
        }

        // Check if user is an admin
        if (authUser.role !== "ADMIN") {
          setError("Access restricted to administrators only");
          setLoading(false);
          return;
        }

        // Try to fetch admin profile using the user ID from auth
        try {
          const response = await adminService.users.getUserById(authUser.id);
          
          if (response.success && response.data) {
            setAdmin(response.data);
          } else {
            // If API fails, create a mock admin profile from auth data
            createMockAdminFromAuth();
          }
        } catch (apiError) {
          // If API call fails, use auth data
          createMockAdminFromAuth();
        }
      } catch (error: any) {
        setError(error.message || "Failed to load admin profile");
        toast.error("Failed to load admin profile");
      } finally {
        setLoading(false);
      }
    };

    const createMockAdminFromAuth = () => {
      if (authUser) {
        const mockAdmin: AdminUser = {
          id: authUser.id,
          name: authUser.name,
          email: authUser.email,
          role: "ADMIN",
          status: "Active",
          emailVerified: true,
          image: authUser.image,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _count: {
            sessions: 0,
            accounts: 1
          }
        };
        setAdmin(mockAdmin);
      }
    };

    fetchAdminProfile();
  }, [authUser, authLoading]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  // Combined loading state
  if (authLoading || loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (error && !admin) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">Admin Profile</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {error}
          </p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!admin) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">Profile Not Found</h3>
          <p className="text-sm text-muted-foreground">
            Unable to load admin profile
          </p>
        </CardContent>
      </Card>
    );
  }

  // Compact view
  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>My Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              {admin.image ? (
                <img src={admin.image} alt={admin.name} className="w-12 h-12 rounded-full" />
              ) : (
                <User className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{admin.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground truncate">
                <Mail className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{admin.email}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Role</span>
              <Badge variant="destructive" className="gap-1 w-full justify-center">
                <Shield className="w-3 h-3" />
                Admin
              </Badge>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Status</span>
              <Badge 
                variant={admin.status === "Active" ? "default" : "secondary"} 
                className="gap-1 w-full justify-center"
              >
                {admin.status === "Active" ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {admin.status}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Member Since</span>
              <span>{formatDate(admin.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Email Verified</span>
              <Badge variant={admin.emailVerified ? "default" : "outline"} className="gap-1">
                {admin.emailVerified ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {admin.emailVerified ? "Yes" : "No"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full view
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Admin Profile
          </CardTitle>
          <CardDescription>Your administrator account details</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            {admin.image ? (
              <img src={admin.image} alt={admin.name} className="w-20 h-20 rounded-full" />
            ) : (
              <User className="w-10 h-10 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{admin.name}</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              {admin.email}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="destructive" className="gap-1">
                <Shield className="w-3 h-3" />
                {admin.role}
              </Badge>
              <Badge variant={admin.status === "Active" ? "default" : "secondary"} className="gap-1">
                {admin.status === "Active" ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {admin.status}
              </Badge>
              <Badge variant={admin.emailVerified ? "default" : "outline"} className="gap-1">
                {admin.emailVerified ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {admin.emailVerified ? "Verified" : "Unverified"}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Account Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm font-medium">{formatDate(admin.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm font-medium">{formatDate(admin.updatedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">User ID</span>
                <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                  {admin.id.substring(0, 12)}...
                </code>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Account Settings
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  <span className="text-sm">Notifications</span>
                </div>
                <Badge variant="outline">On</Badge>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm">Two-Factor Auth</span>
                </div>
                <Badge variant="outline">Off</Badge>
              </div>
            </div>
          </div>
        </div>

        {admin._count && (admin._count.sessions || admin._count.accounts) && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="font-semibold">Activity Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {admin._count.sessions !== undefined && (
                  <div className="space-y-2 text-center p-4 bg-muted/30 rounded">
                    <div className="text-2xl font-bold">{admin._count.sessions}</div>
                    <span className="text-sm text-muted-foreground">Active Sessions</span>
                  </div>
                )}
                {admin._count.accounts !== undefined && (
                  <div className="space-y-2 text-center p-4 bg-muted/30 rounded">
                    <div className="text-2xl font-bold">{admin._count.accounts}</div>
                    <span className="text-sm text-muted-foreground">Linked Accounts</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}