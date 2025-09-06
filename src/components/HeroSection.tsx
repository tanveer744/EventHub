import React, { useState } from 'react';
import { Search, Filter, Mic, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeroSectionProps {
  activeView: 'student' | 'admin';
}

export function HeroSection({ activeView }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  if (activeView === 'admin') {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-hero-gradient text-white p-8 lg:p-12 mb-8">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float-delayed" />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-12 gap-4 h-full">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="border border-white/10 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-yellow-200 font-medium">Admin Dashboard</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
            Event Command Center
          </h1>
          
          <p className="text-xl lg:text-2xl opacity-90 mb-8 animate-fade-in-up animation-delay-200">
            Orchestrate exceptional campus experiences with real-time insights and powerful management tools.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="glass-strong rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">142</div>
              <div className="text-sm opacity-80">Active Events</div>
            </div>
            <div className="glass-strong rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">3.8K</div>
              <div className="text-sm opacity-80">Participants</div>
            </div>
            <div className="glass-strong rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">94%</div>
              <div className="text-sm opacity-80">Success Rate</div>
            </div>
            <div className="glass-strong rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">28</div>
              <div className="text-sm opacity-80">This Month</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-hero-gradient text-white p-8 lg:p-12 mb-8">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float-delayed" />
        
        {/* Floating Shapes */}
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-white/5 rounded-lg rotate-45 animate-float animation-delay-500" />
        <div className="absolute bottom-1/3 left-1/2 w-16 h-16 bg-white/10 rounded-full animate-float animation-delay-700" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 gap-4 h-full">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="border border-white/20 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
          <span className="text-yellow-200 font-medium">Campus Events</span>
        </div>
        
        <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
          Discover Amazing
          <span className="block text-gradient bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            Campus Events
          </span>
        </h1>
        
        <p className="text-xl lg:text-2xl opacity-90 mb-8 animate-fade-in-up animation-delay-200">
          Connect, learn, and grow with the vibrant campus community through unforgettable experiences.
        </p>
        
        {/* Search Interface */}
        <div className="relative max-w-2xl animate-fade-in-up animation-delay-300">
          <div className="relative glass-strong rounded-2xl overflow-hidden">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            <Input
              type="text"
              placeholder="Search workshops, conferences, tech talks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-20 py-4 bg-transparent border-0 text-white placeholder-white/60 text-lg focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            
            {/* Search Actions */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/20 transition-colors"
              >
                <Mic className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/20 transition-colors"
              >
                <Filter className="w-4 h-4" />
              </Button>
              <Button className="h-8 px-4 bg-white/20 hover:bg-white/30 text-white border-0 rounded-lg font-medium transition-all">
                Search
              </Button>
            </div>
          </div>
          
          {/* Quick Filters */}
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="text-white/80 text-sm">Popular:</span>
            {['React Workshop', 'Tech Fest', 'Career Fair', 'AI Conference', 'Design Thinking'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white/90 rounded-lg text-sm font-medium transition-all hover:scale-105"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-fade-in-up animation-delay-500">
          <Button className="btn-hero px-8 py-4 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl font-semibold transform hover:scale-105 transition-all">
            🎉 Explore Events
          </Button>
          <Button className="btn-ghost-glass px-8 py-4 text-white border border-white/30 rounded-xl font-semibold transform hover:scale-105 transition-all">
            📅 My Calendar
          </Button>
        </div>
      </div>
    </div>
  );
}