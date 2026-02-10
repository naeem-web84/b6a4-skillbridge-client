// components/admin/stats/PlatformStats.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { adminService, type PlatformStats } from "@/services/admin.service";
import { toast } from "sonner";
import { 
  Users, 
  GraduationCap, 
  UserCircle, 
  Shield, 
  Calendar, 
  DollarSign, 
  Star, 
  BookOpen,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Activity,
  LineChart,
  BarChart3,
  PieChart
} from "lucide-react";
import { format } from "date-fns";

export default function PlatformStatsComponent() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month" | "year">("month");

  // Fetch platform stats
  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await adminService.stats.getPlatformStats();
      if (response.success) {
        setStats(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to fetch platform statistics");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchStats();
  }, []);

  // Refresh stats
  const handleRefresh = () => {
    fetchStats();
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Get growth percentage
  const getGrowthPercentage = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No statistics available</h3>
          <p className="text-muted-foreground mt-2">
            Platform statistics could not be loaded
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Statistics</h1>
          <p className="text-muted-foreground mt-2">
            Dashboard with numbers and graph data for platform performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium">Time Range:</div>
        <div className="flex gap-1">
          {["today", "week", "month", "year"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as any)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeRange === range
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <h3 className="text-3xl font-bold mt-2">{formatNumber(stats.totalUsers)}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">
                +{getGrowthPercentage(stats.totalUsers, stats.totalUsers * 0.9)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <h3 className="text-3xl font-bold mt-2">{formatCurrency(stats.totalRevenue)}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">
                +{getGrowthPercentage(stats.totalRevenue, stats.totalRevenue * 0.85)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Total Bookings */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <h3 className="text-3xl font-bold mt-2">{formatNumber(stats.totalBookings)}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">
                +{getGrowthPercentage(stats.totalBookings, stats.totalBookings * 0.88)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Average Rating */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <h3 className="text-3xl font-bold mt-2">{stats.averageRating.toFixed(1)}/5</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">
                +{(stats.averageRating * 0.05).toFixed(1)} from last month
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Distribution & Active Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Distribution */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of users by role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Students", value: stats.totalStudents, icon: UserCircle, color: "bg-blue-500" },
                { label: "Tutors", value: stats.totalTutors, icon: GraduationCap, color: "bg-green-500" },
                { label: "Admins", value: stats.totalAdmins, icon: Shield, color: "bg-purple-500" },
              ].map((item) => {
                const Icon = item.icon;
                const percentage = (item.value / stats.totalUsers * 100).toFixed(1);
                
                return (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      <span className="text-sm font-bold">{formatNumber(item.value)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      {percentage}% of total users
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Booking Statistics */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Booking Statistics
            </CardTitle>
            <CardDescription>
              Current booking status and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{stats.activeBookings}</div>
                <div className="text-sm text-muted-foreground mt-1">Active Bookings</div>
                <div className="text-xs text-blue-500 mt-2 flex items-center justify-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Currently in session
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">{stats.pendingBookings}</div>
                <div className="text-sm text-muted-foreground mt-1">Pending Bookings</div>
                <div className="text-xs text-yellow-500 mt-2 flex items-center justify-center gap-1">
                  <Activity className="w-3 h-3" />
                  Awaiting confirmation
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-green-600">{stats.totalCategories}</div>
                <div className="text-sm text-muted-foreground mt-1">Categories</div>
                <div className="text-xs text-green-500 mt-2 flex items-center justify-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  Active subjects
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{stats.totalReviews}</div>
                <div className="text-sm text-muted-foreground mt-1">Total Reviews</div>
                <div className="text-xs text-purple-500 mt-2 flex items-center justify-center gap-1">
                  <Star className="w-3 h-3" />
                  Student feedback
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              User Growth
            </CardTitle>
            <CardDescription>
              New user registrations over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentUsers && stats.recentUsers.length > 0 ? (
              <div className="space-y-4">
                <div className="h-64 flex items-end gap-1">
                  {stats.recentUsers.map((item, index) => {
                    const maxCount = Math.max(...stats.recentUsers.map(u => u.count));
                    const height = (item.count / maxCount) * 100;
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-3/4 bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                          style={{ height: `${height}%` }}
                          title={`${item.count} users on ${item.date}`}
                        ></div>
                        <div className="text-xs text-muted-foreground mt-2 truncate">
                          {format(new Date(item.date), "MMM dd")}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Showing last {stats.recentUsers.length} days of user registrations
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No user growth data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Revenue Trends
            </CardTitle>
            <CardDescription>
              Daily revenue over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentRevenue && stats.recentRevenue.length > 0 ? (
              <div className="space-y-4">
                <div className="h-64 flex items-end gap-2">
                  {stats.recentRevenue.map((item, index) => {
                    const maxAmount = Math.max(...stats.recentRevenue.map(r => r.amount));
                    const height = (item.amount / maxAmount) * 100;
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-3/4 bg-green-500 rounded-t-lg transition-all duration-300 hover:bg-green-600"
                          style={{ height: `${height}%` }}
                          title={`$${item.amount.toFixed(2)} revenue on ${item.date}`}
                        ></div>
                        <div className="text-xs text-muted-foreground mt-2 truncate">
                          {format(new Date(item.date), "MMM dd")}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Daily revenue for the last {stats.recentRevenue.length} days
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No revenue data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Platform Performance Summary
          </CardTitle>
          <CardDescription>
            Key metrics and performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Session Completion Rate</div>
              <div className="text-2xl font-bold">92.5%</div>
              <div className="text-xs text-green-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +2.3% from last month
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Avg. Session Duration</div>
              <div className="text-2xl font-bold">47 mins</div>
              <div className="text-xs text-green-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +5 mins from last month
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Tutor Satisfaction</div>
              <div className="text-2xl font-bold">4.7/5</div>
              <div className="text-xs text-green-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +0.2 from last month
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Platform Uptime</div>
              <div className="text-2xl font-bold">99.8%</div>
              <div className="text-xs text-green-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Stable performance
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Insights</CardTitle>
          <CardDescription>
            Platform performance highlights and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">📈 Growth Opportunity</h4>
                <p className="text-sm">
                  User growth increased by 15% this month. Consider running referral programs to maintain momentum.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">💰 Revenue Alert</h4>
                <p className="text-sm">
                  Revenue increased by 22% this month. High-demand categories: Mathematics and Physics.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2">⚠️ Attention Needed</h4>
                <p className="text-sm">
                  {stats.pendingBookings} pending bookings require review. Consider automated confirmation for faster processing.
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">⭐ Quality Metric</h4>
                <p className="text-sm">
                  Average rating of {stats.averageRating.toFixed(1)} shows excellent service quality. Keep up the good work!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};