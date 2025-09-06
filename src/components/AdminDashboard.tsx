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

      {/* Reports Dashboard Section */}
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">📊 Reports Dashboard</h2>
            <p className="text-muted-foreground mt-1">Comprehensive analytics and insights for your events</p>
          </div>
          <Button 
            variant="outline"
            className="glass hover:glass-strong"
            onClick={() => navigate('/admin/reports')}
          >
            <FileText className="w-4 h-4 mr-2" />
            View All Reports
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Quick Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Event Popularity Report */}
          <div className="glass rounded-2xl p-6 hover:glass-strong transition-all duration-300 cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-academic-blue/20 to-wisdom-purple/20 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-academic-blue" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">{stats?.totalEvents || 0}</div>
                <div className="text-xs text-muted-foreground">Events Analyzed</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Event Popularity</h3>
            <p className="text-sm text-muted-foreground mb-4">Track which events are most popular among students</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-academic-blue animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Live Data</span>
              </div>
              <div className="text-xs text-accent font-medium">View Report →</div>
            </div>
          </div>

          {/* Attendance Analytics */}
          <div className="glass rounded-2xl p-6 hover:glass-strong transition-all duration-300 cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-growth-green/20 to-electric-magenta/20 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-growth-green" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">{stats?.avgAttendance || 0}%</div>
                <div className="text-xs text-muted-foreground">Avg Attendance</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Attendance Analytics</h3>
            <p className="text-sm text-muted-foreground mb-4">Monitor attendance rates and patterns across events</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-growth-green animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Real-time</span>
              </div>
              <div className="text-xs text-accent font-medium">View Analytics →</div>
            </div>
          </div>

          {/* Student Feedback */}
          <div className="glass rounded-2xl p-6 hover:glass-strong transition-all duration-300 cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-electric-orange/20 to-wisdom-purple/20 group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6 text-electric-orange" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">{stats?.avgSatisfaction || 0}%</div>
                <div className="text-xs text-muted-foreground">Satisfaction</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Student Feedback</h3>
            <p className="text-sm text-muted-foreground mb-4">Analyze student feedback and satisfaction ratings</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-electric-orange animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Updated</span>
              </div>
              <div className="text-xs text-accent font-medium">View Feedback →</div>
            </div>
          </div>

          {/* Participation Insights */}
          <div className="glass rounded-2xl p-6 hover:glass-strong transition-all duration-300 cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-electric-magenta/20 to-academic-blue/20 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-electric-magenta" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">{stats?.activeRegistrations || 0}</div>
                <div className="text-xs text-muted-foreground">Total Registrations</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Participation Insights</h3>
            <p className="text-sm text-muted-foreground mb-4">Student engagement and participation patterns</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-electric-magenta animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Active</span>
              </div>
              <div className="text-xs text-accent font-medium">View Insights →</div>
            </div>
          </div>

          {/* Event Categories Overview */}
          <div className="glass rounded-2xl p-6 hover:glass-strong transition-all duration-300 cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-wisdom-purple/20 to-growth-green/20 group-hover:scale-110 transition-transform">
                <PieChart className="w-6 h-6 text-wisdom-purple" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">{eventCategories.length || 0}</div>
                <div className="text-xs text-muted-foreground">Categories</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Event Categories</h3>
            <p className="text-sm text-muted-foreground mb-4">Distribution and performance by event type</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-wisdom-purple animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Dynamic</span>
              </div>
              <div className="text-xs text-accent font-medium">View Breakdown →</div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="glass rounded-2xl p-6 bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 rounded-full bg-gradient-to-br from-accent/20 to-accent/30">
                <Clock className="w-8 h-8 text-accent" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground text-center mb-2">Quick Reports</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">Generate instant reports for any timeframe</p>
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full glass hover:glass-strong text-xs"
                onClick={() => navigate('/admin/reports')}
              >
                <FileText className="w-3 h-3 mr-2" />
                Last 7 Days Report
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full glass hover:glass-strong text-xs"
                onClick={() => navigate('/admin/reports')}
              >
                <Download className="w-3 h-3 mr-2" />
                Export All Data
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full glass hover:glass-strong text-xs"
                onClick={() => navigate('/admin/reports')}
              >
                <TrendingUp className="w-3 h-3 mr-2" />
                Trend Analysis
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="glass rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-academic-blue mb-1">
                {registrationTrends.reduce((sum, trend) => sum + trend.registrations, 0) || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Registrations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-growth-green mb-1">
                {eventCategories.length > 0 ? eventCategories[0]?.category || 'N/A' : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Top Category</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-electric-orange mb-1">
                {stats?.avgAttendance || 0}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Attendance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-wisdom-purple mb-1">
                {Math.round((stats?.avgSatisfaction || 0) / 20 * 10) / 10}/5.0
              </div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}