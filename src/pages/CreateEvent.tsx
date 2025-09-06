import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Clock, Tag, Send, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    { value: 'Hackathon', label: 'Hackathon' },
    { value: 'Workshop', label: 'Workshop' },
    { value: 'TechTalk', label: 'Tech Talk' },
    { value: 'Fest', label: 'Fest' },
    { value: 'Seminar', label: 'Seminar' },
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
        navigate('/?view=admin');
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-fade-in-up">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate('/?view=admin')}
                className="glass hover:glass-strong"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  <Plus className="w-8 h-8 inline-block mr-3 text-accent" />
                  Create New Event
                </h1>
                <p className="text-muted-foreground mt-2">
                  Fill in the details below to create a new campus event
                </p>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="glass rounded-2xl p-8 animate-fade-in-up animation-delay-200">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Event Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center space-x-2 text-base font-medium">
                  <Tag className="w-4 h-4 text-accent" />
                  <span>Event Title</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter event title (e.g., Advanced React Workshop)"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="glass h-12 text-base"
                  required
                />
              </div>

              {/* Event Type */}
              <div className="space-y-2">
                <Label htmlFor="eventType" className="flex items-center space-x-2 text-base font-medium">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span>Event Type</span>
                </Label>
                <Select value={formData.eventType} onValueChange={(value) => handleInputChange('eventType', value)}>
                  <SelectTrigger className="glass h-12 text-base">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent className="glass border border-white/20">
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="hover:bg-accent/10">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date & Time Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date & Time */}
                <div className="space-y-2">
                  <Label htmlFor="startsAt" className="flex items-center space-x-2 text-base font-medium">
                    <Clock className="w-4 h-4 text-accent" />
                    <span>Start Date & Time</span>
                  </Label>
                  <Input
                    id="startsAt"
                    type="datetime-local"
                    value={formData.startsAt}
                    onChange={(e) => handleInputChange('startsAt', e.target.value)}
                    className="glass h-12 text-base"
                    required
                  />
                </div>

                {/* End Date & Time */}
                <div className="space-y-2">
                  <Label htmlFor="endsAt" className="flex items-center space-x-2 text-base font-medium">
                    <Clock className="w-4 h-4 text-accent" />
                    <span>End Date & Time</span>
                  </Label>
                  <Input
                    id="endsAt"
                    type="datetime-local"
                    value={formData.endsAt}
                    onChange={(e) => handleInputChange('endsAt', e.target.value)}
                    className="glass h-12 text-base"
                    required
                    min={formData.startsAt} // Ensure end time is after start time
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center space-x-2 text-base font-medium">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>Location</span>
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Enter event location (e.g., Auditorium A, Main Hall)"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="glass h-12 text-base"
                  required
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-white/20">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/?view=admin')}
                  className="glass hover:glass-strong px-6"
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="btn-hero px-8"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Create Event
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Help Text */}
          <div className="glass rounded-xl p-4 mt-6 animate-fade-in-up animation-delay-300">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">💡</div>
              <div>
                <h3 className="font-medium text-foreground mb-1">Pro Tips</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use descriptive titles that clearly communicate what the event is about</li>
                  <li>• Ensure end time is after start time for proper scheduling</li>
                  <li>• Include specific location details to help attendees find the venue</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
