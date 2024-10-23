export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  lastLogin: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  attendees: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
}