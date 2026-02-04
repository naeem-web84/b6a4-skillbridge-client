 import { tutorStatsService } from '@/services/tutorStats.service';
import { 
  DollarSign, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Star, 
  TrendingUp,
  BookOpen,
  Award,
  Percent,
  AlertCircle
} from 'lucide-react';

export default async function TutorStats() {
  const result = await tutorStatsService.getDashboardStats();

  if (!result.success) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to load dashboard stats: {result.message}</span>
        </div>
      </div>
    );
  }

  const stats = result.data;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Format percentage
  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Format rating
  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  // Calculate average session duration (if you have this data)
  const averageSessionDuration = 60; // minutes - you can calculate this from your data

  // Main stats cards
  const mainStats = [
    {
      title: 'Total Earnings',
      value: formatCurrency(stats.totalEarnings),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      change: '+12.5%', // You can calculate this from weeklyEarnings
      description: 'Lifetime earnings'
    },
    {
      title: 'Today\'s Earnings',
      value: formatCurrency(stats.todayEarnings),
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      change: '+5.2%',
      description: 'From completed sessions'
    },
    {
      title: 'Total Students',
      value: stats.totalStudents.toString(),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      change: '+3',
      description: 'Unique students taught'
    },
    {
      title: 'Total Sessions',
      value: stats.totalSessions.toString(),
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      change: '+8',
      description: 'All time sessions'
    }
  ];

  // Secondary stats
  const secondaryStats = [
    {
      title: 'Completed Sessions',
      value: stats.completedSessions.toString(),
      icon: CheckCircle,
      color: 'text-emerald-600',
      subText: `${stats.completionRate}% completion rate`
    },
    {
      title: 'Upcoming Sessions',
      value: stats.upcomingSessions.toString(),
      icon: Clock,
      color: 'text-blue-600',
      subText: 'In next 7 days'
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests.toString(),
      icon: AlertCircle,
      color: 'text-amber-600',
      subText: 'Awaiting confirmation'
    },
    {
      title: 'Available Slots',
      value: stats.availableSlots.toString(),
      icon: BookOpen,
      color: 'text-indigo-600',
      subText: 'Open for booking'
    }
  ];

  // Rating stats
  const ratingStats = [
    {
      title: 'Average Rating',
      value: formatRating(stats.averageRating),
      icon: Star,
      color: 'text-yellow-500',
      max: 5,
      subText: `Based on ${stats.totalReviews} reviews`
    },
    {
      title: 'Recent Rating',
      value: formatRating(stats.recentAverageRating),
      icon: Star,
      color: 'text-yellow-500',
      max: 5,
      subText: `${stats.recentReviews} recent reviews`
    }
  ];

  // Session breakdown
  const sessionBreakdown = [
    { label: 'Completed', value: stats.sessionsByStatus.completed, color: 'bg-emerald-500' },
    { label: 'Confirmed', value: stats.sessionsByStatus.confirmed, color: 'bg-blue-500' },
    { label: 'Pending', value: stats.sessionsByStatus.pending, color: 'bg-amber-500' },
    { label: 'Cancelled', value: stats.sessionsByStatus.cancelled, color: 'bg-red-500' },
    { label: 'Rescheduled', value: stats.sessionsByStatus.rescheduled, color: 'bg-purple-500' }
  ];

  const totalSessionsBreakdown = sessionBreakdown.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your tutoring business
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Award className="h-4 w-4" />
          <span>{stats.experienceYears} years experience • ${stats.hourlyRate}/hr</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-5 shadow-sm`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              {stat.change && (
                <div className="mt-4 flex items-center text-sm">
                  <span className="font-medium text-green-600">{stat.change}</span>
                  <span className="text-gray-500 ml-2">from last month</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Secondary Stats & Rating */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Secondary Stats */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Session Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {secondaryStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center p-4 border border-gray-100 rounded-lg">
                    <div className="flex justify-center">
                      <Icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-sm font-medium text-gray-600 mt-1">{stat.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.subText}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rating Stats */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ratings & Reviews</h2>
          <div className="space-y-4">
            {ratingStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                      <span className="text-sm font-medium text-gray-700">{stat.title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                      <span className="text-gray-400">/5</span>
                    </div>
                  </div>
                  {/* Star rating visual */}
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full ${
                          i < Math.floor(Number(stat.value))
                            ? 'bg-yellow-400'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{stat.subText}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Session Breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Session Status Breakdown</h2>
          <div className="text-sm text-gray-500">
            Total: {totalSessionsBreakdown} sessions
          </div>
        </div>
        
        {/* Progress bars */}
        <div className="space-y-4">
          {sessionBreakdown.map((item, index) => {
            const percentage = totalSessionsBreakdown > 0 
              ? (item.value / totalSessionsBreakdown) * 100 
              : 0;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${item.color}`} />
                    <span className="font-medium text-gray-700">{item.label}</span>
                  </div>
                  <div className="text-gray-900">
                    <span className="font-semibold">{item.value}</span>
                    <span className="text-gray-500 ml-1">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Average Session Price</span>
            <Percent className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {formatCurrency(stats.averageSessionPrice)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Per session average</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Hourly Rate</span>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {formatCurrency(stats.hourlyRate)}
            <span className="text-sm font-normal text-gray-500"> /hr</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">Current rate</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Experience</span>
            <Award className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.experienceYears} years</p>
          <p className="text-xs text-gray-500 mt-1">Teaching experience</p>
        </div>
      </div>

      {/* Weekly Earnings (if data exists) */}
      {stats.weeklyEarnings && stats.weeklyEarnings.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Earnings Trend</h2>
          <div className="space-y-3">
            {stats.weeklyEarnings.map((week, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{week.week}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">
                    {week.sessions} sessions
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(week.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}