import React, { useState, useEffect } from 'react';
import { EventCard } from './EventCard';
import { CategoryCard } from './CategoryCard';
import { StatCard } from './StatCard';
import { TrendingUp, Users, Calendar, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define interfaces for type safety
interface Event {
  id: number;
  title: string;
  event_type: string;
  starts_at: string;
  ends_at: string;
  location: string;
  college_id: number;
}

interface FormattedEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees?: number;
  image: string;
  status: 'upcoming' | 'live' | 'completed';
  featured?: boolean;
}

// Utility function to format API events for display
const formatEvent = (event: Event): FormattedEvent => {
  const startDate = new Date(event.starts_at);
  const endDate = new Date(event.ends_at);
  
  return {
    id: event.id.toString(),
    title: event.title,
    description: `Join us for this ${event.event_type.toLowerCase()} event at ${event.location}`,
    category: event.event_type,
    date: startDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }),
    time: `${startDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    })} - ${endDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    })}`,
    location: event.location,
    attendees: Math.floor(Math.random() * 200) + 50, // Mock attendee count
    maxAttendees: Math.floor(Math.random() * 100) + 300,
    image: '',
    status: startDate > new Date() ? 'upcoming' : 'completed',
    featured: Math.random() > 0.7, // Random featured status
  };
};

const categories = [
  { icon: '🏆', label: 'Hackathon', count: 23, gradient: 'from-electric-orange to-electric-sunset' },
  { icon: '🎓', label: 'Workshop', count: 45, gradient: 'from-academic-blue to-focus-indigo' },
  { icon: '🚀', label: 'TechTalk', count: 18, gradient: 'from-wisdom-purple to-electric-magenta' },
  { icon: '🎉', label: 'Fest', count: 12, gradient: 'from-growth-green to-electric-lime' },
  { icon: '�', label: 'Seminar', count: 8, gradient: 'from-energy-amber to-electric-orange' },
];

export function StudentDiscovery() {
  const { toast } = useToast();
  const [events, setEvents] = useState<FormattedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredEvents, setFeaturedEvents] = useState<FormattedEvent[]>([]);
  const [regularEvents, setRegularEvents] = useState<FormattedEvent[]>([]);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/events?collegeId=1');
        
        if (response.ok) {
          const apiEvents: Event[] = await response.json();
          const formattedEvents = apiEvents.map(formatEvent);
          
          setEvents(formattedEvents);
          setFeaturedEvents(formattedEvents.filter(event => event.featured).slice(0, 3));
          setRegularEvents(formattedEvents.filter(event => !event.featured));
        } else {
          console.error('Failed to fetch events');
          toast({
            title: "Failed to Load Events",
            description: "Unable to fetch events. Please try again later.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        toast({
          title: "Network Error",
          description: "Unable to connect to the server.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  // Handle event registration
  const handleRegister = async (eventId: string) => {
    try {
      const studentId = 1; // Mock student ID for demo
      
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: parseInt(eventId),
          studentId: studentId,
        }),
      });

      if (response.ok) {
        const event = events.find(e => e.id === eventId);
        toast({
          title: "Registration Successful!",
          description: `You've been registered for ${event?.title}. See you there!`,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Registration Failed",
          description: errorData.error || "Unable to register for this event.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      toast({
        title: "Network Error",
        description: "Unable to process registration. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle feedback submission
  const handleFeedback = async (eventId: string, rating: number, comment?: string) => {
    try {
      const studentId = 1; // Mock student ID for demo
      
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: parseInt(eventId),
          studentId: studentId,
          rating: rating,
          comment: comment || null,
        }),
      });

      if (response.ok) {
        toast({
          title: "Feedback Submitted!",
          description: "Thank you for your feedback. It helps us improve future events.",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Feedback Failed",
          description: errorData.error || "Unable to submit feedback.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Network Error",
        description: "Unable to submit feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 pb-20 lg:pb-8">
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Events"
          value={events.length}
          trend={12}
          color="blue"
          icon={<Calendar className="w-5 h-5" />}
        />
        <StatCard
          title="Participants"
          value={events.reduce((sum, event) => sum + event.attendees, 0)}
          trend={8}
          color="purple"
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title="This Month"
          value={events.filter(event => event.status === 'upcoming').length}
          trend={-3}
          color="green"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatCard
          title="Success Rate"
          value={94}
          trend={2}
          color="orange"
          icon={<Award className="w-5 h-5" />}
        />
      </div>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
              🌟 Featured Events
            </h2>
            <button className="text-accent hover:text-accent/80 font-medium transition-colors">
              View All →
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event, index) => (
              <div
                key={event.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <EventCard 
                  event={event} 
                  onRegister={() => handleRegister(event.id)}
                  onFeedback={(rating, comment) => handleFeedback(event.id, rating, comment)}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Category Browser */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">
          📂 Browse by Category
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <div
              key={category.label}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CategoryCard {...category} />
            </div>
          ))}
        </div>
      </section>

      {/* All Events */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            📅 All Events
          </h2>
          
          <div className="flex items-center space-x-4">
            <select className="glass rounded-lg px-4 py-2 text-sm border border-white/20 focus:border-accent transition-colors">
              <option>Sort by Date</option>
              <option>Sort by Popularity</option>
              <option>Sort by Category</option>
            </select>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 glass rounded-lg hover:glass-strong transition-all">
                <div className="grid grid-cols-2 gap-1 w-4 h-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-current rounded-sm"></div>
                  ))}
                </div>
              </button>
              <button className="p-2 glass rounded-lg hover:glass-strong transition-all">
                <div className="grid grid-cols-1 gap-1 w-4 h-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-current rounded-sm"></div>
                  ))}
                </div>
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularEvents.map((event, index) => (
            <div
              key={event.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <EventCard 
                event={event} 
                onRegister={() => handleRegister(event.id)}
                onFeedback={(rating, comment) => handleFeedback(event.id, rating, comment)}
              />
            </div>
          ))}
        </div>
        
        {/* Show message if no events */}
        {events.length === 0 && (
          <div className="text-center py-12 glass rounded-2xl">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Events Available</h3>
            <p className="text-muted-foreground">Check back later for upcoming events!</p>
          </div>
        )}
      </section>
    </div>
  );
}