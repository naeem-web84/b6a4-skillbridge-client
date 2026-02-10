// components/admin/tutor/TutorTable.tsx
"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, GraduationCap, Star, DollarSign, Award } from "lucide-react";
import type { TutorProfile, TutorFilters } from "@/services/admin.service";
import TutorRow from "./TutorRow";

interface TutorTableProps {
  tutors: TutorProfile[];
  loading: boolean;
  pagination: any;
  filters: TutorFilters;
  setFilters: React.Dispatch<React.SetStateAction<TutorFilters>>;
  onUpdateTutor: (tutorId: string, data: any) => Promise<void>;
  onDeleteTutor: (tutorId: string) => Promise<void>;
  onRefresh?: () => void;
}

export default function TutorTable({
  tutors,
  loading,
  pagination,
  filters,
  setFilters,
  onUpdateTutor,
  onDeleteTutor,
  onRefresh,
}: TutorTableProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (tutors.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No tutors found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your filters or search terms
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate stats for summary
  const stats = {
    totalTutors: tutors.length,
    avgRating: tutors.reduce((sum, tutor) => sum + tutor.rating, 0) / tutors.length,
    avgPrice: tutors.reduce((sum, tutor) => sum + tutor.hourlyRate, 0) / tutors.length,
    totalExperience: tutors.reduce((sum, tutor) => sum + tutor.experienceYears, 0),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tutors</CardTitle>
        <CardDescription>
          {pagination?.total || 0} tutors found
          {filters.search && ` for "${filters.search}"`}
          
          {/* Quick Stats */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-3 h-3 text-yellow-500" />
              <span>Avg: {stats.avgRating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <DollarSign className="w-3 h-3" />
              <span>Avg: ${stats.avgPrice.toFixed(2)}/hr</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Award className="w-3 h-3" />
              <span>{stats.totalExperience} total years</span>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tutor</TableHead>
                <TableHead>Headline</TableHead>
                <TableHead>Price & Rating</TableHead>
                <TableHead>Experience & Sessions</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tutors.map((tutor) => (
                <TutorRow
                  key={tutor.id}
                  tutor={tutor}
                  onUpdateTutor={onUpdateTutor}
                  onDeleteTutor={onDeleteTutor}
                  onRefresh={onRefresh}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} tutors
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pagination.page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilters({ ...filters, page: pageNum })}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
                disabled={!pagination.hasNextPage}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}