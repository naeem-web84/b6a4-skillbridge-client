// components/admin/user-management/user-management.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; 
import { adminService, type AdminUser, type UserFilters as FilterType } from "@/services/admin.service";
import { toast } from "sonner";
import UserTable from "./UserTable";
import UserFilters from "./UserFilters";

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);
  const [filters, setFilters] = useState<FilterType>({
    page: 1,
    limit: 10,
    search: "",
    role: "",
    status: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.users.getAllUsers(filters);
      if (response.success) {
        setUsers(response.data);
        setPagination(response.pagination);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, [filters.page, filters.limit, filters.role, filters.status, filters.sortBy, filters.sortOrder]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search !== undefined) {
        fetchUsers();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Handle user update
  const handleUpdateUser = async (userId: string, data: any) => {
    try {
      const response = await adminService.users.updateUser(userId, data);
      if (response.success) {
        toast.success("User updated successfully");
        fetchUsers(); // Refresh list
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to update user");
      console.error(error);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await adminService.users.deleteUser(userId);
      if (response.success) {
        toast.success("User deleted successfully");
        fetchUsers(); // Refresh list
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to delete user");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage all users, update roles, and monitor user activities
          </p>
        </div>
      </div>

      {/* Filters Component */}
      <UserFilters filters={filters} setFilters={setFilters} />

      {/* Users Table Component */}
      <UserTable
        users={users}
        loading={loading}
        pagination={pagination}
        filters={filters}
        setFilters={setFilters}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
};