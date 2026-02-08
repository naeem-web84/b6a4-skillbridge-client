// components/student/my-schedule/MySchedule.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    User,
    BookOpen,
    Video,
    MessageSquare,
    ChevronRight,
    History,
    XCircle,
    CheckCircle,
    AlertCircle,
    Filter,
    Search,
    RefreshCw,
    ExternalLink,
    Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import studentFindTutorService from '@/services/studentFindTutor.service';
import { StudentBooking } from '@/services/studentFindTutor.service';

type ScheduleView = 'upcoming' | 'completed' | 'cancelled' | 'all';
type DateFilter = 'today' | 'week' | 'month' | 'all';

export default function MySchedule() {
    const [bookings, setBookings] = useState<StudentBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedView, setSelectedView] = useState<ScheduleView>('upcoming');
    const [dateFilter, setDateFilter] = useState<DateFilter>('week');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const result = await studentFindTutorService.booking.getBookings({
                page: 1,
                limit: 50,
            });

            if (result.success && result.data) setBookings(result.data);
            else toast.error('Failed to load schedule');
        } catch {
            toast.error('Error loading schedule');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const filterBookings = () => {
        let filtered = bookings;

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
                filtered = filtered.filter(b => new Date(b.bookingDate).toDateString() === now.toDateString());
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

        if (selectedDate) {
            filtered = filtered.filter(b => new Date(b.bookingDate).toDateString() === selectedDate.toDateString());
        }

        return filtered.sort((a, b) => new Date(`${a.bookingDate}T${a.startTime}`).getTime() - new Date(`${b.bookingDate}T${b.startTime}`).getTime());
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

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    const formatTime = (timeString: string) => new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const getDayOfWeek = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { weekday: 'long' });
    const getUpcomingCount = () => bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length;
    const getCompletedCount = () => bookings.filter(b => b.status === 'COMPLETED').length;

    const handleJoinMeeting = (meetingLink?: string) => {
        if (!meetingLink) return toast.error('No meeting link available');
        window.open(meetingLink, '_blank');
    };
    const handleSendMessage = (tutorName?: string) => toast.info(`Messaging feature for ${tutorName || 'tutor'} coming soon!`);
    const handleCancelBooking = async (bookingId: string) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;
        try {
            const result = await studentFindTutorService.booking.cancelBooking(bookingId);
            if (result.success) { toast.success('Booking cancelled successfully'); fetchBookings(); }
            else toast.error(result.message || 'Failed to cancel booking');
        } catch { toast.error('Error cancelling booking'); }
    };
    const handleReschedule = (booking: StudentBooking) => toast.info(`Reschedule feature for ${booking.tutorProfile.headline} coming soon!`);
    const handleLeaveReview = (booking: StudentBooking) => {
        if (booking.review) toast.info('You have already reviewed this session');
        else toast.info(`Review feature for ${booking.tutorProfile.headline} coming soon!`);
    };

    const downloadSchedule = () => {
        const scheduleData = filteredBookings.map(b => ({
            Date: formatDate(b.bookingDate),
            Time: `${formatTime(b.startTime)} - ${formatTime(b.endTime)}`,
            Tutor: b.tutorProfile.user?.name || 'Unknown Tutor',
            Subject: b.category.name,
            Status: b.status,
            Duration: `${b.duration} minutes`,
            Amount: `$${b.amount}`
        }));

        const csv = [Object.keys(scheduleData[0] || {}).join(','), ...scheduleData.map(row => Object.values(row).join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `my-schedule-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Schedule downloaded successfully');
    };

    if (loading) return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse space-y-8">
                    <div className="h-8 bg-muted rounded w-48"></div>
                    <div className="h-4 bg-muted rounded w-64"></div>
                    {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-muted rounded"></div>)}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground">My Schedule</h1>
                        <p className="text-muted-foreground mt-2">Manage your tutoring sessions and track your learning journey</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={downloadSchedule} variant="outline" className="gap-2"><Download className="w-4 h-4" />Export</Button>
                        <Button onClick={fetchBookings} variant="outline" className="gap-2"><RefreshCw className="w-4 h-4" />Refresh</Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Total */}
                    <div className="bg-card rounded-xl border p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Sessions</p>
                            <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
                        </div>
                    </div>
                    {/* Upcoming */}
                    <div className="bg-card rounded-xl border p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Upcoming</p>
                            <p className="text-2xl font-bold text-foreground">{getUpcomingCount()}</p>
                        </div>
                    </div>
                    {/* Completed */}
                    <div className="bg-card rounded-xl border p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <History className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Completed</p>
                            <p className="text-2xl font-bold text-foreground">{getCompletedCount()}</p>
                        </div>
                    </div>
                    {/* This Week */}
                    <div className="bg-card rounded-xl border p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">This Week</p>
                            <p className="text-2xl font-bold text-foreground">{bookings.filter(b => new Date(b.bookingDate) >= new Date(new Date().setDate(new Date().getDate() - 7))).length}</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Filters & Schedule List */} 
                    <div className="lg:col-span-2 space-y-6">
                        {/* Filters */}
                        <div className="bg-card rounded-xl border p-6 mb-8">
                            {/* Search + View + Date Filter */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                {/* Search */}
                                <div className="relative w-full md:w-1/2">
                                    <input
                                        type="text"
                                        placeholder="Search by tutor or subject..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-20 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>

                                {/* View Buttons */}
                                <div className="flex flex-wrap gap-2">
                                    {['upcoming', 'completed', 'cancelled', 'all'].map((view) => (
                                        <Button
                                            key={view}
                                            onClick={() => setSelectedView(view as ScheduleView)}
                                            variant={selectedView === view ? 'default' : 'outline'}
                                            size="sm"
                                            className="gap-2"
                                        >
                                            {{
                                                upcoming: <Clock className="w-4 h-4" />,
                                                completed: <History className="w-4 h-4" />,
                                                cancelled: <XCircle className="w-4 h-4" />,
                                                all: <Calendar className="w-4 h-4" />
                                            }[view]}
                                            {view.charAt(0).toUpperCase() + view.slice(1)}{' '}
                                            {view === 'upcoming' ? `(${getUpcomingCount()})` : view === 'completed' ? `(${getCompletedCount()})` : ''}
                                        </Button>
                                    ))}
                                </div>

                                {/* Date Filter */}
                                <div className="flex flex-wrap gap-2">
                                    {['today', 'week', 'month', 'all'].map((filter) => (
                                        <Button
                                            key={filter}
                                            onClick={() => setDateFilter(filter as DateFilter)}
                                            variant={dateFilter === filter ? 'default' : 'outline'}
                                            size="sm"
                                        >
                                            {{
                                                today: 'Today',
                                                week: 'This Week',
                                                month: 'This Month',
                                                all: 'All Time'
                                            }[filter]}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Schedule List */}
                        <div className="space-y-4"> {/* <-- removed mt-6, spacing handled by Filters mb-8 */}
                            {filteredBookings.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">No bookings found.</p>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="bg-card rounded-xl border p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                                    >
                                        {/* Booking Info */}
                                        <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm text-muted-foreground">
                                                    {formatDate(booking.bookingDate)} | {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                                                </p>
                                                <h3 className="text-lg font-semibold text-foreground">{booking.tutorProfile.headline}</h3>
                                                <p className="text-sm text-muted-foreground">Subject: {booking.category.name}</p>
                                                <p className="text-sm text-muted-foreground">Tutor: {booking.tutorProfile.user?.name || 'Unknown'}</p>
                                            </div>
                                        </div>

                                        {/* Status & Actions */}
                                        <div className="flex flex-col md:flex-row md:items-center gap-3 mt-4 md:mt-0">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                                                {getStatusIcon(booking.status)}
                                                {booking.status}
                                            </span>

                                            {/* Action Buttons */}
                                            <div className="flex flex-wrap gap-2">
                                                {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                                                    <Button size="sm" onClick={() => handleJoinMeeting(booking.meetingLink)}>Join</Button>
                                                )}
                                                <Button size="sm" variant="outline" onClick={() => handleSendMessage(booking.tutorProfile.user?.name)}>Message</Button>
                                                {booking.status === 'CONFIRMED' && (
                                                    <>
                                                        <Button size="sm" variant="destructive" onClick={() => handleCancelBooking(booking.id)}>Cancel</Button>
                                                        <Button size="sm" variant="secondary" onClick={() => handleReschedule(booking)}>Reschedule</Button>
                                                    </>
                                                )}
                                                {booking.status === 'COMPLETED' && (
                                                    <Button size="sm" variant="default" onClick={() => handleLeaveReview(booking)}>Review</Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Column - Quick Actions */}
                    <div className="space-y-6">
                        <div className="bg-card rounded-xl border p-6 space-y-3">
                            <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
                            <Button
                                onClick={() => window.open('/find-tutor', '_self')}
                                variant="outline"
                                className="w-full justify-between"
                            >
                                <span className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Book New Tutor
                                </span>
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
