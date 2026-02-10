"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  AlertCircle,
  Bell,
  Send,
  Users,
  User,
  Mail,
  Calendar,
  BookOpen,
  CreditCard,
  Shield,
} from "lucide-react";
import type { AdminUser, CreateNotificationData } from "@/services/admin.service";
import { toast } from "sonner";

interface SendNotificationFormProps {
  users: AdminUser[];
  loadingUsers: boolean;
  loadingNotification: boolean;
  onSendNotification: (data: CreateNotificationData) => Promise<boolean>;
}

export default function SendNotificationForm({
  users,
  loadingUsers,
  loadingNotification,
  onSendNotification,
}: SendNotificationFormProps) {
  const [formData, setFormData] = useState<CreateNotificationData>({
    userId: "",
    title: "",
    message: "",
    type: "SYSTEM",
  });

  const [selectedUserType, setSelectedUserType] = useState<"all" | "specific" | "role">("specific");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [customMessage, setCustomMessage] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (selectedUserType === "specific" && !formData.userId) {
      toast.error("Please select a user");
      return;
    }

    if (selectedUserType === "role" && !selectedRole) {
      toast.error("Please select a role");
      return;
    }

    try {
      const success = await onSendNotification(formData);
      if (success) {
        // Reset form
        setFormData({
          userId: "",
          title: "",
          message: "",
          type: "SYSTEM",
        });
        setCustomMessage(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Filter users by role
  const filteredUsers = selectedRole
    ? users.filter(user => user.role === selectedRole)
    : users;

  // Get user type label
  const getUserTypeLabel = () => {
    if (selectedUserType === "all") return "All Users";
    if (selectedUserType === "role") return `All ${selectedRole}s`;
    const user = users.find(u => u.id === formData.userId);
    return user ? user.name : "Select User";
  };

  // Quick message templates
  const messageTemplates = [
    {
      id: 1,
      title: "Welcome to Our Platform",
      message: "Welcome to our tutoring platform! We're excited to have you join our community. Start exploring tutors and booking sessions today.",
      type: "SYSTEM"
    },
    {
      id: 2,
      title: "Booking Confirmation",
      message: "Your booking has been confirmed! Please join the session at the scheduled time. Check your email for meeting details.",
      type: "BOOKING"
    },
    {
      id: 3,
      title: "Payment Reminder",
      message: "Friendly reminder: Your payment for the recent booking is pending. Please complete the payment to confirm your session.",
      type: "PAYMENT"
    },
    {
      id: 4,
      title: "New Review Received",
      message: "You have received a new review from a student. Check your profile to see what they said about your teaching.",
      type: "REVIEW"
    },
    {
      id: 5,
      title: "System Update",
      message: "We've updated our platform with new features. Check out the latest improvements and let us know what you think.",
      type: "SYSTEM"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Send New Notification
        </CardTitle>
        <CardDescription>
          Send notifications to users with custom messages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipient Selection */}
          <div className="space-y-4">
            <Label>Send To</Label>
            <div className="flex flex-wrap gap-2">
              {["specific", "role", "all"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setSelectedUserType(type as any);
                    if (type === "all") {
                      setFormData({ ...formData, userId: "" });
                    }
                  }}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedUserType === type
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {type === "specific" ? "Specific User" : 
                   type === "role" ? "By Role" : "All Users"}
                </button>
              ))}
            </div>

            {/* User Selection */}
            {selectedUserType === "specific" && (
              <div className="space-y-2">
                <Label htmlFor="userId">Select User</Label>
                <Select
                  value={formData.userId}
                  onValueChange={(value) => setFormData({ ...formData, userId: value })}
                  disabled={loadingUsers}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" disabled>Select a user</SelectItem> 
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            user.role === 'ADMIN' ? 'bg-red-500' :
                            user.role === 'TUTOR' ? 'bg-blue-500' :
                            'bg-green-500'
                          }`}></div>
                          <span>{user.name}</span>
                          <span className="text-xs text-muted-foreground">({user.role})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Role Selection */}
            {selectedUserType === "role" && (
              <div className="space-y-2">
                <Label htmlFor="role">Select Role</Label>
                <Select
                  value={selectedRole}
                  onValueChange={(value) => setSelectedRole(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" disabled>Select a role</SelectItem> 
                    <SelectItem value="STUDENT">All Students</SelectItem>
                    <SelectItem value="TUTOR">All Tutors</SelectItem>
                    <SelectItem value="ADMIN">All Admins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Notification Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Notification Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter notification title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Notification Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SYSTEM">  
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        System
                      </div>
                    </SelectItem>
                    <SelectItem value="BOOKING">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Booking
                      </div>
                    </SelectItem>
                    <SelectItem value="REVIEW">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Review
                      </div>
                    </SelectItem>
                    <SelectItem value="PAYMENT">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Payment
                      </div>
                    </SelectItem>
                    <SelectItem value="REMINDER">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Reminder
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Message Templates */}
            <div className="space-y-2">
              <Label>Quick Message Templates</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {messageTemplates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        title: template.title,
                        message: template.message,
                        type: template.type as any,
                      });
                      setCustomMessage(true);
                    }}
                    className="text-left p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="font-medium text-sm">{template.title}</div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {template.message}
                    </div>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCustomMessage(!customMessage)}
                  className="p-3 border rounded-lg hover:bg-muted/50 transition-colors text-center"
                >
                  <div className="font-medium text-sm">
                    {customMessage ? "Hide Custom Message" : "Write Custom Message"}
                  </div>
                </button>
              </div>
            </div>

            {/* Custom Message */}
            {customMessage && (
              <div className="space-y-2">
                <Label htmlFor="message">Custom Message</Label>
                <Textarea
                  id="message"
                  value={formData.message || ""}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your notification message here..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  You can use HTML formatting for rich text notifications
                </p>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="p-4 border rounded-lg bg-muted/30">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{formData.title || "Notification Title"}</h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {formData.type || "SYSTEM"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formData.message || "Notification message will appear here..."}
                  </p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    To: {getUserTypeLabel()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button 
              type="submit" 
              disabled={loadingNotification || loadingUsers}
              className="gap-2"
            >
              {loadingNotification ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Notification
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  userId: "",
                  title: "",
                  message: "",
                  type: "SYSTEM",
                });
                setSelectedUserType("specific");
                setSelectedRole("");
                setCustomMessage(false);
              }}
            >
              Clear Form
            </Button>

            <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              <span>Notifications are sent instantly</span>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}