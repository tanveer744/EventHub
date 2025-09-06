import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Calendar, MapPin, Users, MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Event {
  id: number;
  title: string;
  event_type: string;
  starts_at: string;
  ends_at: string;
  location: string;
  college_id: number;
}

interface Registration {
  id: number;
  event_id: number;
  student_id: number;
  full_name: string;
  email: string;
  registered_at: string;
  attendance?: {
    present: boolean;
    marked_at: string;
  };
  feedback?: {
    rating: number;
    comment?: string;
    given_at: string;
  };
}

interface AttendanceUpdate {
  registrationId: number;
  present: boolean;
}

interface FeedbackData {
  id: number;
  event_id: number;
  student_id: number;
  rating: number;
  comment?: string;
  given_at: string;
}

interface RegistrationData {
  id: number;
  event_id: number;
  student_id: number;
  full_name: string;
  email: string;
  registered_at: string;
}

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [attendanceUpdates, setAttendanceUpdates] = useState<{ [key: number]: boolean }>({});

  const fetchEventDetails = React.useCallback(async () => {
    try {
      const response = await fetch(`/api/events/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: "Error",
            description: "Event not found",
            variant: "destructive",
          });
          return;
        }
        throw new Error('Failed to fetch event');
      }
      
      const event = await response.json();
      setEvent(event);
    } catch (error) {
      console.error('Error fetching event details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch event details",
        variant: "destructive",
      });
    }
  }, [id]);

  const fetchRegistrations = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/registrations?eventId=${id}`);
      if (!response.ok) throw new Error('Failed to fetch registrations');
      
      const regsData = await response.json();
      
      // Fetch existing feedback for this event
      const feedbackResponse = await fetch(`/api/feedback?eventId=${id}`);
      const feedbackData = feedbackResponse.ok ? await feedbackResponse.json() : [];
      
      // Combine registration data with feedback
      const enrichedRegistrations = regsData.map((reg: RegistrationData) => {
        const feedback = feedbackData.find((f: FeedbackData) => f.student_id === reg.student_id);
        return {
          ...reg,
          feedback: feedback ? {
            rating: feedback.rating,
            comment: feedback.comment,
            given_at: feedback.given_at
          } : undefined
        };
      });
      
      setRegistrations(enrichedRegistrations);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch registrations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        await fetchEventDetails();
        await fetchRegistrations();
      }
    };
    fetchData();
  }, [id, fetchEventDetails, fetchRegistrations]);

  const handleAttendanceChange = async (registrationId: number, present: boolean) => {
    try {
      const response = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationId,
          present,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark attendance');
      }

      // Update local state
      setAttendanceUpdates(prev => ({
        ...prev,
        [registrationId]: present
      }));

      toast({
        title: "Success",
        description: `Attendance ${present ? 'marked' : 'unmarked'} successfully`,
      });
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast({
        title: "Error",
        description: "Failed to mark attendance",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="mt-2">Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
            <Link to="/admin/events">
              <Button variant="outline" className="text-purple-600 border-purple-300 hover:bg-purple-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/admin/events">
            <Button variant="outline" className="text-purple-600 border-purple-300 hover:bg-purple-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Event Details</h1>
        </div>

        {/* Event Information Card */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {event.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-purple-200 text-sm">Event Type</p>
                <p className="text-white font-medium">{event.event_type}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-purple-200 text-sm">Start Date</p>
                <p className="text-white font-medium">{formatDate(event.starts_at)}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-purple-200 text-sm">End Date</p>
                <p className="text-white font-medium">{formatDate(event.ends_at)}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-300" />
                <div>
                  <p className="text-purple-200 text-sm">Location</p>
                  <p className="text-white font-medium">{event.location}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registrations Table */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Registrations ({registrations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {registrations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-purple-200">No registrations yet for this event.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left text-purple-200 font-medium py-3 px-2">Student Name</th>
                      <th className="text-left text-purple-200 font-medium py-3 px-2">Email</th>
                      <th className="text-center text-purple-200 font-medium py-3 px-2">Attendance</th>
                      <th className="text-left text-purple-200 font-medium py-3 px-2">Feedback</th>
                      <th className="text-center text-purple-200 font-medium py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((registration) => (
                      <tr key={registration.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-4 px-2 text-white font-medium">{registration.full_name}</td>
                        <td className="py-4 px-2 text-purple-200">{registration.email}</td>
                        <td className="py-4 px-2 text-center">
                          <Checkbox
                            checked={attendanceUpdates[registration.id] ?? false}
                            onCheckedChange={(checked) => 
                              handleAttendanceChange(registration.id, checked as boolean)
                            }
                            className="bg-white/10 border-white/30 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                          />
                        </td>
                        <td className="py-4 px-2">
                          {registration.feedback ? (
                            <div className="text-white">
                              <div className="flex items-center gap-2 mb-1">
                                <MessageSquare className="w-4 h-4 text-purple-300" />
                                <span className="font-medium">Rating: {registration.feedback.rating}/5</span>
                              </div>
                              {registration.feedback.comment && (
                                <p className="text-purple-200 text-sm">{registration.feedback.comment}</p>
                              )}
                              <p className="text-purple-300 text-xs mt-1">
                                Submitted: {new Date(registration.feedback.given_at).toLocaleDateString()}
                              </p>
                            </div>
                          ) : (
                            <div className="text-purple-300 text-sm">
                              No feedback submitted
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-2 text-center">
                          <span className="text-purple-300 text-sm">Admin View</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventDetail;
