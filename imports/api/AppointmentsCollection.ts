import { Mongo } from 'meteor/mongo';

export interface Appointment {
  _id?: string;
  userId: string;
  firstName: string;
  lastName: string
  createdAt: Date;
  date: Date;
}

export const AppointmentsCollection = new Mongo.Collection<Appointment>('appointments');