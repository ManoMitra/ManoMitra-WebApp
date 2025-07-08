
export type ReminderType = 'standard' | 'timed-location';

export interface Reminder {
  id: string;
  date: string; // ISO string for the date part
  time: string; // HH:mm format
  title: string;
  description: string;
  reminderType: ReminderType;
  locationId?: string;
  maxTime?: number; // In minutes
}

export interface Caregiver {
  id: string;
  name: string;
  relation: string;
  contact: string;
}

export interface Location {
  id:string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}
