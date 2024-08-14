import { Timestamp } from 'firebase/firestore';

export interface Event {
  id?: string;
  name: string;
  description: string;
  gardenId: string;
  date: Timestamp;
  location: string;
  maxParticipants?: number;
  organizers: string[];
  gardenName?: string;
}
