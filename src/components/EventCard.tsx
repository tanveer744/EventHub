import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Heart, Share2, Bookmark, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Event {
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

interface EventCardProps {
  event: Event;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export function EventCard({ event, variant = 'default', className = '' }: EventCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'live':
        return 'bg-electric-orange text-white animate-pulse';
      case 'upcoming':
        return 'bg-growth-green text-white';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: Event['status']) => {
    switch (status) {
      case 'live':
        return '🔴';
      case 'upcoming':
        return '⏰';
      case 'completed':
        return '✅';
      default:
        return '📅';
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`group glass rounded-xl overflow-hidden hover:glass-strong hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl ${className}`}>
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <Badge className={getStatusColor(event.status)}>
              {getStatusIcon(event.status)} {event.status}
            </Badge>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-brand-gold text-brand-gold' : ''}`} />
              </Button>
            </div>
          </div>
          
          <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors mb-2 line-clamp-2">
            {event.title}
          </h3>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-3 h-3 mr-1" />
              <span>{event.attendees}</span>
            </div>
          </div>
          
          <Button className="w-full btn-hero h-9 text-sm">
            Register Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`group glass rounded-2xl overflow-hidden hover:glass-strong hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl ${className}`}>
      {/* Event Image */}
      <div className="relative overflow-hidden h-48">
        <div className="w-full h-full bg-gradient-to-br from-academic-blue via-wisdom-purple to-electric-magenta"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Floating Actions */}
        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="ghost"
            size="icon"
            className="glass-strong hover:bg-red-500 hover:text-white transition-colors"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="glass-strong hover:bg-blue-500 hover:text-white transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="glass-strong hover:bg-yellow-500 hover:text-white transition-colors"
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-yellow-500 text-yellow-500' : ''}`} />
          </Button>
        </div>
        
        {/* Status Badge */}
        <Badge className={`absolute top-4 left-4 ${getStatusColor(event.status)}`}>
          {getStatusIcon(event.status)} {event.status === 'live' ? 'Live Now' : event.status}
        </Badge>
        
        {/* Featured Badge */}
        {event.featured && (
          <Badge className="absolute top-4 left-20 bg-brand-gold text-white">
            ⭐ Featured
          </Badge>
        )}
      </div>
      
      {/* Card Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className="px-3 py-1 rounded-lg bg-accent/10 text-accent border-accent/20">
            {event.category}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="w-4 h-4 mr-1" />
            <span>{event.attendees} attending</span>
            {event.maxAttendees && (
              <span className="text-muted-foreground/60">/{event.maxAttendees}</span>
            )}
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors mb-2 line-clamp-2">
          {event.title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {event.description}
        </p>
        
        <div className="flex items-center flex-wrap gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{event.location}</span>
          </div>
        </div>
        
        {/* Action Button */}
        <Button className="w-full btn-hero shimmer">
          <span className="relative z-10 flex items-center justify-center">
            Register Now
            <ExternalLink className="w-4 h-4 ml-2" />
          </span>
        </Button>
      </div>
    </div>
  );
}