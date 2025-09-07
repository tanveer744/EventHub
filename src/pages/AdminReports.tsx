import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, BarChart3, Users, Target, Star, TrendingUp, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Event {
  id: number;
  title: string;
  event_type: string;
  starts_at: string;
  ends_at: string;
  location: string;
}

interface EventPopularity {
  event_id: number;
  title: string;
  registrations: number;
}

interface AttendanceReport {
  event_id: number;
  title: string;
  attendance_percent: number;
}

interface FeedbackReport {
  event_id: number;
  title: string;
  avg_rating: number | null;
  feedback_count: number;
}

interface StudentParticipation {
  student_id: number;
  full_name: string;
  email: string;
  events_attended: number;
}

interface DashboardStats {
  totalEvents: number;
  eventsTrend: number;
  activeRegistrations: number;
  registrationsTrend: number;
  avgAttendance: number;
  attendanceTrend: number;
  avgSatisfaction: number;
  satisfactionTrend: number;
}

const AdminReports: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [selectedFeedbackEventId, setSelectedFeedbackEventId] = useState<string>('');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  
  // Report data states
  const [eventPopularity, setEventPopularity] = useState<EventPopularity[]>([]);
  const [attendanceReport, setAttendanceReport] = useState<AttendanceReport | null>(null);
  const [feedbackReport, setFeedbackReport] = useState<FeedbackReport | null>(null);
  const [studentParticipation, setStudentParticipation] = useState<StudentParticipation[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState({
    events: false,
    popularity: false,
    attendance: false,
    feedback: false,
    participation: false,
    stats: false,
  });

  const fetchEvents = React.useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, events: true }));
      const response = await fetch('/api/events?collegeId=1');
      if (!response.ok) throw new Error('Failed to fetch events');
      
      const eventsData = await response.json();
      setEvents(eventsData);
      
      // Auto-select first event if available
      if (eventsData.length > 0 && !selectedEventId) {
        setSelectedEventId(eventsData[0].id.toString());
        setSelectedFeedbackEventId(eventsData[0].id.toString());
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, events: false }));
    }
  }, [selectedEventId]);

  const fetchEventPopularity = React.useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, popularity: true }));
      const response = await fetch('/api/reports/event-popularity?collegeId=1');
      if (!response.ok) throw new Error('Failed to fetch event popularity');
      
      const data = await response.json();
      setEventPopularity(data);
    } catch (error) {
      console.error('Error fetching event popularity:', error);
      toast({
        title: "Error",
        description: "Failed to fetch event popularity",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, popularity: false }));
    }
  }, []);

  const fetchStudentParticipation = React.useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, participation: true }));
      const response = await fetch('/api/reports/student-participation?collegeId=1');
      if (!response.ok) throw new Error('Failed to fetch student participation');
      
      const data = await response.json();
      setStudentParticipation(data);
    } catch (error) {
      console.error('Error fetching student participation:', error);
      toast({
        title: "Error",
        description: "Failed to fetch student participation",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, participation: false }));
    }
  }, []);

  const fetchAttendanceReport = React.useCallback(async (eventId: string) => {
    try {
      setLoading(prev => ({ ...prev, attendance: true }));
      const response = await fetch(`/api/reports/attendance?eventId=${eventId}`);
      if (!response.ok) throw new Error('Failed to fetch attendance report');
      
      const data = await response.json();
      setAttendanceReport(data);
    } catch (error) {
      console.error('Error fetching attendance report:', error);
      toast({
        title: "Error",
        description: "Failed to fetch attendance report",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, attendance: false }));
    }
  }, []);

  const fetchFeedbackReport = React.useCallback(async (eventId: string) => {
    try {
      setLoading(prev => ({ ...prev, feedback: true }));
      const response = await fetch(`/api/reports/avg-feedback?eventId=${eventId}`);
      if (!response.ok) throw new Error('Failed to fetch feedback report');
      
      const data = await response.json();
      setFeedbackReport(data);
    } catch (error) {
      console.error('Error fetching feedback report:', error);
      toast({
        title: "Error",
        description: "Failed to fetch feedback report",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, feedback: false }));
    }
  }, []);

  const fetchDashboardStats = React.useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      const response = await fetch('/api/dashboard/stats?collegeId=1');
      if (!response.ok) throw new Error('Failed to fetch dashboard stats');
      
      const data = await response.json();
      setDashboardStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    fetchEventPopularity();
    fetchStudentParticipation();
    fetchDashboardStats();
  }, [fetchEvents, fetchEventPopularity, fetchStudentParticipation, fetchDashboardStats]);

  useEffect(() => {
    if (selectedEventId) {
      fetchAttendanceReport(selectedEventId);
    }
  }, [selectedEventId, fetchAttendanceReport]);

  useEffect(() => {
    if (selectedFeedbackEventId) {
      fetchFeedbackReport(selectedFeedbackEventId);
    }
  }, [selectedFeedbackEventId, fetchFeedbackReport]);

  const formatEventName = (title: string) => {
    return title?.length > 30 ? `${title.substring(0, 30)}...` : title;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/admin/events">
            <Button variant="outline" className="text-purple-600 border-purple-300 hover:bg-purple-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Reports Dashboard</h1>
          <div></div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-blue-300 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{events.length}</p>
              <p className="text-blue-200 text-sm">Total Events</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-green-300 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {dashboardStats?.activeRegistrations || 0}
              </p>
              <p className="text-green-200 text-sm">Total Registrations</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-orange-300 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {attendanceReport?.attendance_percent || 0}%
              </p>
              <p className="text-orange-200 text-sm">Avg Attendance</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {feedbackReport?.avg_rating || 0}/5
              </p>
              <p className="text-yellow-200 text-sm">Avg Rating</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Event Popularity Report */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Event Popularity Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading.popularity ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
                  <p className="text-purple-200 mt-2">Loading...</p>
                </div>
              ) : eventPopularity.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-purple-200">No events with registrations found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left text-purple-200 font-medium py-2">Event</th>
                        <th className="text-right text-purple-200 font-medium py-2">Registrations</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventPopularity.map((event) => (
                        <tr key={event.event_id} className="border-b border-white/10">
                          <td className="py-3 text-white">{formatEventName(event.title)}</td>
                          <td className="py-3 text-right text-purple-200 font-mono">
                            {event.registrations}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Student Participation Report */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Top 3 Most Active Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading.participation ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
                  <p className="text-purple-200 mt-2">Loading...</p>
                </div>
              ) : studentParticipation.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-purple-200">No student participation data found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto max-h-80">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-white/10">
                      <tr className="border-b border-white/20">
                        <th className="text-left text-purple-200 font-medium py-2">Student</th>
                        <th className="text-right text-purple-200 font-medium py-2">Events Attended</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentParticipation.map((student) => (
                        <tr key={student.student_id} className="border-b border-white/10">
                          <td className="py-3">
                            <div>
                              <p className="text-white font-medium">{student.full_name}</p>
                              <p className="text-purple-300 text-sm">{student.email}</p>
                            </div>
                          </td>
                          <td className="py-3 text-right text-purple-200 font-mono">
                            {student.events_attended}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Report */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5" />
                Attendance Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-purple-200 text-sm mb-2 block">Select Event:</label>
                <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                  <SelectTrigger className="bg-white/10 border-white/30 text-white">
                    <SelectValue placeholder="Choose an event..." />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id.toString()}>
                        {event.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {loading.attendance ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
                  <p className="text-purple-200 mt-2">Loading...</p>
                </div>
              ) : attendanceReport ? (
                <div className="text-center py-8">
                  <div className="text-4xl font-bold text-white mb-2">
                    {attendanceReport.attendance_percent}%
                  </div>
                  <p className="text-purple-200">Attendance Rate</p>
                  <p className="text-purple-300 text-sm mt-2">
                    for "{formatEventName(attendanceReport.title || 'Unknown Event')}"
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-purple-200">Select an event to view attendance.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Average Feedback Report */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="w-5 h-5" />
                Average Feedback Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-purple-200 text-sm mb-2 block">Select Event:</label>
                <Select value={selectedFeedbackEventId} onValueChange={setSelectedFeedbackEventId}>
                  <SelectTrigger className="bg-white/10 border-white/30 text-white">
                    <SelectValue placeholder="Choose an event..." />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id.toString()}>
                        {event.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {loading.feedback ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
                  <p className="text-purple-200 mt-2">Loading...</p>
                </div>
              ) : feedbackReport ? (
                <div className="text-center py-8">
                  <div className="text-4xl font-bold text-white mb-2">
                    {feedbackReport.avg_rating ? `${feedbackReport.avg_rating}/5` : 'No ratings'}
                  </div>
                  <p className="text-purple-200">Average Rating</p>
                  <p className="text-purple-300 text-sm mt-2">
                    from {feedbackReport.feedback_count} feedback{feedbackReport.feedback_count !== 1 ? 's' : ''}
                  </p>
                  <p className="text-purple-300 text-sm">
                    for "{formatEventName(feedbackReport.title || 'Unknown Event')}"
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-purple-200">Select an event to view feedback.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
