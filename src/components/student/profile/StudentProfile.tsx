// components/student/profile/StudentProfile.tsx
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
    subjects: [''] // Start with one empty subject
  });
  const [newSubject, setNewSubject] = useState('');

  useEffect(() => {
    fetchProfileAndStats();
  }, []);

  const fetchProfileAndStats = async () => {
    try {
      setLoading(true);
      
      // Fetch profile
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
        // If no profile exists, create one
        const createResult = await studentService.profile.createProfile();
        if (createResult.success && createResult.data) {
          setProfile(createResult.data);
          setFormData({
            grade: createResult.data.grade || '',
            subjects: createResult.data.subjects || ['']
          });
        }
      }

      // Fetch stats
      await fetchStats();
      
    } catch (error) {
      console.error('Error fetching profile:', error);
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
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Filter out empty subjects
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
      console.error('Error updating profile:', error);
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

  // Loading Skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-8">
              {/* Header Skeleton */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-3">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
                </div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column Skeleton */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                        </div>
                      </div>
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    </div>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                      </div>
                      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    </div>
                  </div>
                </div>

                {/* Right Column Skeleton */}
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 space-y-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    ))}
                    <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl mt-6"></div>
                  </div>
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                Student Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your academic profile and track your learning journey
              </p>
            </div>
            
            {!editing && (
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => router.push('/student/bookings')}
                  variant="outline"
                  className="gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Calendar className="w-4 h-4" />
                  View Bookings
                </Button>
                <Button
                  onClick={() => router.push('/find-tutor')}
                  className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  <Target className="w-4 h-4" />
                  Find Tutors
                </Button>
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md">
                <div className="p-6">
                  {/* Profile Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <User className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
                          <Award className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                          Student Profile
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">
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
                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Grade Section */}
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <GraduationCap className="w-5 h-5 text-blue-500" />
                          Academic Level
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.grade}
                            onChange={(e) => setFormData({...formData, grade: e.target.value})}
                            className="w-full px-4 py-3 pl-12 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                            placeholder="e.g., Grade 10, 12th Standard, University Year 2"
                          />
                          <GraduationCap className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                      </div>

                      {/* Subjects Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <BookOpen className="w-5 h-5 text-purple-500" />
                            Subjects of Interest
                          </label>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                            {formData.subjects.filter(s => s.trim()).length} subjects
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          {formData.subjects.map((subject, index) => (
                            <div key={index} className="flex items-center gap-2 group">
                              <div className="relative flex-1">
                                <input
                                  type="text"
                                  value={subject}
                                  onChange={(e) => handleSubjectChange(index, e.target.value)}
                                  className="w-full px-4 py-3 pl-12 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent transition-all duration-200 group-hover:border-purple-300 dark:group-hover:border-purple-700"
                                  placeholder="Enter a subject (e.g., Mathematics, Physics)"
                                />
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                </div>
                              </div>
                              {formData.subjects.length > 1 && (
                                <Button
                                  type="button"
                                  onClick={() => handleRemoveSubject(index)}
                                  variant="ghost"
                                  size="icon"
                                  className="shrink-0 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 hover:text-red-600"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-3">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={newSubject}
                              onChange={(e) => setNewSubject(e.target.value)}
                              className="w-full px-4 py-3 pl-12 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-transparent transition-all duration-200"
                              placeholder="Add new subject"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddSubject();
                                }
                              }}
                            />
                            <Plus className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          </div>
                          <Button
                            type="button"
                            onClick={handleAddSubject}
                            variant="outline"
                            className="shrink-0 gap-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                          >
                            <Plus className="w-4 h-4" />
                            Add
                          </Button>
                        </div>
                      </div>

                      {/* Form Actions */}
                      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
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
                          className="w-full sm:w-auto px-8"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          size="lg"
                          className="w-full sm:w-auto px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  ) : (
                    /* Display Mode */
                    <div className="space-y-8">
                      {/* Info Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Grade Card */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-800/30 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                              <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-700 dark:text-gray-300">Academic Level</h3>
                              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                                {profile?.grade || 'Not specified'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Member Since Card */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 p-5 rounded-2xl border border-purple-100 dark:border-purple-800/30 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-700 dark:text-gray-300">Member Since</h3>
                              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                                {profile ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                }) : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Subjects Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            Subjects of Interest
                          </h3>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                            {profile?.subjects?.length || 0} subjects
                          </span>
                        </div>
                        
                        {profile?.subjects && profile.subjects.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {profile.subjects.map((subject, index) => (
                              <Badge 
                                key={index} 
                                variant="secondary"
                                className="px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700/30 hover:scale-105 transition-all duration-200"
                              >
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30">
                            <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                            <p className="text-gray-500 dark:text-gray-400 mb-2">
                              No subjects added yet
                            </p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
                              Add your subjects to get better tutor recommendations
                            </p>
                            <Button
                              onClick={() => setEditing(true)}
                              variant="outline"
                              size="sm"
                              className="gap-2"
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
            </div>

            {/* Right Column - Stats & Quick Actions */}
            <div className="space-y-6">
              {/* Stats Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-md">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                  Learning Statistics
                </h3>
                
                <div className="space-y-4">
                  <StatCard
                    title="Total Bookings"
                    value={stats?.totalBookings || 0}
                    icon={Calendar}
                    color="blue"
                  />
                  <StatCard
                    title="Completed Sessions"
                    value={stats?.completedSessions || 0}
                    icon={Clock}
                    color="green"
                  />
                  <StatCard
                    title="Upcoming Sessions"
                    value={stats?.upcomingSessions || 0}
                    icon={Calendar}
                    color="amber"
                  />
                  <StatCard
                    title="Reviews Given"
                    value={stats?.totalReviews || 0}
                    icon={BookOpen}
                    color="purple"
                  />
                </div>

                {/* Quick Actions */}
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Quick Actions</h4>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="w-full justify-between h-12 px-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-200"
                      onClick={() => router.push('/student/bookings')}
                    >
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        View Bookings
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="w-full justify-between h-12 px-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-200 dark:hover:border-purple-700 transition-all duration-200"
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
                      size="lg"
                      className="w-full justify-between h-12 px-4 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-200 dark:hover:border-green-700 transition-all duration-200"
                      onClick={() => router.push('/student/schedule')}
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

              {/* Tips Card */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 rounded-2xl shadow-lg p-6 border border-gray-800 transition-all duration-300 hover:shadow-xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Profile Tips
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">
                      Complete your profile to get better tutor matches
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">
                      Add all subjects you need help with
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">
                      Update your grade level for age-appropriate tutoring
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">
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

// Stat Card Component with improved design
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue' 
}: { 
  title: string; 
  value: number; 
  icon: React.ElementType;
  color?: 'blue' | 'green' | 'amber' | 'purple';
}) => {
  const colorConfig = {
    blue: {
      bg: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-100 dark:border-blue-800/30'
    },
    green: {
      bg: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      border: 'border-green-100 dark:border-green-800/30'
    },
    amber: {
      bg: 'from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10',
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-100 dark:border-amber-800/30'
    },
    purple: {
      bg: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-100 dark:border-purple-800/30'
    }
  };

  const config = colorConfig[color];

  return (
    <div className={`p-4 rounded-xl border ${config.border} ${config.bg} transition-all duration-300 hover:translate-y-[-2px] hover:shadow-sm`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.iconBg}`}>
          <Icon className={`w-6 h-6 ${config.iconColor}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
      </div>
    </div>
  );
};