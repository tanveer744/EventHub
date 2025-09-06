import React from 'react';
import { StatCard } from './StatCard';
import { EventCard } from './EventCard';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Award, 
  Settings, 
  Plus, 
  RefreshCw,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const adminStats = [
  {
    title: "Total Events",
    value: 142,
    trend: 12,
    color: "blue" as const,
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    title: "Active Registrations",
    value: 3847,
    trend: 8,
    color: "purple" as const,
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: "Average Attendance",
    value: 87,
    trend: 5,
    color: "green" as const,
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    title: "Student Satisfaction",
    value: 94,
    trend: 2,
    color: "orange" as const,
    icon: <Award className="w-5 h-5" />,
  },
];

const recentEvents = [
  {
    id: '1',
    title: 'React Workshop - Advanced Patterns',
    description: 'Deep dive into React patterns and performance optimization',
    category: 'Workshop',
    date: 'Dec 15, 2025',
    time: '2:00 PM',
    location: 'Auditorium A',
    attendees: 247,
    maxAttendees: 300,
    image: '',
    status: 'upcoming' as const,
  },
  {
    id: '2',
    title: 'AI Conference 2025',
    description: 'Latest trends in artificial intelligence and machine learning',
    category: 'Conference',
    date: 'Dec 18, 2025',
    time: '9:00 AM',
    location: 'Convention Center',
    attendees: 1247,
    maxAttendees: 1500,
    image: '',
    status: 'upcoming' as const,
  },
  {
    id: '3',
    title: 'Startup Pitch Competition',
    description: 'Student entrepreneurs pitch their innovative startup ideas',
    category: 'Competition',
    date: 'Dec 12, 2025',
    time: '3:00 PM',
    location: 'Innovation Hub',
    attendees: 423,
    maxAttendees: 500,
    image: '',
    status: 'live' as const,
  },
];

const recentActivity = [
  {
    id: '1',
    type: 'registration',
    user: 'Sarah Chen',
    event: 'React Workshop',
    time: '2 minutes ago',
    avatar: '👩‍💻',
  },
  {
    id: '2',
    type: 'event_created',
    user: 'Admin',
    event: 'Python Bootcamp',
    time: '15 minutes ago',
    avatar: '⚡',
  },
  {
    id: '3',
    type: 'feedback',
    user: 'Mike Johnson',
    event: 'Design Thinking Workshop',
    time: '1 hour ago',
    avatar: '🎨',
  },
  {
    id: '4',
    type: 'registration',
    user: 'Lisa Wang',
    event: 'AI Conference',
    time: '2 hours ago',
    avatar: '🤖',
  },
  {
    id: '5',
    type: 'event_completed',
    user: 'Admin',
    event: 'Mobile Dev Meetup',
    time: '3 hours ago',
    avatar: '📱',
  },
];

export function AdminDashboard() {
  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      {/* Dashboard Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            📊 Dashboard Overview
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your events.
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select className="glass rounded-lg px-4 py-2 text-sm border border-white/20 focus:border-accent transition-colors">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
          </select>
          
          <Button variant="outline" size="icon" className="glass hover:glass-strong">
            <RefreshCw className="w-4 h-4" />
          </Button>
          
          <Button className="btn-hero">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => (
          <div
            key={stat.title}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Event Registrations</h3>
            <Button variant="outline" size="sm" className="glass hover:glass-strong">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          
          {/* Mock Chart */}
          <div className="h-64 flex items-end justify-between space-x-2">
            {[65, 78, 90, 81, 56, 75, 95, 88, 92, 85, 79, 88].map((height, index) => (
              <div
                key={index}
                className="bg-gradient-to-t from-academic-blue to-wisdom-purple rounded-t-lg flex-1 animate-fade-in-up"
                style={{ 
                  height: `${height}%`,
                  animationDelay: `${index * 100}ms`
                }}
              />
            ))}
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Jan</span>
            <span>Dec</span>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Event Categories</h3>
            <Button variant="outline" size="sm" className="glass hover:glass-strong">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          
          {/* Mock Donut Chart */}
          <div className="relative w-48 h-48 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-academic-blue via-wisdom-purple to-electric-magenta animate-float"></div>
            <div className="absolute inset-4 rounded-full bg-background"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">142</div>
                <div className="text-sm text-muted-foreground">Total Events</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-academic-blue"></div>
              <span>Workshops (45%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-wisdom-purple"></div>
              <span>Conferences (25%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-electric-magenta"></div>
              <span>Seminars (20%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-growth-green"></div>
              <span>Others (10%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
            <Button variant="outline" size="sm" className="glass hover:glass-strong">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div 
                key={activity.id} 
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-2xl">{activity.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    <span className="font-semibold">{activity.user}</span>
                    {activity.type === 'registration' && ' registered for '}
                    {activity.type === 'event_created' && ' created '}
                    {activity.type === 'feedback' && ' left feedback for '}
                    {activity.type === 'event_completed' && ' completed '}
                    <span className="text-accent">{activity.event}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Events */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Recent Events</h3>
            <Button variant="outline" size="sm" className="glass hover:glass-strong">
              Manage
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentEvents.slice(0, 3).map((event, index) => (
              <div 
                key={event.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <EventCard event={event} variant="compact" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Management Table */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Event Management</h3>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="glass hover:glass-strong">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="glass hover:glass-strong">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-medium text-muted-foreground">Event</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Registrations</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map((event, index) => (
                <tr 
                  key={event.id} 
                  className="border-b border-border/50 hover:bg-muted/50 transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <td className="p-3">
                    <div className="font-medium text-foreground">{event.title}</div>
                    <div className="text-muted-foreground text-xs">{event.location}</div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-accent/10 text-accent rounded-md text-xs">
                      {event.category}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    <div>{event.date}</div>
                    <div className="text-xs">{event.time}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-foreground font-medium">
                      {event.attendees}/{event.maxAttendees}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((event.attendees / (event.maxAttendees || 1)) * 100)}% full
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      event.status === 'live' 
                        ? 'bg-electric-orange/10 text-electric-orange'
                        : event.status === 'upcoming'
                        ? 'bg-growth-green/10 text-growth-green'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}