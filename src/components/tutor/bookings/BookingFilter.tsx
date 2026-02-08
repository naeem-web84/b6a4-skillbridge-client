// components/tutor/bookings/BookingFilters.tsx - UPDATED
import { BookingStatus } from '@/services/tutorBooking.service';

interface BookingFiltersProps {
  statusFilter: BookingStatus | 'all';
  setStatusFilter: (status: BookingStatus | 'all') => void;
  dateRange: { start: Date | null; end: Date | null };
  setDateRange: (range: { start: Date | null; end: Date | null }) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  connectionStatus?: 'connected' | 'connecting' | 'failed';
}

export default function BookingFilters({
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange,
  searchTerm,
  setSearchTerm,
  connectionStatus = 'connected'
}: BookingFiltersProps) {
  const statusOptions = [
    { 
      value: 'all', 
      label: 'All Status', 
      color: 'bg-gray-100',
      icon: '📋',
      count: 0 // Will be populated
    },
    { 
      value: BookingStatus.PENDING, 
      label: 'Pending', 
      color: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      icon: '⏳',
      count: 0
    },
    { 
      value: BookingStatus.CONFIRMED, 
      label: 'Confirmed', 
      color: 'bg-blue-50 text-blue-700 border border-blue-200',
      icon: '✅',
      count: 0
    },
    { 
      value: BookingStatus.COMPLETED, 
      label: 'Completed', 
      color: 'bg-green-50 text-green-700 border border-green-200',
      icon: '🎓',
      count: 0
    },
    { 
      value: BookingStatus.CANCELLED, 
      label: 'Cancelled', 
      color: 'bg-red-50 text-red-700 border border-red-200',
      icon: '❌',
      count: 0
    },
    { 
      value: BookingStatus.RESCHEDULED, 
      label: 'Rescheduled', 
      color: 'bg-purple-50 text-purple-700 border border-purple-200',
      icon: '🔄',
      count: 0
    },
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

  const isFilterActive = () => {
    return statusFilter !== 'all' || 
           dateRange.start !== null || 
           dateRange.end !== null || 
           searchTerm !== '';
  };

  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
    return adjustedDate.toISOString().split('T')[0];
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Header with Connection Status */}
        <div className="flex items-center justify-between md:hidden mb-2">
          <h3 className="text-sm font-semibold text-gray-700">Filters</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            connectionStatus === 'connected' 
              ? 'bg-emerald-100 text-emerald-800' 
              : connectionStatus === 'connecting'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-rose-100 text-rose-800'
          }`}>
            {connectionStatus === 'connected' ? 'Live' : 
             connectionStatus === 'connecting' ? 'Connecting...' : 
             'Mock Data'}
          </span>
        </div>

        {/* Search Section */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by student name, category, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 hover:border-gray-400"
            />
            <svg
              className="absolute left-3.5 top-3 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex-1">
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value as any)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                  statusFilter === option.value
                    ? option.value === 'all' 
                      ? 'bg-black text-white shadow-sm' 
                      : `${option.color.replace('bg-', 'bg-').replace(' border', '')} shadow-sm border-2 border-current`
                    : `${option.color} hover:shadow-sm hover:-translate-y-0.5`
                }`}
              >
                <span className="text-sm">{option.icon}</span>
                <span>{option.label}</span>
                {option.count > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                    statusFilter === option.value 
                      ? 'bg-white/30' 
                      : 'bg-black/10'
                  }`}>
                    {option.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Date Filters & Clear Button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="date"
                value={formatDateForInput(dateRange.start)}
                onChange={(e) => handleDateChange('start', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="From"
              />
              {dateRange.start && (
                <button
                  onClick={() => handleDateChange('start', '')}
                  className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="date"
                value={formatDateForInput(dateRange.end)}
                onChange={(e) => handleDateChange('end', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="To"
              />
              {dateRange.end && (
                <button
                  onClick={() => handleDateChange('end', '')}
                  className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            {isFilterActive() && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            )}
            
            {/* Connection Status Badge (Desktop) */}
            <div className="hidden md:flex">
              <div className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-1.5 ${
                connectionStatus === 'connected' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : connectionStatus === 'connecting'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-rose-100 text-rose-800 border border-rose-200'
              }`}>
                <div className={`h-2 w-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-emerald-500' :
                  connectionStatus === 'connecting' ? 'bg-amber-500 animate-pulse' :
                  'bg-rose-500'
                }`}></div>
                {connectionStatus === 'connected' ? 'Live Data' : 
                 connectionStatus === 'connecting' ? 'Connecting...' : 
                 'Mock Data'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Summary (Mobile) */}
      {isFilterActive() && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Active filters:</span>
              {statusFilter !== 'all' && (
                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  Status: {statusOptions.find(opt => opt.value === statusFilter)?.label}
                </span>
              )}
              {dateRange.start && (
                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  From: {dateRange.start.toLocaleDateString()}
                </span>
              )}
              {dateRange.end && (
                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  To: {dateRange.end.toLocaleDateString()}
                </span>
              )}
              {searchTerm && (
                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  Search: "{searchTerm}"
                </span>
              )}
            </div>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}