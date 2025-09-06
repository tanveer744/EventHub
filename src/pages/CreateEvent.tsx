import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Clock, Tag, Send, Plus, Sparkles, Users, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function CreateEvent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    eventType: '',
    startsAt: '',
    endsAt: '',
    location: '',
    collegeId: 1 // Default college ID for demo
  });

  const eventTypes = [
    { value: 'Hackathon', label: 'Hackathon', icon: '🏆', color: 'from-electric-orange to-electric-sunset', description: 'Competitive coding events' },
    { value: 'Workshop', label: 'Workshop', icon: '🎓', color: 'from-academic-blue to-focus-indigo', description: 'Skill-building sessions' },
    { value: 'TechTalk', label: 'Tech Talk', icon: '🚀', color: 'from-wisdom-purple to-electric-magenta', description: 'Industry expert presentations' },
    { value: 'Fest', label: 'Fest', icon: '🎉', color: 'from-growth-green to-electric-lime', description: 'Cultural celebrations' },
    { value: 'Seminar', label: 'Seminar', icon: '📚', color: 'from-energy-amber to-electric-orange', description: 'Academic discussions' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Client-side validation
    if (new Date(formData.endsAt) <= new Date(formData.startsAt)) {
      toast({
        title: "Invalid Date Range",
        description: "Event end time must be after start time.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Convert datetime-local format to ISO string
      const eventData = {
        ...formData,
        startsAt: new Date(formData.startsAt).toISOString(),
        endsAt: new Date(formData.endsAt).toISOString()
      };

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        // Success - show toast and navigate back to dashboard
        toast({
          title: "Event Created Successfully!",
          description: `${formData.title} has been added to the events calendar.`,
        });
        navigate('/admin/events');
      } else {
        // Handle error
        let errorMessage = "Please check your inputs and try again.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || `Error ${response.status}`;
        }
        
        toast({
          title: "Failed to Create Event",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Network Error",
        description: "Unable to connect to the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.title && formData.eventType && formData.startsAt && formData.endsAt && formData.location;

  const selectedEventType = eventTypes.find(type => type.value === formData.eventType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-academic-blue/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-wisdom-purple/5 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-electric-magenta/5 rounded-full blur-3xl animate-float animation-delay-500" />
      </div>

      {/* Main Content */}
      <div className="relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8 animate-fade-in-up">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate('/admin/events')}
                className="glass hover:glass-strong border-white/20"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-electric-orange to-electric-sunset">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-foreground">Create New Event</h1>
                </div>
                <p className="text-muted-foreground">
                  Design and schedule your next campus event with ease
                </p>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <Badge variant="secondary" className="glass">
                Admin Panel
              </Badge>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information Card */}
                <Card className="glass border-white/20 animate-fade-in-up animation-delay-100">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2">
                      <Tag className="w-5 h-5 text-accent" />
                      <span>Basic Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Event Title */}
                    <div className="space-y-3">
                      <Label htmlFor="title" className="text-base font-medium flex items-center space-x-2">
                        <span>Event Title</span>
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="title"
                        type="text"
                        placeholder="e.g., Advanced React Workshop 2025"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="glass h-12 text-base border-white/20 focus:border-accent/50"
                        required
                      />
                    </div>

                    {/* Event Type */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium flex items-center space-x-2">
                        <span>Event Type</span>
                        <span className="text-red-500">*</span>
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {eventTypes.map((type) => (
                          <div
                            key={type.value}
                            onClick={() => handleInputChange('eventType', type.value)}
                            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                              formData.eventType === type.value
                                ? 'border-accent bg-accent/10 scale-105'
                                : 'border-white/20 glass hover:border-accent/30 hover:scale-102'
                            }`}
                          >
                            <div className="text-center space-y-2">
                              <div className="text-2xl">{type.icon}</div>
                              <div className="font-medium text-sm">{type.label}</div>
                              <div className="text-xs text-muted-foreground">{type.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Schedule & Location Card */}
                <Card className="glass border-white/20 animate-fade-in-up animation-delay-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-accent" />
                      <span>Schedule & Location</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Date & Time Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Start Date & Time */}
                      <div className="space-y-3">
                        <Label htmlFor="startsAt" className="text-base font-medium flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-green-500" />
                          <span>Start Date & Time</span>
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="startsAt"
                          type="datetime-local"
                          value={formData.startsAt}
                          onChange={(e) => handleInputChange('startsAt', e.target.value)}
                          className="glass h-12 text-base border-white/20 focus:border-accent/50"
                          required
                        />
                      </div>

                      {/* End Date & Time */}
                      <div className="space-y-3">
                        <Label htmlFor="endsAt" className="text-base font-medium flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-red-500" />
                          <span>End Date & Time</span>
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="endsAt"
                          type="datetime-local"
                          value={formData.endsAt}
                          onChange={(e) => handleInputChange('endsAt', e.target.value)}
                          className="glass h-12 text-base border-white/20 focus:border-accent/50"
                          required
                          min={formData.startsAt}
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-3">
                      <Label htmlFor="location" className="text-base font-medium flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-accent" />
                        <span>Location</span>
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="location"
                        type="text"
                        placeholder="e.g., Main Auditorium, Computer Lab 2, Conference Hall A"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="glass h-12 text-base border-white/20 focus:border-accent/50"
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Preview & Actions */}
              <div className="space-y-6">
                {/* Event Preview Card */}
                <div className="sticky top-8 space-y-6">
                  <Card className="glass border-white/20 animate-fade-in-up animation-delay-300">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5 text-accent" />
                        <span>Event Preview</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Preview Card */}
                      <div className="glass rounded-xl p-4 border border-white/10">
                        <div className="space-y-3">
                          {/* Event Type Badge */}
                          {selectedEventType && (
                            <Badge className={`bg-gradient-to-r ${selectedEventType.color} text-white border-0`}>
                              {selectedEventType.icon} {selectedEventType.label}
                            </Badge>
                          )}
                          
                          {/* Title */}
                          <h3 className="font-bold text-lg text-foreground">
                            {formData.title || 'Event Title'}
                          </h3>
                          
                          {/* Details */}
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {formData.startsAt ? 
                                  new Date(formData.startsAt).toLocaleDateString('en-US', { 
                                    weekday: 'short', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  }) : 
                                  'Select date'
                                }
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>
                                {formData.startsAt && formData.endsAt ? 
                                  `${new Date(formData.startsAt).toLocaleTimeString('en-US', { 
                                    hour: 'numeric', 
                                    minute: '2-digit' 
                                  })} - ${new Date(formData.endsAt).toLocaleTimeString('en-US', { 
                                    hour: 'numeric', 
                                    minute: '2-digit' 
                                  })}` : 
                                  'Select time'
                                }
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{formData.location || 'Enter location'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Form Validation Status */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Completion Status</h4>
                        <div className="space-y-1">
                          {[
                            { field: 'title', label: 'Event Title', filled: !!formData.title },
                            { field: 'eventType', label: 'Event Type', filled: !!formData.eventType },
                            { field: 'startsAt', label: 'Start Time', filled: !!formData.startsAt },
                            { field: 'endsAt', label: 'End Time', filled: !!formData.endsAt },
                            { field: 'location', label: 'Location', filled: !!formData.location },
                          ].map((item) => (
                            <div key={item.field} className="flex items-center space-x-2 text-sm">
                              <div className={`w-2 h-2 rounded-full ${item.filled ? 'bg-green-500' : 'bg-gray-300'}`} />
                              <span className={item.filled ? 'text-foreground' : 'text-muted-foreground'}>
                                {item.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3 pt-4 border-t border-white/20">
                        <Button
                          type="submit"
                          disabled={!isFormValid || isSubmitting}
                          className="w-full btn-hero h-12"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Creating Event...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Create Event
                            </>
                          )}
                        </Button>
                        
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => navigate('/admin/events')}
                          className="w-full glass hover:glass-strong border-white/20"
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Help Tips Card */}
                  <Card className="glass border-white/20 animate-fade-in-up animation-delay-400">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2 text-base">
                        <AlertCircle className="w-4 h-4 text-accent" />
                        <span>Quick Tips</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-start space-x-2">
                          <span className="text-accent mt-1">•</span>
                          <span>Use clear, descriptive titles that explain what attendees will learn</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-accent mt-1">•</span>
                          <span>Schedule events during peak campus hours for better attendance</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-accent mt-1">•</span>
                          <span>Choose accessible locations with adequate capacity</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
