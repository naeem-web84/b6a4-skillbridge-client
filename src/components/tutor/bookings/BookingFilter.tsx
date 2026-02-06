// components/tutor/bookings/BookingFilters.tsx
import { BookingStatus } from '@/services/tutorBooking.service';

interface BookingFiltersProps {
  statusFilter: BookingStatus | 'all';
  setStatusFilter: (status: BookingStatus | 'all') => void;
  dateRange: { start: Date | null; end: Date | null };
  setDateRange: (range: { start: Date | null; end: Date | null }) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function BookingFilters({
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange,
  searchTerm,
  setSearchTerm
}: BookingFiltersProps) {
  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'bg-gray-100' },
    { value: BookingStatus.PENDING, label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: BookingStatus.CONFIRMED, label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: BookingStatus.COMPLETED, label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: BookingStatus.CANCELLED, label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    { value: BookingStatus.RESCHEDULED, label: 'Rescheduled', color: 'bg-purple-100 text-purple-800' },
  ];

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    const date = value ? new Date(value) : null;
    setDateRange({
      ...dateRange,
      [type]: date
    });
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setDateRange({ start: null, end: null });
    setSearchTerm('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by student name, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value as any)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === option.value
                  ? 'bg-black text-white'
                  : `${option.color} hover:bg-gray-200`
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Date Filters */}
        <div className="flex gap-2">
          <input
            type="date"
            value={dateRange.start?.toISOString().split('T')[0] || ''}
            onChange={(e) => handleDateChange('start', e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
            placeholder="From"
          />
          <input
            type="date"
            value={dateRange.end?.toISOString().split('T')[0] || ''}
            onChange={(e) => handleDateChange('end', e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
            placeholder="To"
          />
          <button
            onClick={clearFilters}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium whitespace-nowrap"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}