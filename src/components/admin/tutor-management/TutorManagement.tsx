// components/admin/tutor/TutorManagement.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { adminService, type TutorProfile, type TutorFilters } from "@/services/admin.service";
import { toast } from "sonner";
import TutorTable from "./TutorTable"; 
import TutorFiltersComponent from "./TutorFilters";

export default function TutorManagement() {
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);
  const [filters, setFilters] = useState<TutorFilters>({
    page: 1,
    limit: 10,
    search: "",
    minRating: undefined,
    maxHourlyRate: undefined,
    experienceYears: undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Fetch tutors
  const fetchTutors = async () => {
    setLoading(true);
    try {
      const response = await adminService.tutors.getAllTutors(filters);
      if (response.success) {
        setTutors(response.data);
        setPagination(response.pagination);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to fetch tutors");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTutors();
  }, [filters.page, filters.limit, filters.minRating, filters.maxHourlyRate, filters.experienceYears, filters.sortBy, filters.sortOrder]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search !== undefined) {
        fetchTutors();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Handle tutor update
  const handleUpdateTutor = async (tutorId: string, data: any) => {
    try {
      const response = await adminService.tutors.updateTutorProfile(tutorId, data);
      if (response.success) {
        toast.success("Tutor updated successfully");
        fetchTutors(); // Refresh list
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to update tutor");
      console.error(error);
    }
  };

  // Handle tutor deletion
  const handleDeleteTutor = async (tutorId: string) => {
    if (!confirm("Are you sure you want to delete this tutor?")) return;

    try {
      const response = await adminService.tutors.deleteTutor(tutorId);
      if (response.success) {
        toast.success("Tutor deleted successfully");
        fetchTutors(); // Refresh list
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to delete tutor");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tutor Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage all tutors, update profiles, pricing, and monitor performance
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      {!loading && tutors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{pagination?.total || 0}</div>
              <p className="text-sm text-muted-foreground">Total Tutors</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">
                ${(tutors.reduce((sum, tutor) => sum + tutor.hourlyRate, 0) / tutors.length).toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">Avg. Hourly Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">
                {(tutors.reduce((sum, tutor) => sum + tutor.rating, 0) / tutors.length).toFixed(1)}
              </div>
              <p className="text-sm text-muted-foreground">Avg. Rating</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">
                {tutors.reduce((sum, tutor) => sum + tutor.experienceYears, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Total Experience</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters Component */}
      <TutorFiltersComponent filters={filters} setFilters={setFilters} />

      {/* Tutors Table Component */}
      <TutorTable
        tutors={tutors}
        loading={loading}
        pagination={pagination}
        filters={filters}
        setFilters={setFilters}
        onUpdateTutor={handleUpdateTutor}
        onDeleteTutor={handleDeleteTutor}
        onRefresh={fetchTutors}
      />
    </div>
  );
}