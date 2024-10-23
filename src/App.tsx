import { useState, useEffect } from 'react';
import { Event, EventFormData } from './types';
import Navbar from './components/Navbar';
import EventCard from './components/EventCard';
import AuthModal from './components/AuthModal';
import AdminPortal from './components/AdminPortal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { saveEvents, loadEvents } from './utils/storage';

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2024',
    description: 'Join us for the biggest tech conference of the year featuring leading experts in AI, Web Development, and Cloud Computing.',
    date: '2024-06-15',
    location: 'San Francisco, CA',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80',
    attendees: [],
  },
  {
    id: '2',
    title: 'Summer Music Festival',
    description: 'A weekend of amazing live performances, food, and art installations in the heart of the city.',
    date: '2024-07-20',
    location: 'Austin, TX',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80',
    attendees: [],
  },
  {
    id: '3',
    title: 'Food & Wine Expo',
    description: 'Experience culinary excellence with tastings from top chefs and wineries from around the world.',
    date: '2024-08-10',
    location: 'New York, NY',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80',
    attendees: [],
  },
];

function EventsApp() {
  const [events, setEvents] = useState<Event[]>(() => {
    const stored = loadEvents();
    return stored.length > 0 ? stored : mockEvents;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const handleRSVP = (eventId: string) => {
    if (!user) return;

    setEvents(events.map(event => {
      if (event.id === eventId) {
        const isAttending = event.attendees.includes(user.id);
        return {
          ...event,
          attendees: isAttending
            ? event.attendees.filter(id => id !== user.id)
            : [...event.attendees, user.id],
        };
      }
      return event;
    }));
  };

  const handleCreateEvent = (formData: EventFormData) => {
    const newEvent: Event = {
      ...formData,
      id: crypto.randomUUID(),
      attendees: [],
    };
    setEvents([...events, newEvent]);
  };

  const handleUpdateEvent = (id: string, formData: EventFormData) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, ...formData } : event
    ));
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onOpenAuth={() => setIsAuthModalOpen(true)} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {user?.isAdmin && (
          <div className="mb-8">
            <AdminPortal
              events={events}
              onCreateEvent={handleCreateEvent}
              onUpdateEvent={handleUpdateEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
          {!isAuthenticated && (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
            >
              Sign In to RSVP
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onRSVP={handleRSVP}
            />
          ))}
        </div>
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <EventsApp />
    </AuthProvider>
  );
}