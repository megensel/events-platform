import { Calendar, MapPin, Users } from 'lucide-react';
import { Event } from '../types';
import { useAuth } from '../context/AuthContext';

interface EventCardProps {
  event: Event;
  onRSVP: (eventId: string) => void;
}

export default function EventCard({ event, onRSVP }: EventCardProps) {
  const { user, isAuthenticated } = useAuth();
  const hasRSVPd = user && event.attendees.includes(user.id);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <img
        src={event.imageUrl}
        alt={event.title}
        className="h-48 w-full object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4">{event.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-5 h-5 mr-2" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="w-5 h-5 mr-2" />
            <span>{event.attendees.length} attending</span>
          </div>
        </div>

        <div className="mt-6">
          {isAuthenticated ? (
            <button
              onClick={() => onRSVP(event.id)}
              className={`w-full py-2 px-4 rounded-md transition-colors ${
                hasRSVPd
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {hasRSVPd ? 'You\'re Going!' : 'RSVP Now'}
            </button>
          ) : (
            <p className="text-center text-gray-600">Sign in to RSVP</p>
          )}
        </div>
      </div>
    </div>
  );
}