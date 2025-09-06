import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Eye, Plus, BarChart3, ArrowLeft } from 'lucide-react';
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

const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events?collegeId=1');
      if (!response.ok) throw new Error('Failed to fetch events');
      
      const eventsData = await response.json();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      'Hackathon': 'bg-red-500/20 text-red-300 border-red-500/30',
      'Workshop': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'TechTalk': 'bg-green-500/20 text-green-300 border-green-500/30',
      'Fest': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'Seminar': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="mt-2">Loading events...</p>
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
          <div className="flex items-center gap-4">
            <Link to="/admin">
              <Button variant="outline" className="text-purple-600 border-purple-300 hover:bg-purple-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-white">Admin - Event Management</h1>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/reports">
              <Button variant="outline" className="text-purple-600 border-purple-300 hover:bg-purple-50">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Reports
              </Button>
            </Link>
            <Link to="/create-event">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </Link>
          </div>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="text-center py-12">
              <Calendar className="w-16 h-16 text-purple-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Events Found</h3>
              <p className="text-purple-200 mb-6">Get started by creating your first event.</p>
              <Link to="/create-event">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Event
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-white text-lg font-semibold line-clamp-2">
                      {event.title}
                    </CardTitle>
                    <Badge className={`${getEventTypeColor(event.event_type)} text-xs`}>
                      {event.event_type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-purple-200 text-sm">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      <div>
                        <p>Starts: {formatDate(event.starts_at)}</p>
                        <p>Ends: {formatDate(event.ends_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-purple-200 text-sm">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Link to={`/event/${event.id}`}>
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {events.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="py-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-white">{events.length}</p>
                  <p className="text-purple-200 text-sm">Total Events</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {events.filter(e => e.event_type === 'Workshop').length}
                  </p>
                  <p className="text-purple-200 text-sm">Workshops</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {events.filter(e => e.event_type === 'Hackathon').length}
                  </p>
                  <p className="text-purple-200 text-sm">Hackathons</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {events.filter(e => new Date(e.starts_at) > new Date()).length}
                  </p>
                  <p className="text-purple-200 text-sm">Upcoming</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminEvents;
