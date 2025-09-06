import React, { useState } from 'react';
import { Search, Bell, User, Menu, X, Calendar, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NavigationProps {
  activeView: 'student' | 'admin';
  onViewChange: (view: 'student' | 'admin') => void;
}

export function Navigation({ activeView, onViewChange }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gold-gradient shadow-lg shadow-brand-gold/25 flex items-center justify-center transform hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gradient">EventHub</h1>
              <p className="text-xs text-muted-foreground">Campus Events</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => onViewChange('student')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeView === 'student'
                    ? 'bg-accent text-accent-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                🎉 Discover
              </button>
              <button
                onClick={() => onViewChange('admin')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeView === 'admin'
                    ? 'bg-accent text-accent-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                📊 Dashboard
              </button>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                📅 My Events
              </a>
            </div>
          </div>

          {/* Search & User Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="glass-strong hover:bg-white/30 transition-all"
              >
                <Search className="w-4 h-4" />
              </Button>
              
              {isSearchOpen && (
                <div className="absolute right-0 top-12 w-80 glass-strong rounded-xl p-4 shadow-2xl">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search events..."
                      className="pl-10 bg-white/10 border-white/20 focus:border-accent"
                    />
                  </div>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="text-muted-foreground">Popular searches:</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-accent/20 text-accent rounded-md">React Workshop</span>
                      <span className="px-2 py-1 bg-accent/20 text-accent rounded-md">Tech Fest</span>
                      <span className="px-2 py-1 bg-accent/20 text-accent rounded-md">Career Fair</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative glass-strong hover:bg-white/30 transition-all"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-electric-orange rounded-full animate-pulse"></span>
            </Button>

            {/* User Avatar */}
            <Button
              variant="ghost"
              size="icon"
              className="glass-strong hover:bg-white/30 transition-all"
            >
              <User className="w-4 h-4" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden glass-strong hover:bg-white/30 transition-all"
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 glass-strong rounded-b-xl border-t border-white/20 p-4 space-y-4">
            <div className="space-y-2">
              <button
                onClick={() => {
                  onViewChange('student');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                  activeView === 'student'
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-white/20'
                }`}
              >
                🎉 Discover Events
              </button>
              <button
                onClick={() => {
                  onViewChange('admin');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                  activeView === 'admin'
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-white/20'
                }`}
              >
                📊 Admin Dashboard
              </button>
              <a href="#" className="block px-4 py-3 hover:bg-white/20 rounded-lg transition-all">
                📅 My Events
              </a>
            </div>
            
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-10 bg-white/10 border-white/20 focus:border-accent"
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}