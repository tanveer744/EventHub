import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  trend?: number;
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'red';
  icon?: React.ReactNode;
  className?: string;
}

function AnimatedNumber({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const increment = value / (duration / 50);
    let currentValue = 0;
    
    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= value) {
        setCurrent(value);
        clearInterval(timer);
      } else {
        setCurrent(Math.floor(currentValue));
      }
    }, 50);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{current.toLocaleString()}</span>;
}

export function StatCard({ title, value, trend, color = 'blue', icon, className = '' }: StatCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'from-academic-blue/5 to-focus-indigo/5',
          icon: 'from-academic-blue to-focus-indigo',
          trend: trend && trend > 0 ? 'text-academic-blue' : trend && trend < 0 ? 'text-alert-red' : 'text-muted-foreground'
        };
      case 'purple':
        return {
          bg: 'from-wisdom-purple/5 to-electric-magenta/5',
          icon: 'from-wisdom-purple to-electric-magenta',
          trend: trend && trend > 0 ? 'text-wisdom-purple' : trend && trend < 0 ? 'text-alert-red' : 'text-muted-foreground'
        };
      case 'green':
        return {
          bg: 'from-growth-green/5 to-electric-lime/5',
          icon: 'from-growth-green to-electric-lime',
          trend: trend && trend > 0 ? 'text-growth-green' : trend && trend < 0 ? 'text-alert-red' : 'text-muted-foreground'
        };
      case 'orange':
        return {
          bg: 'from-energy-amber/5 to-electric-orange/5',
          icon: 'from-energy-amber to-electric-orange',
          trend: trend && trend > 0 ? 'text-energy-amber' : trend && trend < 0 ? 'text-alert-red' : 'text-muted-foreground'
        };
      case 'red':
        return {
          bg: 'from-alert-red/5 to-electric-sunset/5',
          icon: 'from-alert-red to-electric-sunset',
          trend: trend && trend > 0 ? 'text-alert-red' : trend && trend < 0 ? 'text-alert-red' : 'text-muted-foreground'
        };
      default:
        return {
          bg: 'from-academic-blue/5 to-focus-indigo/5',
          icon: 'from-academic-blue to-focus-indigo',
          trend: 'text-muted-foreground'
        };
    }
  };

  const colors = getColorClasses(color);

  const getTrendIcon = () => {
    if (!trend) return <Minus className="w-3 h-3" />;
    if (trend > 0) return <TrendingUp className="w-3 h-3" />;
    if (trend < 0) return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getTrendText = () => {
    if (!trend) return 'No change';
    const prefix = trend > 0 ? '+' : '';
    return `${prefix}${trend}%`;
  };

  return (
    <div className={`group glass rounded-2xl p-6 hover:glass-strong hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl ${className}`}>
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} rounded-2xl opacity-50`} />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        {icon && (
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${colors.icon} text-white mb-4 shadow-lg transform group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
        )}
        
        {/* Title */}
        <div className="text-sm font-medium text-muted-foreground mb-1">
          {title}
        </div>
        
        {/* Value and Trend */}
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold text-foreground">
            <AnimatedNumber value={value} duration={2000} />
          </div>
          
          {trend !== undefined && (
            <div className={`flex items-center space-x-1 text-sm font-medium px-2 py-1 rounded-full ${colors.trend} bg-white/10`}>
              {getTrendIcon()}
              <span>{getTrendText()}</span>
            </div>
          )}
        </div>
        
        {/* Mini Sparkline */}
        <div className="absolute bottom-6 right-6 w-16 h-8 opacity-30 group-hover:opacity-50 transition-opacity">
          <svg viewBox="0 0 64 32" className="w-full h-full">
            <path 
              d="M0,16 Q16,8 32,12 T64,8" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="2" 
              className="animate-draw-path"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}