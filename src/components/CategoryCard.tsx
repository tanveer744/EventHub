import React from 'react';

interface CategoryCardProps {
  icon: string;
  label: string;
  count: number;
  gradient?: string;
  className?: string;
  onClick?: () => void;
}

export function CategoryCard({ 
  icon, 
  label, 
  count, 
  gradient = 'from-academic-blue to-wisdom-purple',
  className = '',
  onClick 
}: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group glass rounded-xl p-6 hover:glass-strong hover:-translate-y-1 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-left w-full ${className}`}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 rounded-xl transition-opacity`} />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} text-white mb-4 shadow-lg transform group-hover:scale-110 transition-transform text-xl`}>
          {icon}
        </div>
        
        {/* Label */}
        <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors mb-1">
          {label}
        </h3>
        
        {/* Count */}
        <p className="text-sm text-muted-foreground">
          {count} events
        </p>
        
        {/* Hover Arrow */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2">
          <span className="text-accent font-medium text-sm">Explore →</span>
        </div>
      </div>
    </button>
  );
}