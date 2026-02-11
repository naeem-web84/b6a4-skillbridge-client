import { useState } from 'react';
import { BookingWithUser, BookingStatus } from '@/services/tutorBooking.service';
import { Calendar, Clock, DollarSign, User, Mail, GraduationCap, BookOpen, CreditCard, Link, FileText, Copy, Check, Edit, X } from 'lucide-react';

interface BookingDetailModalProps {
  booking: BookingWithUser | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (bookingId: string, status: BookingStatus) => void;
  onMeetingLinkUpdate: (bookingId: string, meetingLink: string) => void;
  onRefresh: () => void;
}

export default function BookingDetailModal({
  booking,
  isOpen,
  onClose,
  onStatusUpdate,
  onMeetingLinkUpdate,
  onRefresh
}: BookingDetailModalProps) { 
  if (!isOpen || !booking) {
    return null;
  }
 
  const [meetingLink, setMeetingLink] = useState(booking.meetingLink || '');
  const [isEditingMeetingLink, setIsEditingMeetingLink] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case BookingStatus.CONFIRMED:
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case BookingStatus.COMPLETED:
        return 'bg-green-50 text-green-700 border border-green-200';
      case BookingStatus.CANCELLED:
        return 'bg-red-50 text-red-700 border border-red-200';
      case BookingStatus.RESCHEDULED:
        return 'bg-purple-50 text-purple-700 border border-purple-200';
      default:
        return 'bg-muted text-muted-foreground border border-border';
    }
  };

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING: return '⏳';
      case BookingStatus.CONFIRMED: return '✅';
      case BookingStatus.COMPLETED: return '🎓';
      case BookingStatus.CANCELLED: return '❌';
      case BookingStatus.RESCHEDULED: return '🔄';
      default: return '📝';
    }
  };

  const handleUpdateMeetingLink = async () => {
    if (!meetingLink.trim()) return;
    
    setIsUpdating(true);
    try {
      await onMeetingLinkUpdate(booking.id, meetingLink);
      setIsEditingMeetingLink(false);
    } catch {
      setIsEditingMeetingLink(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusUpdate = (status: BookingStatus) => {
    onStatusUpdate(booking.id, status);
    onClose();
  };

  const getAvailableStatusActions = (currentStatus: BookingStatus): BookingStatus[] => {
    switch (currentStatus) {
      case BookingStatus.PENDING:
        return [BookingStatus.CONFIRMED, BookingStatus.CANCELLED];
      case BookingStatus.CONFIRMED:
        return [BookingStatus.COMPLETED, BookingStatus.CANCELLED];
      case BookingStatus.RESCHEDULED:
        return [BookingStatus.CONFIRMED, BookingStatus.CANCELLED];
      case BookingStatus.COMPLETED:
      case BookingStatus.CANCELLED:
      default:
        return [];
    }
  };

  const handleCopyBookingId = () => {
    navigator.clipboard.writeText(booking.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const availableActions = getAvailableStatusActions(booking.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background/80 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-card rounded-lg shadow-lg border border-border">
          
          <div className="border-b border-border px-5 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-1.5 rounded-md">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-card-foreground">Booking Details</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)} {booking.status}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground hover:bg-accent p-1 rounded-md transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-primary/10 p-1.5 rounded-md">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-card-foreground">Student Information</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-medium text-sm">
                          {booking.studentUser?.name?.charAt(0) || 'S'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">{booking.studentUser?.name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {booking.studentUser?.email || 'No email'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Grade</p>
                        <div className="flex items-center gap-1.5">
                          <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                          <p className="text-sm font-medium text-card-foreground">{booking.studentProfile?.grade || '-'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Subjects</p>
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                          <p className="text-sm font-medium text-card-foreground truncate">
                            {booking.studentProfile?.subjects?.slice(0, 2).join(', ') || '-'}
                            {booking.studentProfile?.subjects?.length > 2 && '...'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-primary/10 p-1.5 rounded-md">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-card-foreground">Session Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Date</p>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <p className="text-sm font-medium text-card-foreground">{formatDate(booking.bookingDate)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Time</p>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <p className="text-sm font-medium text-card-foreground">
                          {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Duration</p>
                      <p className="text-sm font-medium text-card-foreground">{booking.duration} min</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Category</p>
                      <p className="text-sm font-medium text-card-foreground truncate">{booking.category?.name || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Amount</p>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                        <p className="text-sm font-medium text-card-foreground">${booking.amount?.toFixed(2)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Payment</p>
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                          booking.isPaid 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {booking.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-card border border-border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 p-1.5 rounded-md">
                        <Link className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="text-sm font-semibold text-card-foreground">Meeting Link</h3>
                    </div>
                    {!isEditingMeetingLink && (
                      <button
                        onClick={() => setIsEditingMeetingLink(true)}
                        className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </button>
                    )}
                  </div>
                  
                  {isEditingMeetingLink ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={meetingLink}
                        onChange={(e) => setMeetingLink(e.target.value)}
                        placeholder="Enter meeting link..."
                        className="w-full px-3 py-2 text-sm border border-input rounded-md focus:ring-1 focus:ring-ring focus:border-primary text-card-foreground bg-background"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdateMeetingLink}
                          disabled={isUpdating || !meetingLink.trim()}
                          className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors flex-1"
                        >
                          {isUpdating ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingMeetingLink(false);
                            setMeetingLink(booking.meetingLink || '');
                          }}
                          className="px-3 py-1.5 text-xs bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {booking.meetingLink ? (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Current link:</p>
                          <a
                            href={booking.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:text-primary/80 break-all font-medium block truncate"
                            title={booking.meetingLink}
                          >
                            {booking.meetingLink}
                          </a>
                          <p className="text-xs text-muted-foreground mt-1">
                            Click to join meeting
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <Link className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-xs text-muted-foreground">No meeting link</p>
                          <button
                            onClick={() => setIsEditingMeetingLink(true)}
                            className="mt-1 text-xs text-primary hover:text-primary/80 font-medium"
                          >
                            Add link
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-card border border-border rounded-md p-4">
                  <h3 className="text-sm font-semibold text-card-foreground mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    {availableActions.map((action) => (
                      <button
                        key={action}
                        onClick={() => handleStatusUpdate(action)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-md border text-sm transition-all ${
                          action === BookingStatus.CONFIRMED
                            ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                            : action === BookingStatus.COMPLETED
                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                            : action === BookingStatus.CANCELLED
                            ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                            : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{getStatusIcon(action)}</span>
                          <span className="font-medium">Mark as {action}</span>
                        </div>
                        <span className="text-muted-foreground text-xs">→</span>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <button
                      onClick={handleCopyBookingId}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs bg-accent text-accent-foreground rounded-md hover:bg-accent/80 font-medium transition-colors"
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copied ? 'Copied!' : 'Copy ID'}
                    </button>
                    <button
                      onClick={onRefresh}
                      className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium transition-colors"
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                {booking.notes && (
                  <div className="bg-card border border-border rounded-md p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-primary/10 p-1.5 rounded-md">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="text-sm font-semibold text-card-foreground">Notes</h3>
                    </div>
                    <p className="text-sm text-card-foreground line-clamp-3">{booking.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between text-xs text-muted-foreground">
                <div>
                  <p><span className="font-medium">Created:</span> {new Date(booking.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p><span className="font-medium">Updated:</span> {new Date(booking.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border px-5 py-3">
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-1.5 text-sm bg-card border border-input text-card-foreground rounded-md hover:bg-accent font-medium transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onRefresh();
                  onClose();
                }}
                className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium transition-colors"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}