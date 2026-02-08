"use client";

import React, { useState, useEffect } from 'react'; 
import { Edit2, User, BookOpen, GraduationCap, Calendar, Clock, Plus, X, ChevronRight, Mail, Award, Target } from 'lucide-react';
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

export const StudentProfile = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    grade: '',
    subjects: ['']
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
          subjects: profileResult.data.subjects.length > 0 
            ? profileResult.data.subjects 
            : ['']
        });
      } else {
        const createResult = await studentService.profile.createProfile();
        if (createResult.success && createResult.data) {
          setProfile(createResult.data);
          setFormData({
            grade: createResult.data.grade || '',
            subjects: createResult.data.subjects || ['']
          });
        }
      }

      await fetchStats();
      
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const bookingsResult = await studentService.bookings.getBookings();
      
      if (bookingsResult.success) {
        const bookings = bookingsResult.data || [];
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
    } catch (error) {
      // Silent fail for stats
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
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while updating profile');
    }
  };

  const handleAddSubject = () => {
    if (newSubject.trim()) {
      setFormData({
        ...formData,
        subjects: [...formData.subjects, newSubject.trim()]
      });
      setNewSubject('');
      toast.success('Subject added');
    } else {
      toast.error('Please enter a subject');
    }
  };

  const handleRemoveSubject = (index: number) => {
    const updatedSubjects = formData.subjects.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      subjects: updatedSubjects.length > 0 ? updatedSubjects : ['']
    });
    toast.info('Subject removed');
  };

  const handleSubjectChange = (index: number, value: string) => {
    const updatedSubjects = [...formData.subjects];
    updatedSubjects[index] = value;
    setFormData({
      ...formData,
      subjects: updatedSubjects
    });
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
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-muted rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-5 bg-muted rounded w-32"></div>
                          <div className="h-3 bg-muted rounded w-48"></div>
                        </div>
                      </div>
                      <div className="h-10 bg-muted rounded w-32"></div>
                    </div>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="h-24 bg-muted rounded-xl"></div>
                        <div className="h-24 bg-muted rounded-xl"></div>
                      </div>
                      <div className="h-32 bg-muted rounded-xl"></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-card rounded-2xl p-6 space-y-4">
                    <div className="h-6 bg-muted rounded w-32 mb-4"></div>
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-16 bg-muted rounded-xl"></div>
                    ))}
                    <div className="h-24 bg-muted rounded-xl mt-6"></div>
                  </div>
                  <div className="h-48 bg-muted rounded-2xl"></div>
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
          {/* Header */}
          <div className="space-y-7">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Student Profile
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your academic profile and track your learning journey
              </p>
            </div>
            {!editing && (
              <div className="flex items-center gap-3 mb-4">
                <Button
                  onClick={() => router.push('/find-tutor')}
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 mb-4"
                >
                  <Target className="w-4 h-4" />
                  Find Tutors
                </Button>
              </div>
            )}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left - Profile */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card rounded-xl border p-8 sm:p-10 space-y-10">
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 p-3">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                        <User className="w-10 h-10 text-black" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-card flex items-center justify-center">
                        <Award className="w-3 h-3 text-black" />
                      </div>
                    </div>
                    <div className='m-3'>
                      <h2 className="text-xl font-bold text-foreground">
                        Student Profile
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Member since {profile ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric'
                          }) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => setEditing(!editing)}
                    variant={editing ? "outline" : "default"}
                    size="lg"
                    className="gap-2 min-w-[140px]"
                  >
                    <Edit2 className="w-4 h-4" />
                    {editing ? 'Cancel Edit' : 'Edit Profile'}
                  </Button>
                </div>

                {/* Edit Mode */}
                {editing ? (
                  <form onSubmit={handleSubmit} className="space-y-12 sm:space-y-14">
                    {/* Academic Level */}
                    <div className="space-y-5 sm:space-y-6">
                      <label className="block text-base font-medium text-foreground">
                        Academic Level
                      </label>
                      <input
                        type="text"
                        value={formData.grade}
                        onChange={(e) => setFormData({...formData, grade: e.target.value})}
                        className="w-full px-4 py-4 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-base"
                        placeholder="e.g., Grade 10, 12th Standard, University Year 2"
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        Enter your current academic level or grade
                      </p>
                    </div>

                    <div className="h-px bg-border my-6"></div>

                    {/* Subjects */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <label className="block text-base font-medium text-foreground">
                          Subjects of Interest
                        </label>
                        <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                          {formData.subjects.filter(s => s.trim()).length} subjects
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        {formData.subjects.map((subject, index) => (
                          <div key={index} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <input
                              type="text"
                              value={subject}
                              onChange={(e) => handleSubjectChange(index, e.target.value)}
                              className="flex-1 px-4 py-3.5 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                              placeholder="Enter a subject (e.g., Mathematics, Physics)"
                            />
                            {formData.subjects.length > 1 && (
                              <Button
                                type="button"
                                onClick={() => handleRemoveSubject(index)}
                                variant="ghost"
                                size="icon"
                                className="shrink-0 hover:bg-destructive/10 text-destructive hover:text-destructive"
                              >
                                <X className="w-5 h-5" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Add New Subject */}
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={newSubject}
                          onChange={(e) => setNewSubject(e.target.value)}
                          className="flex-1 px-4 py-3.5 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                          placeholder="Enter new subject"
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
                          className="gap-2 border-primary text-primary hover:bg-primary/10 px-6"
                        >
                          <Plus className="w-5 h-5" />
                          Add
                        </Button>
                      </div>
                    </div>

                    <div className="h-px bg-border my-8"></div>

                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                      <Button
                        type="button"
                        onClick={() => {
                          setEditing(false);
                          if (profile) {
                            setFormData({
                              grade: profile.grade || '',
                              subjects: profile.subjects.length > 0 ? profile.subjects : ['']
                            });
                          }
                        }}
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto px-10 py-3"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        size="lg"
                        className="w-full sm:w-auto px-10 py-3 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </form>
                ) : (
                  /* Display Mode (no spacing issues here) */
                  <div className="space-y-10">
                    {/* Info Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Grade Card */}
                      <div className="bg-muted p-6 rounded-xl border space-y-3">
                        <h3 className="font-semibold text-muted-foreground text-sm">Academic Level</h3>
                        <p className="text-3xl font-bold text-foreground">
                          {profile?.grade || 'Not specified'}
                        </p>
                        <div className="flex items-center gap-2 pt-2">
                          <GraduationCap className="w-5 h-5 text-primary" />
                          <span className="text-sm text-muted-foreground">Current level</span>
                        </div>
                      </div>

                      {/* Member Since Card */}
                      <div className="bg-muted p-6 rounded-xl border space-y-3">
                        <h3 className="font-semibold text-muted-foreground text-sm">Member Since</h3>
                        <p className="text-3xl font-bold text-foreground">
                          {profile ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }) : 'N/A'}
                        </p>
                        <div className="flex items-center gap-2 pt-2">
                          <Calendar className="w-5 h-5 text-primary" />
                          <span className="text-sm text-muted-foreground">Registration date</span>
                        </div>
                      </div>
                    </div>

                    {/* Subjects Section */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-foreground">Subjects of Interest</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Subjects you're currently studying or need help with
                          </p>
                        </div>
                        <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                          {profile?.subjects?.length || 0} subjects
                        </span>
                      </div>
                      
                      {profile?.subjects && profile.subjects.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                          {profile.subjects.map((subject, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary"
                              className="px-5 py-3 text-base font-medium bg-primary/10 text-primary hover:bg-primary/20"
                            >
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 border-2 border-dashed border-input rounded-xl bg-background/50 space-y-4">
                          <BookOpen className="w-14 h-14 mx-auto text-muted-foreground" />
                          <div className="space-y-2">
                            <p className="text-lg text-muted-foreground">
                              No subjects added yet
                            </p>
                            <p className="text-sm text-muted-foreground max-w-md mx-auto">
                              Add your subjects to get personalized tutor recommendations
                            </p>
                          </div>
                          <Button
                            onClick={() => setEditing(true)}
                            variant="outline"
                            size="lg"
                            className="gap-2 mt-4"
                          >
                            <Plus className="w-5 h-5" />
                            Add Subjects
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Stats & Quick Actions */}
            <div className="space-y-8">
              {/* Stats Card */}
              <div className="bg-card rounded-xl border p-6 space-y-8">
                <h3 className="text-xl font-bold text-foreground pb-4 border-b">
                  Learning Statistics
                </h3>
                
                <div className="space-y-6">
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

                <div className="h-px bg-border"></div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground text-lg">Quick Actions</h4>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="w-full justify-between h-14 px-4 hover:bg-accent hover:text-accent-foreground"
                      onClick={() => router.push('/find-tutor')}
                    >
                      <span className="flex items-center gap-3">
                        <Target className="w-5 h-5" />
                        <span className="text-base">Find Tutors</span>
                      </span>
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="w-full justify-between h-14 px-4 hover:bg-accent hover:text-accent-foreground"
                      onClick={() => router.push('/my-schedule')}
                    >
                      <span className="flex items-center gap-3">
                        <Clock className="w-5 h-5" />
                        <span className="text-base">My Schedule</span>
                      </span>
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-muted rounded-xl border p-6 space-y-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Profile Tips
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-foreground">
                      Complete your profile to get better tutor matches
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-foreground">
                      Add all subjects you need help with
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-foreground">
                      Update your grade level for age-appropriate tutoring
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-foreground">
                      Regular updates improve tutor recommendations
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

// Stat Card Component
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
    primary: {
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      bg: 'bg-background',
      border: 'border'
    },
    success: {
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      bg: 'bg-background',
      border: 'border'
    },
    warning: {
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-background',
      border: 'border'
    },
    secondary: {
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-background',
      border: 'border'
    }
  };

  const config = colorConfig[color];

  return (
    <div className={`p-5 rounded-xl ${config.bg} ${config.border} hover:shadow-sm transition-all`}>
      <div className="flex items-center gap-5">
        <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${config.iconBg}`}>
          <Icon className={`w-7 h-7 ${config.iconColor}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
};
