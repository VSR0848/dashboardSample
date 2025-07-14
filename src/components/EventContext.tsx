import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

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

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'events'), (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Event));
    });
    return () => unsub();
  }, []);

  const addEvent = async (event: Omit<Event, 'id'>) => {
    await addDoc(collection(db, 'events'), event);
  };

  const updateEvent = async (event: Event) => {
    const eventRef = doc(db, 'events', event.id);
    await updateDoc(eventRef, { ...event });
  };

  const deleteEvent = async (id: string) => {
    const eventRef = doc(db, 'events', id);
    await deleteDoc(eventRef);
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