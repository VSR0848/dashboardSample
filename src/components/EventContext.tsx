import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface Winner {
  position: number;
  house: string;
  name: string;
  points: number;
  photo?: string; // base64 or url
}

export interface Event {
  id: string;
  name: string;
  date: string;
  description: string;
  category: string;
  gradeLevel: string;
  venue: string;
  winners: Winner[];
}

interface EventContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const initialEvents: Event[] = [
  {
    id: '1',
    name: 'Classical Dance Competition',
    date: '2025-01-15',
    description: 'A classical dance event.',
    category: 'Individual',
    gradeLevel: 'Senior',
    venue: 'Main Auditorium',
    winners: [
      { position: 1, house: 'Delany', name: 'Sarah Johnson', points: 10 },
      { position: 2, house: 'Gandhi', name: 'Mike Chen', points: 7 },
      { position: 3, house: 'Tagore', name: 'Emma Wilson', points: 5 }
    ]
  },
  {
    id: '2',
    name: 'Choir Performance',
    date: '2025-01-20',
    description: 'A choir singing event.',
    category: 'Group',
    gradeLevel: 'Middle',
    venue: 'Music Hall',
    winners: [
      { position: 1, house: 'Aloysius', name: 'Team Alpha', points: 10 },
      { position: 2, house: 'Delany', name: 'Team Beta', points: 7 },
      { position: 3, house: 'Gandhi', name: 'Team Gamma', points: 5 }
    ]
  },
  {
    id: '3',
    name: 'Poetry Recitation',
    date: '2025-01-10',
    description: 'A poetry recitation event.',
    category: 'Individual',
    gradeLevel: 'Junior',
    venue: 'Lecture Hall',
    winners: [
      { position: 1, house: 'Tagore', name: 'Aman Kumar', points: 10 },
      { position: 2, house: 'Delany', name: 'Lisa Chen', points: 7 },
      { position: 3, house: 'Gandhi', name: 'Rohit Mehta', points: 5 }
    ]
  }
];

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>(initialEvents);

  const addEvent = (event: Omit<Event, 'id'>) => {
    setEvents(prev => [
      ...prev,
      { ...event, id: (Date.now() + Math.random()).toString() }
    ]);
  };

  const updateEvent = (event: Event) => {
    setEvents(prev => prev.map(e => (e.id === event.id ? event : e)));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  return (
    <EventContext.Provider value={{ events, addEvent, updateEvent, deleteEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error('useEventContext must be used within EventProvider');
  return ctx;
}; 