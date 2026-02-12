
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { adminService, type CreateNotificationData, type AdminUser } from "@/services/admin.service";
import { toast } from "sonner"; 
import SendNotificationForm from "./SendNotificationForm"; 

export default function NotificationSystem() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingNotification, setLoadingNotification] = useState(false);

  // Fetch users for recipient selection
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await adminService.users.getAllUsers({
        page: 1,
        limit: 100,  
        sortBy: "name",
        sortOrder: "asc",
      });
      if (response.success) {
        setUsers(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle sending notification
  const handleSendNotification = async (data: CreateNotificationData) => {
    setLoadingNotification(true);
    try {
      const response = await adminService.notifications.sendNotification(data);
      if (response.success) {
        toast.success("Notification sent successfully");
        return true;
      } else {
        toast.error(response.message || "Failed to send notification");
        return false;
      }
    } catch (error) {
      toast.error("Failed to send notification");
      console.error(error);
      return false;
    } finally {
      setLoadingNotification(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notification System</h1>
          <p className="text-muted-foreground mt-2">
            Send notifications to users - ব্যাবহারকারীদের নোটিফিকেশন পাঠানো
          </p>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">
              {users.filter(u => u.role === 'STUDENT').length}
            </div>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">
              {users.filter(u => u.role === 'TUTOR').length}
            </div>
            <p className="text-sm text-muted-foreground">Total Tutors</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">
              {users.filter(u => u.role === 'ADMIN').length}
            </div>
            <p className="text-sm text-muted-foreground">Total Admins</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">
              {users.filter(u => u.status === 'Active').length}
            </div>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </CardContent>
        </Card>
      </div>

      {/* Send Notification Form */}
      <SendNotificationForm
        users={users}
        loadingUsers={loadingUsers}
        loadingNotification={loadingNotification}
        onSendNotification={handleSendNotification}
      />
 

      {/* Quick Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Notification Templates</CardTitle>
          <CardDescription>
            Pre-made templates for common notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <TemplateCard
              title="Welcome"
              description="Welcome new users to the platform"
              type="SYSTEM"
              onClick={() => toast.info("Template clicked - implement in form")}
            />
            <TemplateCard
              title="Booking Confirmation"
              description="Confirm booking details"
              type="BOOKING"
              onClick={() => toast.info("Template clicked - implement in form")}
            />
            <TemplateCard
              title="Payment Reminder"
              description="Remind about pending payments"
              type="PAYMENT"
              onClick={() => toast.info("Template clicked - implement in form")}
            />
            <TemplateCard
              title="Session Reminder"
              description="Remind about upcoming sessions"
              type="REMINDER"
              onClick={() => toast.info("Template clicked - implement in form")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Template Card Component
interface TemplateCardProps {
  title: string;
  description: string;
  type: string;
  onClick: () => void;
}

function TemplateCard({ title, description, type, onClick }: TemplateCardProps) {
  const typeColors = {
    BOOKING: "bg-blue-100 text-blue-800 border-blue-200",
    REVIEW: "bg-green-100 text-green-800 border-green-200",
    PAYMENT: "bg-yellow-100 text-yellow-800 border-yellow-200",
    SYSTEM: "bg-purple-100 text-purple-800 border-purple-200",
    REMINDER: "bg-orange-100 text-orange-800 border-orange-200",
  };

  return (
    <button
      onClick={onClick}
      className="text-left p-4 border rounded-lg hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">{title}</h4>
        <span className={`text-xs px-2 py-1 rounded-full ${typeColors[type as keyof typeof typeColors] || 'bg-gray-100'}`}>
          {type}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="mt-3 text-xs text-primary hover:underline">
        Use this template →
      </div>
    </button>
  );
};