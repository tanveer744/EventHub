import React from 'react';
import { EventCard } from './EventCard';
import { CategoryCard } from './CategoryCard';
import { StatCard } from './StatCard';
import { TrendingUp, Users, Calendar, Award } from 'lucide-react';

const featuredEvents = [
  {
    id: '1',
    title: 'Advanced React Patterns Workshop',
    description: 'Master advanced React patterns including hooks, context, and performance optimization techniques used by top tech companies.',
    category: 'Workshop',
    date: 'Dec 15, 2025',
    time: '2:00 PM - 5:00 PM',
    location: 'Auditorium A',
    attendees: 247,
    maxAttendees: 300,
    image: '',
    status: 'upcoming' as const,
    featured: true,
  },
  {
    id: '2',
    title: 'AI & Machine Learning Conference 2025',
    description: 'Join industry experts as they discuss the latest trends in AI, machine learning, and their applications in various industries.',
    category: 'Conference',
    date: 'Dec 18, 2025',
    time: '9:00 AM - 6:00 PM',
    location: 'Main Convention Center',
    attendees: 1247,
    maxAttendees: 1500,
    image: '',
    status: 'upcoming' as const,
    featured: true,
  },
  {
    id: '3',
    title: 'Live: Startup Pitch Competition',
    description: 'Watch brilliant student entrepreneurs pitch their innovative startup ideas to a panel of industry experts and venture capitalists.',
    category: 'Competition',
    date: 'Dec 12, 2025',
    time: '3:00 PM - 7:00 PM',
    location: 'Innovation Hub',
    attendees: 423,
    maxAttendees: 500,
    image: '',
    status: 'live' as const,
    featured: true,
  },
];

const regularEvents = [
  {
    id: '4',
    title: 'UI/UX Design Bootcamp',
    description: 'Learn the fundamentals of user interface and user experience design from industry professionals.',
    category: 'Workshop',
    date: 'Dec 20, 2025',
    time: '10:00 AM - 4:00 PM',
    location: 'Design Studio',
    attendees: 156,
    maxAttendees: 200,
    image: '',
    status: 'upcoming' as const,
  },
  {
    id: '5',
    title: 'Blockchain Technology Seminar',
    description: 'Explore the world of blockchain, cryptocurrencies, and decentralized applications.',
    category: 'Seminar',
    date: 'Dec 22, 2025',
    time: '1:00 PM - 4:00 PM',
    location: 'Tech Hall',
    attendees: 89,
    maxAttendees: 150,
    image: '',
    status: 'upcoming' as const,
  },
  {
    id: '6',
    title: 'Campus Career Fair 2025',
    description: 'Meet with top companies and discover exciting career opportunities in technology, finance, and more.',
    category: 'Career Fair',
    date: 'Dec 25, 2025',
    time: '9:00 AM - 5:00 PM',
    location: 'Campus Ground',
    attendees: 2156,
    maxAttendees: 3000,
    image: '',
    status: 'upcoming' as const,
  },
];

const categories = [
  { icon: '🏆', label: 'Competitions', count: 23, gradient: 'from-electric-orange to-electric-sunset' },
  { icon: '🎓', label: 'Workshops', count: 45, gradient: 'from-academic-blue to-focus-indigo' },
  { icon: '🚀', label: 'Tech Talks', count: 18, gradient: 'from-wisdom-purple to-electric-magenta' },
  { icon: '🎉', label: 'Fests', count: 12, gradient: 'from-growth-green to-electric-lime' },
  { icon: '💼', label: 'Career Fair', count: 8, gradient: 'from-energy-amber to-electric-orange' },
  { icon: '🎨', label: 'Creative', count: 15, gradient: 'from-electric-magenta to-electric-sunset' },
];

export function StudentDiscovery() {
  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Events"
          value={142}
          trend={12}
          color="blue"
          icon={<Calendar className="w-5 h-5" />}
        />
        <StatCard
          title="Participants"
          value={3847}
          trend={8}
          color="purple"
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title="This Month"
          value={28}
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
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </section>

      {/* Category Browser */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">
          📂 Browse by Category
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
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
              <EventCard event={event} />
            </div>
          ))}
        </div>
        
        {/* Load More */}
        <div className="text-center mt-8">
          <button className="btn-hero px-8 py-3 bg-gradient-to-r from-academic-blue to-wisdom-purple text-white rounded-lg font-medium hover:from-academic-blue/90 hover:to-wisdom-purple/90 transform hover:scale-105 transition-all">
            Load More Events
          </button>
        </div>
      </section>
    </div>
  );
}