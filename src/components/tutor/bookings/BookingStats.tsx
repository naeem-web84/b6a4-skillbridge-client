import { BookingStats as StatsType } from '@/services/tutorBooking.service';

interface BookingStatsProps {
  stats: StatsType;
}

export default function BookingStats({ stats }: BookingStatsProps) {
  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: '📊',
      color: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Pending',
      value: stats.pendingBookings,
      icon: '⏳',
      color: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    {
      title: 'Confirmed',
      value: stats.confirmedBookings,
      icon: '✅',
      color: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Completed',
      value: stats.completedBookings,
      icon: '🎓',
      color: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      title: 'Upcoming',
      value: stats.upcomingBookings,
      icon: '📅',
      color: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    },
    {
      title: 'Total Earnings',
      value: `$${stats.totalEarnings.toFixed(2)}`,
      icon: '💰',
      color: 'bg-emerald-50',
      textColor: 'text-emerald-700'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`${stat.color} rounded-lg p-4 shadow-sm border`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className={`text-2xl font-bold ${stat.textColor} mt-1`}>
                {stat.value}
              </p>
            </div>
            <span className="text-2xl">{stat.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}