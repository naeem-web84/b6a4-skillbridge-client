"use client";

import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    User,
    History,
    XCircle,
    CheckCircle,
    AlertCircle,
    RefreshCw,
    Download,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import studentFindTutorService from '@/services/studentFindTutor.service';
import { StudentBooking } from '@/services/studentFindTutor.service';
import { useRouter } from 'next/navigation';

type ScheduleView = 'upcoming' | 'completed' | 'cancelled' | 'all';
type DateFilter = 'today' | 'week' | 'month' | 'all';

export default function MySchedule() {
    const router = useRouter();
    const [bookings, setBookings] = useState<StudentBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedView, setSelectedView] = useState<ScheduleView>('upcoming');
    const [dateFilter, setDateFilter] = useState<DateFilter>('week');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const result = await studentFindTutorService.booking.getBookings({
                page: 1,
                limit: 50,
            });

            if (result.success) {
                setBookings(Array.isArray(result.data) ? result.data : []);
            } else {
                toast.error(result.message || 'Failed to load schedule');
                setBookings([]);
            }
        } catch {
            toast.error('Error loading schedule');
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const filterBookings = () => {
        if (!Array.isArray(bookings) || bookings.length === 0) {
            return [];
        }

        let filtered = [...bookings];

        switch (selectedView) {
            case 'upcoming':
                filtered = filtered.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING');
                break;
            case 'completed':
                filtered = filtered.filter(b => b.status === 'COMPLETED');
                break;
            case 'cancelled':
                filtered = filtered.filter(b => b.status === 'CANCELLED');
                break;
        }

        const now = new Date();
        switch (dateFilter) {
            case 'today':
                filtered = filtered.filter(b => {
                    const date = new Date(b.bookingDate);
                    return date.toDateString() === now.toDateString();
                });
                break;
            case 'week':
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                filtered = filtered.filter(b => new Date(b.bookingDate) >= weekAgo);
                break;
            case 'month':
                const monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                filtered = filtered.filter(b => new Date(b.bookingDate) >= monthAgo);
                break;
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(b =>
                b.tutorProfile.headline.toLowerCase().includes(query) ||
                b.category.name.toLowerCase().includes(query) ||
                b.tutorProfile.user?.name?.toLowerCase().includes(query)
            );
        }

        return filtered.sort((a, b) => {
            const dateA = new Date(`${a.bookingDate}T${a.startTime}`).getTime();
            const dateB = new Date(`${b.bookingDate}T${b.startTime}`).getTime();
            return dateA - dateB;
        });
    };

    const filteredBookings = filterBookings();

    const getStatusIcon = (status: StudentBooking['status']) => {
        switch (status) {
            case 'CONFIRMED': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'PENDING': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
            case 'COMPLETED': return <CheckCircle className="w-4 h-4 text-blue-500" />;
            case 'CANCELLED': return <XCircle className="w-4 h-4 text-red-500" />;
            case 'RESCHEDULED': return <RefreshCw className="w-4 h-4 text-purple-500" />;
            default: return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status: StudentBooking['status']) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'COMPLETED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'RESCHEDULED': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
            });
        } catch {
            return 'Invalid date';
        }
    };

    const formatTime = (timeString: string) => {
        try {
            return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: true 
            });
        } catch {
            return 'Invalid time';
        }
    };

    const getUpcomingCount = () => {
        if (!Array.isArray(bookings)) return 0;
        return bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length;
    };

    const getCompletedCount = () => {
        if (!Array.isArray(bookings)) return 0;
        return bookings.filter(b => b.status === 'COMPLETED').length;
    };

    const getThisWeekCount = () => {
        if (!Array.isArray(bookings)) return 0;
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return bookings.filter(b => new Date(b.bookingDate) >= weekAgo).length;
    };

    const handleJoinMeeting = (meetingLink?: string) => {
        if (!meetingLink) {
            toast.error('No meeting link available');
            return;
        }
        window.open(meetingLink, '_blank', 'noopener,noreferrer');
    };

    const handleCancelBooking = async (bookingId: string) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;
        
        try {
            const result = await studentFindTutorService.booking.cancelBooking(bookingId);
            if (result.success) {
                toast.success('Booking cancelled successfully');
                fetchBookings();
            } else {
                toast.error(result.message || 'Failed to cancel booking');
            }
        } catch {
            toast.error('Error cancelling booking');
        }
    };

    const handleBookNewTutor = () => {
        router.push('/find-tutor');
    };

    const downloadSchedule = () => {
        if (!Array.isArray(filteredBookings) || filteredBookings.length === 0) {
            toast.error('No schedule data to download');
            return;
        }

        try {
            const scheduleData = filteredBookings.map(b => ({
                Date: formatDate(b.bookingDate),
                Time: `${formatTime(b.startTime)} - ${formatTime(b.endTime)}`,
                Tutor: b.tutorProfile.user?.name || 'Unknown Tutor',
                Subject: b.category.name,
                Status: b.status,
                Duration: `${b.duration} minutes`,
                Amount: `$${b.amount}`
            }));

            const headers = Object.keys(scheduleData[0]).join(',');
            const rows = scheduleData.map(row => Object.values(row).join(','));
            const csv = [headers, ...rows].join('\n');
            
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `my-schedule-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success('Schedule downloaded successfully');
        } catch {
            toast.error('Failed to download schedule');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse space-y-8">
                        <div className="h-8 bg-muted rounded w-48"></div>
                        <div className="h-4 bg-muted rounded w-64"></div>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-20 bg-muted rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground">My Schedule</h1>
                        <p className="text-muted-foreground mt-2">Manage your tutoring sessions and track your learning journey</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button 
                            onClick={downloadSchedule} 
                            variant="outline" 
                            className="gap-2"
                            disabled={!Array.isArray(filteredBookings) || filteredBookings.length === 0}
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </Button>
                        <Button 
                            onClick={fetchBookings} 
                            variant="outline" 
                            className="gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-card rounded-xl border p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Sessions</p>
                            <p className="text-2xl font-bold text-foreground">{Array.isArray(bookings) ? bookings.length : 0}</p>
                        </div>
                    </div>
                    <div className="bg-card rounded-xl border p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Upcoming</p>
                            <p className="text-2xl font-bold text-foreground">{getUpcomingCount()}</p>
                        </div>
                    </div>
                    <div className="bg-card rounded-xl border p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <History className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Completed</p>
                            <p className="text-2xl font-bold text-foreground">{getCompletedCount()}</p>
                        </div>
                    </div>
                    <div className="bg-card rounded-xl border p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">This Week</p>
                            <p className="text-2xl font-bold text-foreground">{getThisWeekCount()}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card rounded-xl border p-6">
                            <div className="flex flex-col space-y-4">
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        placeholder="Search by tutor or subject..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {(['upcoming', 'completed', 'cancelled', 'all'] as ScheduleView[]).map((view) => (
                                        <Button
                                            key={view}
                                            onClick={() => setSelectedView(view)}
                                            variant={selectedView === view ? 'default' : 'outline'}
                                            size="sm"
                                            className="gap-2"
                                        >
                                            {view === 'upcoming' && <Clock className="w-4 h-4" />}
                                            {view === 'completed' && <History className="w-4 h-4" />}
                                            {view === 'cancelled' && <XCircle className="w-4 h-4" />}
                                            {view === 'all' && <Calendar className="w-4 h-4" />}
                                            {view.charAt(0).toUpperCase() + view.slice(1)}
                                            {view === 'upcoming' && ` (${getUpcomingCount()})`}
                                            {view === 'completed' && ` (${getCompletedCount()})`}
                                        </Button>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {(['today', 'week', 'month', 'all'] as DateFilter[]).map((filter) => (
                                        <Button
                                            key={filter}
                                            onClick={() => setDateFilter(filter)}
                                            variant={dateFilter === filter ? 'default' : 'outline'}
                                            size="sm"
                                        >
                                            {filter === 'today' && 'Today'}
                                            {filter === 'week' && 'This Week'}
                                            {filter === 'month' && 'This Month'}
                                            {filter === 'all' && 'All Time'}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {!Array.isArray(filteredBookings) || filteredBookings.length === 0 ? (
                                <div className="text-center py-12 bg-card rounded-xl border">
                                    <p className="text-muted-foreground">No bookings found.</p>
                                </div>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="bg-card rounded-xl border p-6 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                        {getStatusIcon(booking.status)}
                                                        {booking.status}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground">
                                                        {formatDate(booking.bookingDate)}
                                                    </span>
                                                </div>
                                                
                                                <h3 className="text-lg font-semibold text-foreground mb-1">
                                                    {booking.tutorProfile.headline}
                                                </h3>
                                                
                                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                                                    <span>⏰ {formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                                                    <span>📚 {booking.category.name}</span>
                                                    <span>👤 {booking.tutorProfile.user?.name || 'Tutor'}</span>
                                                    <span>💰 ${booking.amount}</span>
                                                </div>

                                                {booking.meetingLink && booking.status === 'CONFIRMED' && (
                                                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded text-sm">
                                                        <span className="text-blue-600 dark:text-blue-400">Meeting link available</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                                                    <Button 
                                                        size="sm" 
                                                        onClick={() => handleJoinMeeting(booking.meetingLink)}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        Join
                                                    </Button>
                                                )}
                                                {booking.status === 'CONFIRMED' && (
                                                    <Button 
                                                        size="sm" 
                                                        variant="destructive" 
                                                        onClick={() => handleCancelBooking(booking.id)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-card rounded-xl border p-6">
                            <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
                            <Button
                                onClick={handleBookNewTutor}
                                variant="default"
                                className="w-full justify-between"
                            >
                                <span className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Book New Tutor
                                </span>
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="bg-card rounded-xl border p-6">
                            <h3 className="text-lg font-bold text-foreground mb-4">Session Summary</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Total Spent:</span>
                                    <span className="font-semibold text-foreground">
                                        ${Array.isArray(bookings) 
                                            ? bookings.reduce((sum, b) => sum + (b.amount || 0), 0)
                                            : 0}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Total Hours:</span>
                                    <span className="font-semibold text-foreground">
                                        {Array.isArray(bookings)
                                            ? (bookings.reduce((sum, b) => sum + (b.duration || 0), 0) / 60).toFixed(1)
                                            : 0} hrs
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Cancellation Rate:</span>
                                    <span className="font-semibold text-foreground">
                                        {Array.isArray(bookings) && bookings.length > 0
                                            ? ((bookings.filter(b => b.status === 'CANCELLED').length / bookings.length) * 100).toFixed(0)
                                            : 0}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};