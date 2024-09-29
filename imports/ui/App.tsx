import React, { Fragment, useCallback } from 'react';
import { Meteor } from "meteor/meteor";
import { useTracker } from 'meteor/react-meteor-data';
import { Appointment } from '../api/AppointmentsCollection';
import { User } from './User';
import { LoginForm } from './LoginForm';
import { AppointmentCreateOrEdit } from './AppointmentCreateOrEdit';
import { AppointmentList } from './AppointmentList';

export const App = () => {
  const user = useTracker(() => Meteor.user());
  const [selectedAppointment, setSelectedAppointment] = React.useState<Appointment | null>(null);

  const setAppointment = useCallback((appointment: Appointment | null) => {
    setSelectedAppointment(oldState => {
      if (oldState?._id === appointment?._id) {
        return oldState;
      } else {
        return appointment;
      }
    });
  }, [setSelectedAppointment]);

  return (
    <div className="app-container">
      {user ? (
        <Fragment>
          <User />
          <div className="main-container">
            <div className="create-edit-container">
              <AppointmentCreateOrEdit appointment={selectedAppointment} setAppointment={setAppointment}/>
            </div>
            <div className="list-container">
              <AppointmentList selectedAppointment={selectedAppointment} setSelectedAppointment={setAppointment}/>
            </div>
          </div>
        </Fragment>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}
