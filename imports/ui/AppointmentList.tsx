import React, { useState } from 'react';
import { Meteor } from "meteor/meteor";
import { Appointment } from '../api/AppointmentsCollection';
import { Card } from './Card';

type AppointmentListElementProps = {
    appointment: Appointment,
    isSelected: boolean,
    setSelectedAppointmentId: (id: string | null) => void,
    handleDelete: (id?: string) => void
};

const renderAppointmentDate = (appointment: Appointment) => {
    if (!appointment.date) {
        return 'No Date';
    }
    const date = appointment.date.toLocaleDateString();

    const allDayChip = <span className="all-day-chip">all-day</span>
    return (
        <div className='no-wrap'>
            {date} {appointment?.isAllDay ? allDayChip : null}
        </div>
    );
}

const AppointmentListElement = ({
    appointment,
    isSelected,
    setSelectedAppointmentId,
    handleDelete
}: AppointmentListElementProps) => {
    return (
        <li
            className={'appointment-list-element' + (isSelected ? ' appointment-list-element-selected' : '')}
            onClick={() => setSelectedAppointmentId(appointment?._id || null)}
        >
            <div>
                {renderAppointmentDate(appointment)}
                <br/>
                <div style={{fontStyle: 'italic'}}>First Name: {appointment.firstName}</div>
                <div style={{fontStyle: 'italic'}}>Last Name: {appointment.lastName}</div>
            </div>
            <div>
                <button className="btn-base btn-error" onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    setSelectedAppointmentId(null)
                    handleDelete(appointment?._id)
                }}>
                    &times;
                </button>
            </div>
           
        </li>
    )
}

type AppointmentListProps = {
    appointments: Appointment[],
    selectedAppointmentId: string | null,
    setSelectedAppointmentId: (id: string | null) => void
};

export const AppointmentList = ({
    appointments,
    selectedAppointmentId, 
    setSelectedAppointmentId
}: AppointmentListProps) => {
    const [nameFilter, setNameFilter] = useState<string | null>(null);

    const handleDelete = (id?: string) => {
        if (id) {
            Meteor.call("appointments.delete", {_id: id});
        }
    };

    return (
        <Card title={'Appointments'}>
            <div className="appointment-list-filter">
                <input className="input-base" type='text' placeholder='Filter by name' value={nameFilter || ''} onChange={(e) => setNameFilter(e.target.value)}/>
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
                            isSelected={appointment._id === selectedAppointmentId}
                            setSelectedAppointmentId={setSelectedAppointmentId}
                            handleDelete={handleDelete}
                        />
                ))}
            </ul>
        </Card>
    )
};