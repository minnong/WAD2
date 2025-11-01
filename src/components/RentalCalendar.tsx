import { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useTheme } from '../contexts/ThemeContext';
import { useRentals } from '../contexts/RentalsContext';
import { Calendar as CalendarIcon, X, Clock, MapPin, DollarSign, User, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RentalCalendarProps {
  viewMode: 'customer' | 'owner';
}

const CALENDAR_COLORS = {
  pending: '#f59e0b',
  approved: '#10b981',
  completed: '#6b7280',
  declined: '#ef4444',
  cancelled: '#9ca3af',
};

export default function RentalCalendar({ viewMode }: RentalCalendarProps) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { userRentalRequests, receivedRentalRequests } = useRentals();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  // Convert rental requests to calendar events
  const events = useMemo(() => {
    const rentals = viewMode === 'customer' ? userRentalRequests : receivedRentalRequests;
    
    // Filter out cancelled and declined bookings
    const activeRentals = rentals.filter(
      rental => rental.status !== 'cancelled' && rental.status !== 'declined'
    );
    
    return activeRentals.map((rental) => {
      const startDateTime = new Date(`${rental.startDate}T${rental.startTime}`);
      const endDateTime = new Date(`${rental.endDate}T${rental.endTime}`);
      
      return {
        id: rental.id,
        title: rental.toolName,
        start: startDateTime,
        end: endDateTime,
        backgroundColor: CALENDAR_COLORS[rental.status as keyof typeof CALENDAR_COLORS] || '#6b7280',
        borderColor: CALENDAR_COLORS[rental.status as keyof typeof CALENDAR_COLORS] || '#6b7280',
        extendedProps: {
          ...rental,
          displayTitle: viewMode === 'customer' 
            ? `🛠️ ${rental.toolName}`
            : `🛠️ ${rental.toolName}`,
        }
      };
    });
  }, [userRentalRequests, receivedRentalRequests, viewMode]);

  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event);
    setShowEventModal(true);
  };

  const formatDateTime = (date: string, time: string) => {
    try {
      const dateTime = new Date(`${date}T${time}`);
      return dateTime.toLocaleString('en-SG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return `${date} ${time}`;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'completed':
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
      case 'declined':
      case 'cancelled':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-2xl p-3 md:p-4 lg:p-6 ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'} border-0 shadow-sm`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {viewMode === 'customer' ? 'My Rental Calendar' : 'Owner Rental Calendar'}
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {events.length} rental{events.length !== 1 ? 's' : ''} scheduled
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: CALENDAR_COLORS.pending }}></div>
            <span className="text-sm">Pending</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: CALENDAR_COLORS.approved }}></div>
            <span className="text-sm">Approved</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: CALENDAR_COLORS.completed }}></div>
            <span className="text-sm">Completed</span>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className={`rounded-2xl p-3 md:p-4 lg:p-6 ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'} border-0 shadow-sm calendar-container`}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          eventClick={handleEventClick}
          height="auto"
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }}
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }}
          eventContent={(arg) => {
            return (
              <div className="fc-event-main-frame px-1">
                <div className="fc-event-time text-xs">{arg.timeText}</div>
                <div className="fc-event-title-container">
                  <div className="fc-event-title fc-sticky text-xs font-medium truncate">{arg.event.extendedProps.displayTitle}</div>
                </div>
              </div>
            );
          }}
        />
      </div>

      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl p-3 md:p-4 lg:p-6 max-w-2xl w-full shadow-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">{selectedEvent.extendedProps.toolName}</h3>
              <button
                onClick={() => setShowEventModal(false)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Status Badge */}
              <div>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold border ${getStatusBadgeColor(selectedEvent.extendedProps.status)}`}>
                  {selectedEvent.extendedProps.status.toUpperCase()}
                </span>
              </div>

              {/* Rental Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-400">Start</p>
                    <p className="font-semibold">{formatDateTime(selectedEvent.extendedProps.startDate, selectedEvent.extendedProps.startTime)}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-400">End</p>
                    <p className="font-semibold">{formatDateTime(selectedEvent.extendedProps.endDate, selectedEvent.extendedProps.endTime)}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-400">{viewMode === 'customer' ? 'Owner' : 'Renter'}</p>
                    <p className="font-semibold">{viewMode === 'customer' ? selectedEvent.extendedProps.ownerName : selectedEvent.extendedProps.renterName}</p>
                    <p className="text-sm text-gray-400">{viewMode === 'customer' ? selectedEvent.extendedProps.ownerEmail : selectedEvent.extendedProps.renterEmail}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-400">Total Cost</p>
                    <p className="font-semibold text-purple-500 text-xl">${selectedEvent.extendedProps.totalCost}</p>
                  </div>
                </div>

                {selectedEvent.extendedProps.location && (
                  <div className="flex items-start space-x-3 md:col-span-2">
                    <MapPin className="w-5 h-5 mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-400">Location</p>
                      <p className="font-semibold">{selectedEvent.extendedProps.location}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Message */}
              {selectedEvent.extendedProps.message && (
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                  <p className="text-sm font-medium text-gray-400 mb-1">Message</p>
                  <p className="text-sm">{selectedEvent.extendedProps.message}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  navigate(`/listing/${selectedEvent.extendedProps.toolId}`);
                  setShowEventModal(false);
                }}
                className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Package className="w-4 h-4" />
                <span>View Listing</span>
              </button>

              <button
                onClick={() => setShowEventModal(false)}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .calendar-container .fc {
          font-family: inherit;
          background: transparent;
        }

        .calendar-container .fc .fc-toolbar {
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding: 0;
        }

        .calendar-container .fc .fc-toolbar-title {
          font-size: 1.375rem;
          font-weight: 600;
          letter-spacing: -0.5px;
        }

        .calendar-container .fc .fc-button {
          background-color: transparent;
          border: 1px solid ${theme === 'dark' ? 'rgba(107, 114, 128, 0.3)' : 'rgba(209, 213, 219, 0.5)'};
          text-transform: capitalize;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 500;
          font-size: 0.875rem;
          color: ${theme === 'dark' ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)'};
          transition: all 0.2s;
          cursor: pointer;
        }

        .calendar-container .fc .fc-button:hover {
          background-color: ${theme === 'dark' ? 'rgba(107, 114, 128, 0.1)' : 'rgba(243, 244, 246, 1)'};
          border-color: ${theme === 'dark' ? 'rgba(107, 114, 128, 0.5)' : 'rgba(209, 213, 219, 0.8)'};
        }

        .calendar-container .fc .fc-button:focus {
          box-shadow: none;
          outline: 2px solid rgba(147, 51, 234, 0.5);
          outline-offset: 2px;
        }

        .calendar-container .fc .fc-button-active {
          background-color: rgb(147 51 234);
          border-color: rgb(147 51 234);
          color: white;
        }

        .calendar-container .fc .fc-col-header-cell {
          background-color: ${theme === 'dark' ? 'rgba(31, 41, 55, 0.8)' : 'rgba(249, 250, 251, 1)'};
          font-weight: 600;
          padding: 1rem 0.5rem;
          border-bottom: 2px solid rgb(147 51 234);
          border-top: none;
          border-left: none;
          border-right: none;
          color: ${theme === 'dark' ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)'};
          font-size: 0.875rem;
          letter-spacing: 0.25px;
        }

        .calendar-container .fc .fc-daygrid-day {
          background-color: transparent;
          border: 1px solid ${theme === 'dark' ? 'rgba(75, 85, 99, 0.2)' : 'rgba(229, 231, 235, 0.6)'};
          transition: background-color 0.15s, border-color 0.15s;
        }

        .calendar-container .fc .fc-daygrid-day:hover {
          background-color: ${theme === 'dark' ? 'rgba(147, 51, 234, 0.08)' : 'rgba(243, 244, 246, 1)'};
          border-color: ${theme === 'dark' ? 'rgba(107, 114, 128, 0.4)' : 'rgba(209, 213, 219, 1)'};
        }

        .calendar-container .fc .fc-daygrid-day-number {
          padding: 0.75rem 0.5rem;
          font-weight: 500;
          font-size: 0.875rem;
          color: ${theme === 'dark' ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)'};
        }

        .calendar-container .fc .fc-day-today {
          background-color: transparent !important;
        }

        .calendar-container .fc .fc-day-today .fc-daygrid-day-number {
          background-color: rgb(147 51 234);
          color: white;
          border-radius: 0.375rem;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
          padding: 0;
          font-weight: 600;
        }

        .calendar-container .fc-daygrid-day-frame {
          min-height: 6rem;
        }

        .calendar-container .fc-daygrid-day-events {
          margin-top: 0.5rem;
        }

        .calendar-container .fc-event {
          border-radius: 0.375rem;
          padding: 0.25rem 0.375rem;
          margin-bottom: 0.25rem;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .calendar-container .fc-event:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          opacity: 0.95;
        }

        .calendar-container .fc .fc-event-main {
          padding: 0.25rem 0.375rem;
          color: white;
        }

        .calendar-container .fc .fc-event-title {
          font-weight: 500;
          white-space: normal;
          word-break: break-word;
        }

        .calendar-container .fc td,
        .calendar-container .fc th {
          border-color: ${theme === 'dark' ? 'rgba(75, 85, 99, 0.2)' : 'rgba(229, 231, 235, 0.6)'};
        }

        .calendar-container .fc {
          color: ${theme === 'dark' ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)'};
        }

        .calendar-container .fc .fc-popover {
          background-color: ${theme === 'dark' ? 'rgb(31, 41, 55)' : 'white'};
          border: 1px solid ${theme === 'dark' ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.8)'};
          border-radius: 0.5rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .calendar-container .fc .fc-popover-header {
          background-color: ${theme === 'dark' ? 'rgba(55, 65, 81, 0.8)' : 'rgba(249, 250, 251, 1)'};
          border-bottom: 1px solid ${theme === 'dark' ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.6)'};
          border-radius: 0.5rem 0.5rem 0 0;
        }

        @media (max-width: 768px) {
          .calendar-container .fc .fc-toolbar {
            flex-direction: column;
            align-items: stretch;
            margin-bottom: 1rem;
          }

          .calendar-container .fc .fc-toolbar-chunk {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 0;
          }

          .calendar-container .fc .fc-toolbar-title {
            font-size: 1.125rem;
            margin-bottom: 0.75rem;
          }

          .calendar-container .fc .fc-button {
            padding: 0.375rem 0.75rem;
            font-size: 0.8125rem;
          }

          .calendar-container .fc-daygrid-day-frame {
            min-height: 5rem;
          }

          .calendar-container .fc .fc-daygrid-day-number {
            padding: 0.5rem 0.375rem;
            font-size: 0.75rem;
          }

          .calendar-container .fc-event {
            font-size: 0.7rem;
            padding: 0.15rem 0.25rem;
          }
        }
      `}</style>
    </div>
  );
}
