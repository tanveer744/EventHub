import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { StudentDiscovery } from '@/components/StudentDiscovery';
import { AdminDashboard } from '@/components/AdminDashboard';

const Index = () => {
  const [activeView, setActiveView] = useState<'student' | 'admin'>('student'); 

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-academic-blue/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-wisdom-purple/5 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-electric-magenta/5 rounded-full blur-3xl animate-float animation-delay-500" />
      </div>

      {/* Navigation */}
      <Navigation activeView={activeView} onViewChange={setActiveView} />

      {/* Main Content */}
      <main className="relative pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <HeroSection activeView={activeView} />

          {/* Dynamic Content Based on View */}
          {activeView === 'student' ? (
            <StudentDiscovery />
          ) : (
            <AdminDashboard />
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation (visible on small screens) */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/20 lg:hidden z-40">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => setActiveView('student')}
            className={`flex flex-col items-center p-3 rounded-xl transition-all ${
              activeView === 'student'
                ? 'text-accent bg-accent/10'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="text-lg mb-1">🎉</span>
            <span className="text-xs font-medium">Discover</span>
          </button>
          
          <button
            onClick={() => setActiveView('admin')}
            className={`flex flex-col items-center p-3 rounded-xl transition-all ${
              activeView === 'admin'
                ? 'text-accent bg-accent/10'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="text-lg mb-1">📊</span>
            <span className="text-xs font-medium">Dashboard</span>
          </button>
          
          <button className="flex flex-col items-center p-3 rounded-xl text-muted-foreground hover:text-foreground transition-all">
            <span className="text-lg mb-1">📅</span>
            <span className="text-xs font-medium">Events</span>
          </button>
          
          <button className="flex flex-col items-center p-3 rounded-xl text-muted-foreground hover:text-foreground transition-all">
            <span className="text-lg mb-1">👤</span>
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Index;
