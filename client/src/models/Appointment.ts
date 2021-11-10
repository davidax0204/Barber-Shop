import { User } from './user';

export interface Appointment {
  id: number;
  appointmentnDate: Date;
  appointmentCreationDate: Date;
  AppUser: User;
}
