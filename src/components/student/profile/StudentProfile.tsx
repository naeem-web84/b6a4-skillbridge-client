"use client";

import React, { useState, useEffect } from 'react';
import { Edit2, User, BookOpen, Calendar, Clock, Plus, X, ChevronRight, Mail, Award, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import studentService from '@/services/student.service';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

interface StudentProfile {
  id: string;
  userId: string;
  grade?: string;
  subjects: string[];
  createdAt: string;
  updatedAt: string;
}

interface StudentStats {
  totalBookings: number;
  completedSessions: number;
  upcomingSessions: number;
  totalReviews: number;
}

interface Booking {
  status: string;
  review?: {
    id: string;
  };
}

export const StudentProfile = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    grade: '',
    subjects: [] as string[]
  });
  const [newSubject, setNewSubject] = useState('');

  useEffect(() => {
    fetchProfileAndStats();
  }, []);

  const fetchProfileAndStats = async () => {
    try {
      setLoading(true);
      
      const profileResult = await studentService.profile.getProfile();
      
      if (profileResult.success && profileResult.data) {
        setProfile(profileResult.data);
        setFormData({
          grade: profileResult.data.grade || '',
          subjects: Array.isArray(profileResult.data.subjects) 
            ? profileResult.data.subjects 
            : []
        });
      } else {
        const createResult = await studentService.profile.createProfile();
        if (createResult.success && createResult.data) {
          setProfile(createResult.data);
          setFormData({
            grade: createResult.data.grade || '',
            subjects: Array.isArray(createResult.data.subjects) 
              ? createResult.data.subjects 
              : []
          });
          toast.success('Profile created successfully!');
        }
      }

      await fetchStats();
      
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const bookingsResult = await studentService.bookings.getBookings({
        page: 1,
        limit: 100
      });
      
      if (bookingsResult.success) {
        const bookings = Array.isArray(bookingsResult.data) ? bookingsResult.data : [];
        
        const statsData: StudentStats = {
          totalBookings: bookings.length,
          completedSessions: bookings.filter(b => b.status === 'COMPLETED').length,
          upcomingSessions: bookings.filter(b => 
            b.status === 'CONFIRMED' || b.status === 'PENDING'
          ).length,
          totalReviews: bookings.filter(b => b.review).length
        };
        setStats(statsData);
      }
    } catch {
      setStats({
        totalBookings: 0,
        completedSessions: 0,
        upcomingSessions: 0,
        totalReviews: 0
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validSubjects = formData.subjects.filter(subject => subject.trim() !== '');
      
      const updateData = {
        grade: formData.grade.trim() || undefined,
        subjects: validSubjects
      };

      const result = await studentService.profile.updateProfile(updateData);
      
      if (result.success && result.data) {
        setProfile(result.data);
        setEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch {
      toast.error('An error occurred while updating profile');
    }
  };

  const handleAddSubject = () => {
    if (newSubject.trim()) {
      setFormData({
        ...formData,
        subjects: [...formData.subjects, newSubject.trim()]
      });
      setNewSubject('');
    } else {
      toast.error('Please enter a subject');
    }
  };

  const handleRemoveSubject = (index: number) => {
    const updatedSubjects = formData.subjects.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      subjects: updatedSubjects
    });
  };

  const handleSubjectChange = (index: number, value: string) => {
    const updatedSubjects = [...formData.subjects];
    updatedSubjects[index] = value;
    setFormData({
      ...formData,
      subjects: updatedSubjects
    });
  };

  const getMemberSince = () => {
    if (!profile?.createdAt) return 'N/A';
    try {
      return new Date(profile.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const getFormattedDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-3">
                  <div className="h-8 bg-muted rounded w-48"></div>
                  <div className="h-4 bg-muted rounded w-64"></div>
                </div>
                <div className="h-10 bg-muted rounded w-36"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-card rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-muted rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-5 bg-muted rounded w-32"></div>
                        <div className="h-3 bg-muted rounded w-48"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Student Profile
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your academic profile and track your learning journey
              </p>
            </div>
            {!editing && (
              <Button
                onClick={() => router.push('/find-tutor')}
                className="gap-2"
              >
                <Target className="w-4 h-4" />
                Find Tutors
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card rounded-xl border p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
                        <User className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-card flex items-center justify-center">
                        <Award className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-foreground">
                        Student Profile
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Member since {getMemberSince()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => setEditing(!editing)}
                    variant={editing ? "outline" : "default"}
                    size="default"
                    className="gap-2 w-full sm:w-auto"
                  >
                    <Edit2 className="w-4 h-4" />
                    {editing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>

                {editing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Academic Level
                        </label>
                        <input
                          type="text"
                          value={formData.grade}
                          onChange={(e) => setFormData({...formData, grade: e.target.value})}
                          className="w-full px-4 py-2.5 bg-background border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                          placeholder="e.g., Grade 10, 12th Standard, University Year 2"
                        />
                        <p className="text-xs text-muted-foreground mt-1.5">
                          Enter your current academic level or grade
                        </p>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between mb-4">
                          <label className="text-sm font-medium text-foreground">
                            Subjects of Interest
                          </label>
                          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                            {formData.subjects.filter(s => s.trim()).length} subjects
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          {formData.subjects.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-2">
                              No subjects added yet. Add your first subject below.
                            </p>
                          ) : (
                            formData.subjects.map((subject, index) => (
                              <div key={index} className="flex gap-2">
                                <input
                                  type="text"
                                  value={subject}
                                  onChange={(e) => handleSubjectChange(index, e.target.value)}
                                  className="flex-1 px-4 py-2.5 bg-background border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                                  placeholder="Enter a subject"
                                />
                                <Button
                                  type="button"
                                  onClick={() => handleRemoveSubject(index)}
                                  variant="ghost"
                                  size="icon"
                                  className="shrink-0 hover:bg-destructive/10 text-destructive hover:text-destructive"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))
                          )}
                        </div>

                        <div className="flex gap-2 mt-4">
                          <input
                            type="text"
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                            className="flex-1 px-4 py-2.5 bg-background border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                            placeholder="Add new subject"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddSubject();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={handleAddSubject}
                            variant="outline"
                            className="gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                      <Button
                        type="button"
                        onClick={() => {
                          setEditing(false);
                          if (profile) {
                            setFormData({
                              grade: profile.grade || '',
                              subjects: Array.isArray(profile.subjects) ? profile.subjects : []
                            });
                          }
                        }}
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        className="w-full sm:w-auto"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-muted/50 p-5 rounded-lg border space-y-2">
                        <h3 className="font-medium text-muted-foreground text-sm">Academic Level</h3>
                        <p className="text-2xl font-bold text-foreground">
                          {profile?.grade || 'Not specified'}
                        </p>
                      </div>

                      <div className="bg-muted/50 p-5 rounded-lg border space-y-2">
                        <h3 className="font-medium text-muted-foreground text-sm">Member Since</h3>
                        <p className="text-2xl font-bold text-foreground">
                          {profile?.createdAt ? getFormattedDate(profile.createdAt) : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">Subjects of Interest</h3>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            Subjects you're currently studying
                          </p>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                          {Array.isArray(profile?.subjects) ? profile.subjects.length : 0} subjects
                        </span>
                      </div>
                      
                      {Array.isArray(profile?.subjects) && profile.subjects.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {profile.subjects.map((subject, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary"
                              className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20"
                            >
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 border-2 border-dashed border-input rounded-lg bg-background/50 space-y-3">
                          <BookOpen className="w-10 h-10 mx-auto text-muted-foreground" />
                          <div className="space-y-1">
                            <p className="text-base text-muted-foreground">
                              No subjects added yet
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Add your subjects to get personalized tutor recommendations
                            </p>
                          </div>
                          <Button
                            onClick={() => setEditing(true)}
                            variant="outline"
                            size="default"
                            className="gap-2 mt-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add Subjects
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-xl border p-6 space-y-6">
                <h3 className="text-lg font-bold text-foreground pb-3 border-b">
                  Learning Statistics
                </h3>
                
                {statsLoading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-muted rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <StatCard
                      title="Total Bookings"
                      value={stats?.totalBookings || 0}
                      icon={Calendar}
                      color="primary"
                    />
                    <StatCard
                      title="Completed Sessions"
                      value={stats?.completedSessions || 0}
                      icon={Clock}
                      color="success"
                    />
                    <StatCard
                      title="Upcoming Sessions"
                      value={stats?.upcomingSessions || 0}
                      icon={Calendar}
                      color="warning"
                    />
                    <StatCard
                      title="Reviews Given"
                      value={stats?.totalReviews || 0}
                      icon={BookOpen}
                      color="secondary"
                    />
                  </div>
                )}

                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-foreground mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-between"
                      onClick={() => router.push('/find-tutor')}
                    >
                      <span className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Find Tutors
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between"
                      onClick={() => router.push('/my-schedule')}
                    >
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        My Schedule
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl border p-6 space-y-4">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Profile Tips
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2.5 text-sm">
                    <div className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                    <span className="text-foreground/80">
                      Complete your profile to get better tutor matches
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm">
                    <div className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                    <span className="text-foreground/80">
                      Add all subjects you need help with
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm">
                    <div className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                    <span className="text-foreground/80">
                      Update your grade level for better recommendations
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'primary' 
}: { 
  title: string; 
  value: number; 
  icon: React.ElementType;
  color?: 'primary' | 'success' | 'warning' | 'secondary';
}) => {
  const colorConfig = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    secondary: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-background rounded-lg border hover:shadow-sm transition-all">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorConfig[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
};