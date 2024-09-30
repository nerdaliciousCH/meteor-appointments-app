import React, { FormEvent, useEffect, useState } from 'react';
import { Meteor } from "meteor/meteor";
import { Appointment } from '../api/AppointmentsCollection';
import { Card } from './Card';
import { dateToISODateString } from '../utils/date';

const emptyAppointment: Appointment = {
    firstName: "",
    lastName: "",
    date: new Date(),
    userId: "",
    createdAt: new Date(),
}

type Props = {
    appointment: Appointment | null,
    setAppointment: (appointment: Appointment | null) => void
}

export const AppointmentCreateOrEdit = ({
    appointment, setAppointment
}: Props) => {
    const [currentAppointment, setCurrentAppointment] = useState<Appointment>(emptyAppointment);

    useEffect(() => {
            setCurrentAppointment(appointment || emptyAppointment);
    }, [appointment]);
    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!currentAppointment.firstName || !currentAppointment.lastName) return;

        if (appointment) {
            await Meteor.callAsync("appointments.update", {
                _id: appointment._id,
                doc: {
                    firstName: currentAppointment.firstName.trim(),
                    lastName: currentAppointment.lastName.trim(),
                    date: currentAppointment.date,
                }
            });
        } else {
            await Meteor.callAsync("appointments.create", {
                firstName: currentAppointment.firstName.trim(),
                lastName: currentAppointment.lastName.trim(),
                date: currentAppointment.date,
                createdAt: new Date(),
            });
            setAppointment(null);
            setCurrentAppointment(emptyAppointment);
        }
    };

    return (
        <Card title={appointment ? 'Edit appointment' : 'Create appointment'}>
            <form className="create-edit-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    required
                    placeholder="First Name" 
                    value={currentAppointment.firstName}
                    onChange={(e) => setCurrentAppointment(old => {
                        return {...old, firstName: e.target.value}
                    })}
                />
                <input
                    type="text"
                    required
                    placeholder="Last Name" 
                    value={currentAppointment.lastName}
                    onChange={(e) => setCurrentAppointment(old => {
                        return {...old, lastName: e.target.value}
                    })}
                />
                <input
                    type='date'
                    required
                    min={dateToISODateString(new Date())}
                    value={
                        currentAppointment.date ? 
                        dateToISODateString(currentAppointment.date) : 
                        dateToISODateString(new Date())
                    }
                    onChange={(e) => setCurrentAppointment(old => {
                        if (!e.target.value) return old;
                        return {...old, date: new Date(e.target.value)}
                    })}
                />
                <br/>
                <div className='btn-group-horizontal'>
                    <button className="btn-base btn-primary" type="submit">{appointment ? 'Save' : 'Create'}</button>
                    <button className="btn-base btn-primary" type='reset' onClick={() => {
                        if (appointment) {
                            setAppointment(null);
                        } else {
                            setCurrentAppointment(emptyAppointment);
                        }
                    }}>{appointment ? 'Cancel' : 'Reset'}</button>
                </div>
            </form>
        </Card>
    )
};