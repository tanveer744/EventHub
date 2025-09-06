import React, { useState, useEffect } from 'react';
import { StatCard } from './StatCard';
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
  BarChart3,
  PieChart,
  FileText,
  Target,
  ArrowRight,
  Star,
  Clock,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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

interface RegistrationTrend {
  month: string;
  registrations: number;
}

interface EventCategory {
  category: string;
  count: number;
  percentage: number;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [registrationTrends, setRegistrationTrends] = useState<RegistrationTrend[]>([]);
  const [eventCategories, setEventCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState(true);
  
  // For demo purposes, using college ID 1
  const collegeId = 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard stats
        const statsResponse = await fetch(`http://localhost:3001/api/dashboard/stats?collegeId=${collegeId}`);
        if (!statsResponse.ok) throw new Error('Failed to fetch stats');
        const statsData = await statsResponse.json();
        setStats(statsData);

        // Fetch registration trends
        const trendsResponse = await fetch(`http://localhost:3001/api/dashboard/registration-trends?collegeId=${collegeId}`);
        if (!trendsResponse.ok) throw new Error('Failed to fetch trends');
        const trendsData = await trendsResponse.json();
        setRegistrationTrends(trendsData);

        // Fetch event categories
        const categoriesResponse = await fetch(`http://localhost:3001/api/dashboard/event-categories?collegeId=${collegeId}`);
        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesResponse.json();
        setEventCategories(categoriesData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collegeId, toast]);

  const adminStats = stats ? [
    {
      title: "Total Events",
      value: stats.totalEvents,
      trend: stats.eventsTrend,
      color: "blue" as const,
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      title: "Active Registrations",
      value: stats.activeRegistrations,
      trend: stats.registrationsTrend,
      color: "purple" as const,
      icon: <Users className="w-5 h-5" />,
    },
    {
      title: "Average Attendance",
      value: stats.avgAttendance,
      trend: stats.attendanceTrend,
      color: "green" as const,
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      title: "Student Satisfaction",
      value: stats.avgSatisfaction,
      trend: stats.satisfactionTrend,
      color: "orange" as const,
      icon: <Award className="w-5 h-5" />,
    },
  ] : [];

  // Generate chart data from registration trends
  const chartData = registrationTrends.length > 0 
    ? registrationTrends.map(trend => trend.registrations)
    : [65, 78, 90, 81, 56, 75, 95, 88, 92, 85, 79, 88]; // Fallback data

  // Calculate total events for categories
  const totalEventsByCategory = eventCategories.reduce((sum, cat) => sum + cat.count, 0);

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
          
          <Button 
            variant="outline" 
            size="icon" 
            className="glass hover:glass-strong"
            onClick={() => window.location.reload()}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button 
            variant="outline"
            className="glass hover:glass-strong"
            onClick={() => navigate('/admin/reports')}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            View Reports
          </Button>
          
          <Button 
            variant="outline"
            className="glass hover:glass-strong"
            onClick={() => navigate('/admin/events')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Manage Events
          </Button>
          
          <Button 
            className="btn-hero"
            onClick={() => navigate('/create-event')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-6 animate-pulse"
            >
              <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/4"></div>
            </div>
          ))
        ) : (
          adminStats.map((stat, index) => (
            <div
              key={stat.title}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <StatCard {...stat} />
            </div>
          ))
        )}
      </div>

      {/* Quick Actions Section */}
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">🚀 Quick Actions</h2>
            <p className="text-muted-foreground mt-1">Navigate to key administrative functions</p>
          </div>
        </div>

        {/* Navigation Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Report Viewing Box */}
          <div 
            className="glass rounded-2xl p-6 hover:glass-strong transition-all duration-300 cursor-pointer group"
            onClick={() => navigate('/admin/reports')}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-academic-blue/20 to-wisdom-purple/20 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-academic-blue" />
              </div>
              <div className="text-right">
                <ArrowRight className="w-5 h-5 text-accent group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Report Viewing</h3>
            <p className="text-sm text-muted-foreground mb-4">Access comprehensive analytics, attendance reports, and student feedback insights</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-academic-blue animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Analytics</span>
              </div>
              <div className="text-xs text-accent font-medium">View Reports →</div>
            </div>
          </div>

          {/* Manage Events Box */}
          <div 
            className="glass rounded-2xl p-6 hover:glass-strong transition-all duration-300 cursor-pointer group"
            onClick={() => navigate('/admin/events')}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-growth-green/20 to-electric-lime/20 group-hover:scale-110 transition-transform">
                <Settings className="w-6 h-6 text-growth-green" />
              </div>
              <div className="text-right">
                <ArrowRight className="w-5 h-5 text-accent group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Manage Events</h3>
            <p className="text-sm text-muted-foreground mb-4">Create, edit, and oversee all events including schedules and registrations</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-growth-green animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Management</span>
              </div>
              <div className="text-xs text-accent font-medium">Manage Events →</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}