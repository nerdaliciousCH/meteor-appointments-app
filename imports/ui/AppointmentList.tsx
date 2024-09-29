import React, { useState } from 'react';
import { Meteor } from "meteor/meteor";
import { useTracker, useSubscribe } from 'meteor/react-meteor-data';
import { Appointment, AppointmentsCollection } from '../api/AppointmentsCollection';
import { Card } from './Card';

type AppointmentListElementProps = {
    appointment: Appointment,
    isSelected: boolean,
    setSelectedAppointment: (appointment: Appointment | null) => void,
    handleDelete: (id?: string) => void
};

const AppointmentListElement = ({
    appointment,
    isSelected,
    setSelectedAppointment,
    handleDelete
}: AppointmentListElementProps) => {
    return (
        <li
            className={'appointment-list-element' + (isSelected ? ' appointment-list-element-selected' : '')}
            onClick={() => setSelectedAppointment(appointment)}
        >
            <div>
                <div>{appointment.date ? appointment.date.toLocaleString() : 'Not A Date'}</div>
                <br/>
                <div style={{fontStyle: 'italic'}}>First Name: {appointment.firstName}</div>
                <div style={{fontStyle: 'italic'}}>Last Name: {appointment.lastName}</div>
            </div>
            <div>
                <button className="btn-base btn-error" onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    setSelectedAppointment(null)
                    handleDelete(appointment?._id)
                }}>
                    &times;
                </button>
            </div>
           
        </li>
    )
}

type AppointmentListProps = {
    selectedAppointment: Appointment | null,
    setSelectedAppointment: (appointment: Appointment | null) => void
};

export const AppointmentList = ({selectedAppointment, setSelectedAppointment}: AppointmentListProps) => {
    const user = useTracker(() => Meteor.user());
    const isLoading = useSubscribe("appointments");
    const [nameFilter, setNameFilter] = useState<string | null>(null);
    const appointments: Appointment[] = useTracker(() => {
        if (!user) {
          return [];
        }
        return AppointmentsCollection.find({}, {sort: {
          createdAt: 1
        }}).fetch()
    });

    const handleDelete = (id?: string) => {
        if (id) {
            Meteor.call("appointments.delete", {_id: id});
        }
    };

    if (isLoading()) {
        return <div>Loading ...</div>
    }

    return (
        <Card title={'Appointments'}>
            <div className="appointment-list-filter">
                <input type='text' placeholder='Filter by name' onChange={(e) => setNameFilter(e.target.value)}/>
                <button className="btn-base btn-primary" onClick={() => setNameFilter(null)}>Reset</button>
            </div>
            <ul>
                {appointments.filter((appointment) => {
                    if (nameFilter) {
                        return appointment.firstName.startsWith(nameFilter) || appointment.lastName.startsWith(nameFilter)
                    } else {
                        return true;
                    }
                }).map((appointment) => (
                        <AppointmentListElement
                            key={appointment._id}
                            appointment={appointment}
                            isSelected={appointment._id === selectedAppointment?._id}
                            setSelectedAppointment={setSelectedAppointment}
                            handleDelete={handleDelete}
                        />
                ))}
            </ul>
        </Card>
    )
};