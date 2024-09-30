import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { Meteor } from "meteor/meteor";
import { Appointment } from '../api/AppointmentsCollection';
import { Card } from './Card';
import { dateToISODateString, getDateTodayStrippedTime } from '../utils/date';

const emptyAppointment: Appointment = {
    firstName: "",
    lastName: "",
    date: getDateTodayStrippedTime(),
    userId: "",
    createdAt: new Date(),
    isAllDay: false
}

type Props = {
    appointments: Appointment[],
    appointmentId: string | null,
    setAppointmentId: (id: string | null) => void
}

export const AppointmentCreateOrEdit = ({
    appointments,
    appointmentId,
    setAppointmentId
}: Props) => {
    const [currentData, setCurrentData] = useState<Appointment>(emptyAppointment);
    const [allDayAllowed, setAllDayAllowed] = useState(true);
    const [saveAllowed, setSaveAllowed] = useState(true);

    useEffect(() => {
        setCurrentData(appointments.find((value) => value._id === appointmentId) || emptyAppointment);
    }, [appointmentId, appointments]);

    const sameDayAppointmentsCount = useMemo(
        () => {
            if (appointmentId) {
                return appointments.filter(a => a._id !== appointmentId).filter(a => a.date.getTime() === currentData.date.getTime()).length
            } else {
                return appointments.filter(a => a.date.getTime() === currentData.date.getTime()).length
            }
        }, 
    [currentData.date, appointments, appointmentId]);

    const currentDateHasAllDayAppointment = useMemo(
        () => {
            if (appointmentId) {
                return appointments.filter(a => a._id !== appointmentId).some(a => a.date.getTime() === currentData.date.getTime() && a.isAllDay)
            } else {
                return appointments.some(a => a.date.getTime() === currentData.date.getTime() && a.isAllDay)
            }
        },
    [currentData.date, appointments, appointmentId]);

    const appointment = useMemo(() => appointments.find(a => a._id === appointmentId), [appointmentId, appointments]);

    const hasChanges = useMemo(
        () => {
            if (appointment) {
                return currentData.firstName !== appointment?.firstName || currentData.lastName !== appointment?.lastName || currentData.date.getTime() !== appointment?.date.getTime() || currentData.isAllDay !== appointment?.isAllDay;
            } else {
                return true;
            }
        },
        [currentData, appointment]
    )

    useEffect(() => {
        if (appointmentId) {
            if (currentData.isAllDay) {
                if (sameDayAppointmentsCount > 0) {
                    setCurrentData(old => {
                        return {...old, isAllDay: false}
                    });
                    setAllDayAllowed(false);
                    setSaveAllowed(false);
                } else {
                    setAllDayAllowed(true);
                    setSaveAllowed(hasChanges && !currentDateHasAllDayAppointment);    
                }
            } else {
                setAllDayAllowed(sameDayAppointmentsCount === 0);
                setSaveAllowed(hasChanges && !currentDateHasAllDayAppointment);
            }
        } else {
            setAllDayAllowed(sameDayAppointmentsCount === 0);
            setSaveAllowed(!currentDateHasAllDayAppointment);
        }
    }, [sameDayAppointmentsCount, currentDateHasAllDayAppointment, hasChanges, currentData.isAllDay]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!currentData.firstName || !currentData.lastName) return;

        if (appointmentId) {
            await Meteor.callAsync("appointments.update", {
                _id: appointmentId,
                doc: {
                    firstName: currentData.firstName.trim(),
                    lastName: currentData.lastName.trim(),
                    date: currentData.date,
                    isAllDay: currentData.isAllDay
                }
            });
        } else {
            await Meteor.callAsync("appointments.create", {
                firstName: currentData.firstName.trim(),
                lastName: currentData.lastName.trim(),
                date: currentData.date,
                createdAt: new Date(),
                isAllDay: currentData.isAllDay
            });

            setAppointmentId(null);
            setCurrentData(emptyAppointment);
        }
    };

    return (
        <Card title={appointmentId ? 'Edit appointment' : 'Create appointment'}>
            <form className="create-edit-form" onSubmit={handleSubmit}>
                <input
                    className='input-base'
                    type="text"
                    required
                    placeholder="First Name" 
                    value={currentData.firstName}
                    onChange={(e) => setCurrentData(old => {
                        return {...old, firstName: e.target.value}
                    })}
                />
                <input
                    className='input-base'
                    type="text"
                    required
                    placeholder="Last Name" 
                    value={currentData.lastName}
                    onChange={(e) => setCurrentData(old => {
                        return {...old, lastName: e.target.value}
                    })}
                />
                <input
                    className='input-base'
                    type='date'
                    required
                    min={appointmentId ? undefined : dateToISODateString(new Date())}
                    value={dateToISODateString(currentData.date)}
                    onChange={(e) => setCurrentData(old => {
                        if (!e.target.value) return old;
                        return {...old, date: new Date(e.target.value)}
                    })}
                />
                <div>
                    <input
                        disabled={!allDayAllowed}
                        className='input-base'
                        id='cb-allday'
                        type='checkbox'
                        checked={currentData.isAllDay}
                        onChange={(e) => {
                            setCurrentData(old => {
                                return {...old, isAllDay: e.target.checked}
                            });
                        }}
                    />
                    <label className="input-label-base" htmlFor="cb-allday">All-day{!allDayAllowed ? ' (not possible)' : ''}</label>
                </div>
                <br/>
                <div className='btn-group-horizontal'>
                    <button className="btn-base btn-primary" type="submit" disabled={!saveAllowed}>{appointmentId ? 'Save' : 'Create'}</button>
                    <button className="btn-base btn-primary" type='reset' onClick={() => {
                        if (appointmentId) {
                            setAppointmentId(null);
                        } else {
                            setCurrentData(emptyAppointment);
                        }
                    }}>{appointmentId ? 'Cancel' : 'Reset'}</button>
                </div>
            </form>
        </Card>
    )
};