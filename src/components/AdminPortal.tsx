import { useState } from 'react';
import { PlusCircle, Edit2, Trash2, Users, Calendar } from 'lucide-react';
import { Event, EventFormData, User } from '../types';
import EventForm from './EventForm';
import UserManagement from './UserManagement';

interface AdminPortalProps {
  events: Event[];
  onCreateEvent: (event: EventFormData) => void;
  onUpdateEvent: (id: string, event: EventFormData) => void;
  onDeleteEvent: (id: string) => void;
}

export default function AdminPortal({
  events,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
}: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<'events' | 'users'>('events');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const handleSubmit = (formData: EventFormData) => {
    if (editingEvent) {
      onUpdateEvent(editingEvent.id, formData);
    } else {
      onCreateEvent(formData);
    }
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center px-6 py-4 text-sm font-medium ${
              activeTab === 'events'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Events
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center px-6 py-4 text-sm font-medium ${
              activeTab === 'users'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="w-5 h-5 mr-2" />
            Users
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'events' ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Create Event</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendees</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={event.imageUrl}
                            alt=""
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{event.title}</div>
                            <div className="text-sm text-gray-500">{event.description.substring(0, 50)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{event.location}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{event.attendees.length}</td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEdit(event)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => onDeleteEvent(event.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <UserManagement />
        )}
      </div>

      {isFormOpen && (
        <EventForm
          event={editingEvent}
          onSubmit={handleSubmit}
          onClose={() => {
            setIsFormOpen(false);
            setEditingEvent(null);
          }}
        />
      )}
    </div>
  );
}