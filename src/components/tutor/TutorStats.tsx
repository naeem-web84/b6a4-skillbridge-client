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
  AlertCircle,
  BarChart3,
  Target,
  Zap,
  TrendingDown
} from 'lucide-react';

export default async function TutorStats() {
  const result = await tutorStatsService.getDashboardStats();

  if (!result.success) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 shadow-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg">Failed to load dashboard stats</h3>
              <p className="mt-1 text-red-600">{result.message}</p>
              <p className="mt-2 text-sm text-red-500">Please try refreshing the page or contact support if the issue persists.</p>
            </div>
          </div>
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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format compact currency for large amounts
  const formatCompactCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return formatCurrency(amount);
  };

  // Format rating
  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  // Calculate growth indicators (mock data - you can replace with real calculations)
  const getGrowthIndicator = (value: number, previousValue: number = value * 0.8) => {
    const growth = ((value - previousValue) / previousValue) * 100;
    return {
      value: Math.abs(growth).toFixed(1),
      isPositive: growth >= 0,
      icon: growth >= 0 ? TrendingUp : TrendingDown,
      color: growth >= 0 ? 'text-emerald-600' : 'text-red-600',
      bgColor: growth >= 0 ? 'bg-emerald-50' : 'bg-red-50'
    };
  };

  // Main stats cards
  const mainStats = [
    {
      title: 'Total Earnings',
      value: formatCompactCurrency(stats.totalEarnings),
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      change: getGrowthIndicator(stats.totalEarnings),
      description: 'Lifetime earnings'
    },
    {
      title: 'Today\'s Earnings',
      value: formatCurrency(stats.todayEarnings),
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      change: getGrowthIndicator(stats.todayEarnings),
      description: 'From completed sessions today'
    },
    {
      title: 'Total Students',
      value: stats.totalStudents.toString(),
      icon: Users,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-100',
      change: getGrowthIndicator(stats.totalStudents),
      description: 'Unique students taught'
    },
    {
      title: 'Total Sessions',
      value: stats.totalSessions.toString(),
      icon: Calendar,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
      change: getGrowthIndicator(stats.totalSessions),
      description: 'All time sessions'
    }
  ];

  // Performance stats
  const performanceStats = [
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      icon: Target,
      color: 'text-emerald-600',
      change: getGrowthIndicator(stats.completionRate),
      description: 'Session completion rate'
    },
    {
      title: 'Average Rating',
      value: formatRating(stats.averageRating),
      icon: Star,
      color: 'text-yellow-500',
      max: 5,
      change: getGrowthIndicator(stats.averageRating, 4.5),
      description: 'Based on reviews'
    },
    {
      title: 'Hourly Rate',
      value: formatCurrency(stats.hourlyRate),
      icon: DollarSign,
      color: 'text-blue-600',
      change: getGrowthIndicator(stats.hourlyRate),
      description: 'Current rate per hour'
    },
    {
      title: 'Experience',
      value: `${stats.experienceYears} yrs`,
      icon: Award,
      color: 'text-purple-600',
      change: null,
      description: 'Teaching experience'
    }
  ];

  // Session stats
  const sessionStats = [
    {
      title: 'Completed',
      value: stats.completedSessions,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      change: getGrowthIndicator(stats.completedSessions),
      description: 'Successfully completed'
    },
    {
      title: 'Upcoming',
      value: stats.upcomingSessions,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: getGrowthIndicator(stats.upcomingSessions),
      description: 'Scheduled sessions'
    },
    {
      title: 'Pending',
      value: stats.pendingRequests,
      icon: AlertCircle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      change: getGrowthIndicator(stats.pendingRequests),
      description: 'Awaiting confirmation'
    },
    {
      title: 'Available',
      value: stats.availableSlots,
      icon: BookOpen,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      change: getGrowthIndicator(stats.availableSlots),
      description: 'Open slots'
    }
  ];

  // Session breakdown
  const sessionBreakdown = [
    { 
      label: 'Completed', 
      value: stats.sessionsByStatus.completed, 
      color: 'bg-emerald-500',
      icon: CheckCircle
    },
    { 
      label: 'Confirmed', 
      value: stats.sessionsByStatus.confirmed, 
      color: 'bg-blue-500',
      icon: Calendar
    },
    { 
      label: 'Pending', 
      value: stats.sessionsByStatus.pending, 
      color: 'bg-amber-500',
      icon: AlertCircle
    },
    { 
      label: 'Cancelled', 
      value: stats.sessionsByStatus.cancelled, 
      color: 'bg-red-500',
      icon: '❌'
    },
    { 
      label: 'Rescheduled', 
      value: stats.sessionsByStatus.rescheduled, 
      color: 'bg-purple-500',
      icon: '↩️'
    }
  ];

  const totalSessionsBreakdown = sessionBreakdown.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
              <p className="mt-2 text-gray-600 text-lg">
                Welcome back! Here's your tutoring performance at a glance
              </p>
            </div>
            <div className="inline-flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
              <Award className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-medium text-gray-700">
                <span className="font-semibold">{stats.experienceYears} years</span> experience • 
                <span className="font-semibold text-gray-900 ml-2">${stats.hourlyRate}/hr</span>
              </span>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {mainStats.map((stat, index) => {
            const Icon = stat.icon;
            const ChangeIcon = stat.change?.icon;
            return (
              <div 
                key={index} 
                className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  {stat.change && ChangeIcon && (
                    <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${stat.change.bgColor} ${stat.change.color}`}>
                      <ChangeIcon className="h-3.5 w-3.5" />
                      <span>{stat.change.value}%</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-xs text-gray-500 pt-1">{stat.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Performance & Session Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Performance Metrics */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="h-6 w-6 text-gray-700" />
                <h2 className="text-xl font-bold text-gray-900">Performance Metrics</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {performanceStats.map((stat, index) => {
                  const Icon = stat.icon;
                  const ChangeIcon = stat.change?.icon;
                  return (
                    <div key={index} className="text-center p-5 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="flex justify-center mb-4">
                        <div className={`p-3 rounded-full ${stat.color.replace('text-', 'bg-')} bg-opacity-10`}>
                          <Icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                      <p className="text-sm font-medium text-gray-600 mb-3">{stat.title}</p>
                      {stat.change && ChangeIcon && (
                        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${stat.change.bgColor} ${stat.change.color}`}>
                          <ChangeIcon className="h-3 w-3" />
                          <span>{stat.change.value}%</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Session Status */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="h-6 w-6 text-gray-700" />
              <h2 className="text-xl font-bold text-gray-900">Session Status</h2>
            </div>
            
            <div className="space-y-5">
              {sessionStats.map((stat, index) => {
                const Icon = stat.icon;
                const ChangeIcon = stat.change?.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">{stat.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{stat.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      {stat.change && ChangeIcon && (
                        <div className={`inline-flex items-center gap-1 mt-1 text-xs ${stat.change.color}`}>
                          <ChangeIcon className="h-3 w-3" />
                          <span>{stat.change.value}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Session Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-gray-700" />
              <h2 className="text-xl font-bold text-gray-900">Session Status Breakdown</h2>
            </div>
            <div className="text-sm text-gray-500 font-medium">
              Total: <span className="text-gray-900 font-bold">{totalSessionsBreakdown}</span> sessions
            </div>
          </div>
          
          <div className="space-y-6">
            {sessionBreakdown.map((item, index) => {
              const percentage = totalSessionsBreakdown > 0 
                ? (item.value / totalSessionsBreakdown) * 100 
                : 0;
              
              return (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${item.color}`} />
                      <span className="font-medium text-gray-700">{item.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900 text-lg">{item.value}</span>
                      <span className="text-gray-500 text-sm ml-2">({percentage.toFixed(0)}%)</span>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full transition-all duration-500 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">Average Session Price</span>
              <Percent className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {formatCurrency(stats.averageSessionPrice)}
            </p>
            <p className="text-sm text-gray-600">Average revenue per session</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-blue-700 uppercase tracking-wider">Reviews & Ratings</span>
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="flex items-baseline gap-4">
              <p className="text-3xl font-bold text-gray-900">
                {formatRating(stats.averageRating)}
                <span className="text-gray-400 text-lg">/5</span>
              </p>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{stats.totalReviews} total reviews</p>
                <p className="text-xs text-gray-600">{stats.recentReviews} recent reviews</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-purple-700 uppercase tracking-wider">Recent Performance</span>
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {formatRating(stats.recentAverageRating)}
              <span className="text-gray-400 text-lg">/5</span>
            </p>
            <p className="text-sm text-gray-600">Average rating from recent sessions</p>
          </div>
        </div>

        {/* Weekly Earnings (if data exists) */}
        {stats.weeklyEarnings && stats.weeklyEarnings.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-6 w-6 text-gray-700" />
              <h2 className="text-xl font-bold text-gray-900">Weekly Earnings Trend</h2>
            </div>
            <div className="space-y-4">
              {stats.weeklyEarnings.map((week, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-700">W{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">{week.week}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{week.sessions} sessions</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 text-lg">
                    {formatCurrency(week.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
}